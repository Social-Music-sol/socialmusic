import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faCircle } from '@fortawesome/free-solid-svg-icons';
import { getLoggedInUser, handleLogout, handleLike, handleCommentSubmit, handleToggleComments} from './utils';
import textlogo from './images/textlogo.png';
import pfp from './images/circle.png';
import './FrontPage.css';
import PostComponent from './PostComponent';
import UIComponent from './UIComponent'; // Adjust the path as necessary



function HomePage() {
  const [color, setColor] = useState("#FFFFFF"); // Default color is white
  const [username, setUsername] = useState(null);  const [posts, setPosts] = useState([]);
  const [userProfilePic, setUserProfilePic] = useState(null);
  const [isCommentsExpanded, setIsCommentsExpanded] = useState({});
  const [lastTimestamp, setLastTimestamp] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(false);
  const [userId, setUserId] = useState(localStorage.getItem('user_id'));
  const [headerHidden, setHeaderHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

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
      <div className={`header ${headerHidden ? 'header-hide' : ''}`} style={{backgroundColor: color}}>
        <div className="header-left">
          <Link to="/">
            <img src={textlogo} alt="JamJar Text Logo" className="textlogo" />
          </Link>
          {username && 
            <Link to="/post" className="create-post-button">
              <button className="post-button">Post</button>
            </Link>
          }
        </div>
        <div className="header-right">
  {username && (  // Conditional rendering here
    <div className="pfp-container">
      <Link to={`/users/${username}`} className="pfp-link">
        <img src={userProfilePic || pfp} alt={`${username}'s Profile Icon`} className="pfp" /> 
      </Link>
      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </div>
  )}
  <UIComponent onColorChange={setColor} style={{ paddingRight: "10px" }} />
</div>
      </div>
      {!username && <Link className="create-post-button post-button" to="/register">Register</Link>}
      <br />
      {!username && <Link className="create-post-button post-button" to="/login">Login</Link>}
      <br />
      <div className="posts-container">
        {posts.map((post, index) => {
          console.log('Loading post. . . ');
          return <PostComponent
            color={color}
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
