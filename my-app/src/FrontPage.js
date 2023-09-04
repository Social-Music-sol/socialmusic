import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faCircle } from '@fortawesome/free-solid-svg-icons';
import { getLoggedInUser, handleLogout, handleLike, handleCommentSubmit, handleToggleComments} from './utils';
import textlogo from './images/textlogo.png';
import postbutton from './images/post_button.png';
import pfp from './images/circle.png';
import './FrontPage.css';
import PostComponent from './PostComponent';


function HomePage() {
  const [username, setUsername] = useState(null);  const [posts, setPosts] = useState([]);
  const [userProfilePic, setUserProfilePic] = useState(null);
  const [isCommentsExpanded, setIsCommentsExpanded] = useState({});
  const [lastTimestamp, setLastTimestamp] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(false);
  const [userId, setUserId] = useState(localStorage.getItem('user_id'));
  const [headerHidden, setHeaderHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showPostForm, setShowPostForm] = useState(false); // New state for toggling post form
  const togglePostForm = () => {
    setShowPostForm(prevState => !prevState);
  };
  // PostForm inner logic...
  const [songLink, setSongLink] = useState('');
  const [caption, setCaption] = useState('');

  const navigate = useNavigate();

  const handlePost = async (songLink, caption) => {
    const response = await fetch(`${process.env.REACT_APP_API_DOMAIN}/post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        content: caption,
        song_url: songLink
      })
    });

    const data = await response.json();

    if (data.message) {
      alert(data.message);
    }
    navigate('/');
    togglePostForm(); // Close the form after posting
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handlePost(songLink, caption);
    setSongLink('');
    setCaption('');
  };

  useEffect(() => {
    if (!username) {
      // Fetch username if not set
      setUsername(getLoggedInUser());
    }
    if (username) {
      getProfilePicture();
    }
  }, [username, getProfilePicture]);
  

  const getRecentPosts = useCallback(async () => {
    if (loading) return; 
    setLoading(true);
  
    const response = await fetch(
      `${process.env.REACT_APP_API_DOMAIN}/recent-feed?limit=10` +
      (lastTimestamp ? `&timestamp=${lastTimestamp}` : '')
    );
  
    if (response.ok) {
      const postsData = await response.json();
      const posts = postsData.posts;
      setPosts(prevPosts => [...prevPosts, ...posts]);
  
      if (posts.length > 0) {
        setLastTimestamp(postsData.timestamp);
      }
    } 
    
    if (response.status !== 418) {
      setLoading(false);
    }
  
    
    if (!initialLoad) setInitialLoad(true);
  }, [lastTimestamp, loading, initialLoad]);

  useEffect(() => {
    const onScroll = () => {
        // Check if the user has scrolled to 300px from the bottom of the page.
        if (window.innerHeight + document.documentElement.scrollTop + 300 >= document.documentElement.offsetHeight) {
          // Call getRecentPosts if they have.
          getRecentPosts();
        }
    };

    window.addEventListener('scroll', onScroll);
    return () => {
        window.removeEventListener('scroll', onScroll);
    };
  }, [getRecentPosts]);
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        setHeaderHidden(true);
      } else {
        setHeaderHidden(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  const getProfilePicture = useCallback(async () => {
    let cachedPfpUrl = localStorage.getItem('pfp_url');
  
    if (userId) {
      if (!cachedPfpUrl) {
        const response = await fetch(`${process.env.REACT_APP_API_DOMAIN}/get-pfp?id=${userId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
  
        if (response.ok) {
          const userData = await response.json();
          setUserProfilePic(userData.pfp_url);
          localStorage.setItem('pfp_url', userData.pfp_url);
        }
      } else {
        setUserProfilePic(cachedPfpUrl);
      }
    }
  }, [userId]);

  useEffect(() => {
    if (username) {
      getProfilePicture();
    }
  }, [username, getProfilePicture]);

  useEffect(() => {
    if (!initialLoad) {
      getRecentPosts();
    }
  }, [getRecentPosts, initialLoad]);


  return (
    <div className="container">
      <div className={`header ${headerHidden ? 'header-hide' : ''}`}>
        <div className="header-left">
          <Link to="/">
            <img src={textlogo} alt="JamJar Text Logo" className="textlogo" />
          </Link>
          {username && 
            <button onClick={togglePostForm} className="create-post-button">
              <img src={postbutton} alt="Post Button" className="post-button" />
            </button>
          }
        </div>
        <div className="header-right">
          {username && (  // Conditional rendering here
            <div className="pfp-container">
                <div className="pfp-dropdown">
                    <Link to={`/users/${username}`} className="pfp-link">
                        <img src={userProfilePic || pfp} alt={`${username}'s Profile Icon`} className="pfp" />
                    </Link>
                    <div className="pfp-dropdown-content">
                        <Link to={`/users/${username}`}>Profile</Link>
                        <a href="#" onClick={handleLogout}>Logout</a> {/* Changed button to a link */}
                    </div>
                </div>
            </div>
          )}
        </div>
      </div>
      {showPostForm && 
        <div className="post-dropdown">
          <h2>Post</h2>
          <form onSubmit={handleSubmit}>
            <input type="url" placeholder="Song Link" value={songLink} onChange={e => setSongLink(e.target.value)} required />
            <input type="text" placeholder="Caption" value={caption} onChange={e => setCaption(e.target.value)} />
            <button type="submit">Post</button>
          </form>
        </div>
      }
      {!username && <Link className="create-post-button post-button" to="/register">Register</Link>}
      <br />
      {!username && <Link className="create-post-button post-button" to="/login">Login</Link>}
      <br />
      <div className="posts-container">
        {posts.map((post, index) => {
          return <PostComponent
            key={index}
            index={index}
            post={post}
            setPosts={setPosts}
            isCommentsExpanded={isCommentsExpanded}
            setIsCommentsExpanded={setIsCommentsExpanded}
            posts={posts}
            />;
        })}
        {loading && <p>Loading...</p>}
      </div>
    </div>
  );
}
export default HomePage;
