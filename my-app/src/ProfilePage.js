import './FrontPage.css';
import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { getLoggedInUser, handleLike, handleLogout } from './utils';
import PostComponent from './PostComponent';
import textlogo from './images/textlogo.png';
const PROFILE_PIC_BASE_URL = 'https://jamjar.live/profile-pictures/';



export default function UserProfile() {
  const loggedInUser = getLoggedInUser();
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [profilePic, setProfilePic] = useState('');  // Default profile picture URL
  const [selectedFile, setSelectedFile] = useState(null);
  const [pfp, setPfp] = useState(''); // Add your default profile picture URL
  const username = getLoggedInUser();
  const pageUsername = useParams();
  const [userProfilePic, setUserProfilePic] = useState(null);
  const [isCommentsExpanded, setIsCommentsExpanded] = useState({});
  const [lastTimestamp, setLastTimestamp] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(false);
  const [userPageId, setUserPageId] = useState(null);
  const [userId, setUserId] = useState(localStorage.getItem('user_id'));

  useEffect(() => {
    if (username) {
      getProfilePicture();
    }
  }, [username, getProfilePicture]);

  useEffect(() => {
    if (!initialLoad) {
      getUserPosts();
    }
  }, [getUserPosts, initialLoad]);

  useEffect(() => {
    const getUserPageID = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_DOMAIN}/user-by-name/${pageUsername}`);
  
      if (response.ok) {
        const userData = await response.json();
        setUserPageId(userData.user_id);
        setFollowers(userData.followers);
        setFollowing(userData.following);
        setIsFollowing(userData.requester_following);
        setProfilePic(userData.pfp_url)
      }
    };
  
    getUserPageID();
    setPosts([]);
    getUserPosts();
  }, [pageUsername]);  // Only re-run this effect if 'username' changes

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
    if (!userPageId) return;  // Skip if 'userId' is not set yet
  
    const getProfilePicture = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_DOMAIN}/get-pfp?id=${userPageId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      if (response.ok) {
        const userData = await response.json();
        setProfilePic(userData.pfp_url);
      }
    };
  
    getProfilePicture();
  }, [userPageId]);  // Only re-run these effects if 'userId' changes
  
  const getUserPosts = useCallback(async () => {
    if (loading) return; 
    if (!userPageId) return;
    setLoading(true);
  
    const response = await fetch(
      `${process.env.REACT_APP_API_DOMAIN}/get-posts${userPageId}?limit=10` +
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
  }, [lastTimestamp, loading, initialLoad, userPageId]);

  useEffect(() => {
    const onScroll = () => {
        // Check if the user has scrolled to 300px from the bottom of the page.
        if (window.innerHeight + document.documentElement.scrollTop + 300 >= document.documentElement.offsetHeight) {
          getUserPosts();
        }
    };

    window.addEventListener('scroll', onScroll);
    return () => {
        window.removeEventListener('scroll', onScroll);
    };
  }, [getRecentPosts]);


  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('photo', selectedFile);
  
    const response = await fetch(`${process.env.REACT_APP_API_DOMAIN}/profile/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });
  
    if (response.ok) {
      const data = await response.json();
      // Update profile picture in the state, appending a cache-busting query parameter
      setProfilePic(PROFILE_PIC_BASE_URL + data.pfp_url + `?t=${Date.now()}`);  
    } else {
      alert('An error occurred while trying to upload your profile picture.');
    }
  };
  
  const handleFollow = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_DOMAIN}/follow-user?id=${userId}`, {
      method: isFollowing ? 'DELETE' : 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (response.ok) {
      setIsFollowing(!isFollowing);  // Invert the 'isFollowing' state
      // Update followers count based on follow/unfollow action
      setFollowers(isFollowing ? followers - 1 : followers + 1);
    } else {
      alert('An error occurred while trying to update your follow status.');
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="header-left">
          <Link to="/">
            <img src={textlogo} alt="JamJar Text Logo" className="textlogo" />
          </Link>
          {loggedInUser && 
            <Link to="/post" className="create-post-button">
              <button className="post-button">Post</button>
            </Link>
          }
        </div>
        <div className="header-right">
          {loggedInUser && 
            <div className="pfp-container">
              <Link to={`/users/${loggedInUser}`} className="pfp-link">
                <img src={profilePic || pfp} alt="Profile Icon" className="pfp" /> 
              </Link>
              <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>
          }
        </div>
      </div>
      <div>
        {profilePic && <img src={profilePic} alt="Profile" />}
        <h1>{username}</h1>
        {loggedInUser === username && (
          <>
            <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} /> {/* File input */}
            <button onClick={handleUpload}>Upload New Profile Picture</button> {/* Upload button */}
          </>
        )}
        {loggedInUser !== username && <button onClick={handleFollow}>{isFollowing ? 'Unfollow' : 'Follow'}</button>}
        <h2>Followers: {followers}</h2>
        <h2>Following: {following}</h2>
        <Link to="/">Go to Homepage</Link>
        <h2>Posts:</h2>
        {posts.map((post, index) => {
          console.log('Loading post. . . s');
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
      </div>
    </div>
  );
}