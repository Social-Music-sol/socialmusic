import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import PostComponent from './PostComponent';
import textlogo from './images/textlogo.png';

const PROFILE_PIC_BASE_URL = 'https://jamjar.live/profile-pictures/';

export default function UserProfile() {
  const loggedInUser = localStorage.getItem('username');
  const { username: pageUsername } = useParams();
  const [profilePic, setProfilePic] = useState('');
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isCommentsExpanded, setIsCommentsExpanded] = useState({});
  const [lastTimestamp, setLastTimestamp] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(false);
  const [userId, setUserId] = useState(localStorage.getItem('user_id'));

  

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
      setProfilePic(PROFILE_PIC_BASE_URL + data.pfp_url + `?t=${Date.now()}`);
    } else {
      alert('An error occurred while trying to upload your profile picture.');
    }
  };

  useEffect(() => {
    if (pageUsername) {
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
    }
  }, [pageUsername]);

  useEffect(() => {
    if (!initialLoad) {
      getUserPosts();
    }
  }, [getUserPosts, initialLoad]);

  useEffect(() => {
    if (!userPageId) return;
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
  }, [userPageId]);

  // ... existing useEffect and other code
  
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
    if (!initialLoad) {
      getUserPosts();
    }
  }, [getUserPosts, initialLoad]);

  useEffect(() => {
    const onScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop + 300 >= document.documentElement.offsetHeight) {
        getUserPosts();
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [getUserPosts]);

  useEffect(() => {
    // You can replace this with your server-side logic.
    // I am setting mock values here.
    setProfilePic(PROFILE_PIC_BASE_URL + pageUsername);
    setFollowers(100);
    setFollowing(50);
    setIsFollowing(false);
  }, [pageUsername]);

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
          {loggedInUser && (
            <Link to="/post" className="create-post-button">
              <button className="post-button">Post</button>
            </Link>
          )}
        </div>
      </div>
      <div className="profile-info">
        <img src={profilePic} alt="Profile" />
        {loggedInUser === pageUsername && (
          <>
            <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
            <button onClick={handleUpload}>Upload New Profile Picture</button>
          </>
        )}
        {loggedInUser !== pageUsername && (
          <button onClick={handleFollow}>{isFollowing ? 'Unfollow' : 'Follow'}</button>
        )}
        <p>Followers: {followers}</p>
        <p>Following: {following}</p>
      </div>
      <div className="posts-container">
        {posts.map((post, index) => (
          <PostComponent
            key={index}
            index={index}
            post={post}
            setPosts={setPosts}
            isCommentsExpanded={isCommentsExpanded}
            setIsCommentsExpanded={setIsCommentsExpanded}
          />
        ))}
      </div>
    </div>
  );
}
