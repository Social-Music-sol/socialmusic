import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import PostComponent from './PostComponent';
import textlogo from './images/textlogo.png';

// Initialize constants and URLs
const PROFILE_PIC_BASE_URL = 'https://jamjar.live/profile-pictures/';
const loggedInUser = localStorage.getItem('username');

export default function UserProfile() {
  const { username: viewedUsername } = useParams();

  // State management
  const [profilePicURL, setProfilePicURL] = useState('');
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [followStatus, setFollowStatus] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [posts, setPosts] = useState([]);
  const [commentsToggle, setCommentsToggle] = useState({});
  const [latestTimestamp, setLatestTimestamp] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [firstLoadComplete, setFirstLoadComplete] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(localStorage.getItem('user_id'));

  // Upload image logic
  const executeImageUpload = async () => {
    const formData = new FormData();
    formData.append('image', selectedImage);

    const response = await fetch(`${process.env.REACT_APP_API_DOMAIN}/profile/upload-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
      body: formData,
    });

    if (response.ok) {
      const responseData = await response.json();
      setProfilePicURL(`${PROFILE_PIC_BASE_URL}${responseData.profilePicture}?timestamp=${Date.now()}`);
    } else {
      alert('Failed to upload the profile picture.');
    }
  };

  // Fetching user posts
  const getUserPosts = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    const queryParams = latestTimestamp ? `&timestamp=${latestTimestamp}` : '';
    const response = await fetch(`${process.env.REACT_APP_API_DOMAIN}/get-user-posts/${viewedUsername}?limit=10${queryParams}`);

    if (response.ok) {
      const responseData = await response.json();
      const newPosts = responseData.posts;
      setPosts(prevPosts => [...prevPosts, ...newPosts]);
      if (newPosts.length) {
        setLatestTimestamp(responseData.timestamp);
      }
    }
    setIsLoading(false);
    if (!firstLoadComplete) {
      setFirstLoadComplete(true);
    }
  }, [viewedUsername, latestTimestamp, isLoading, firstLoadComplete]);

  // Effects
  useEffect(() => { if (!firstLoadComplete) getUserPosts(); }, [getUserPosts, firstLoadComplete]);
  useEffect(() => { window.addEventListener('scroll', () => { if (window.innerHeight + document.documentElement.scrollTop + 300 >= document.documentElement.offsetHeight) getUserPosts(); }); return () => { window.removeEventListener('scroll', getUserPosts); }; }, [getUserPosts]);
  useEffect(() => { setProfilePicURL(`${PROFILE_PIC_BASE_URL}${viewedUsername}`); setFollowerCount(100); setFollowingCount(50); setFollowStatus(false); }, [viewedUsername]);

  // Follow button logic
  const toggleFollowStatus = async () => {
    setFollowStatus(!followStatus);
  };

  return (
    <div className="UserProfile">
      {/* Header */}
      <div className="Header">
        <div className="Header-Left">
          <Link to="/">
            <img src={textlogo} alt="JamJar Text Logo" className="TextLogo" />
          </Link>
          {loggedInUser && <Link to="/post" className="CreatePostBtn"><button className="NewPostBtn">Post</button></Link>}
        </div>
      </div>
      
      {/* Profile Info */}
      <div className="ProfileSection">
        <img src={profilePicURL} alt="UserProfile" />
        {loggedInUser === viewedUsername && <><input type="file" onChange={(e) => setSelectedImage(e.target.files[0])} /><button onClick={executeImageUpload}>Upload Profile Picture</button></>}
        {loggedInUser !== viewedUsername && <button onClick={toggleFollowStatus}>{followStatus ? 'Unfollow' : 'Follow'}</button>}
        <p>Followers: {followerCount}</p>
        <p>Following: {followingCount}</p>
      </div>

      {/* Posts */}
      <div className="Posts">
        {posts.map((post, index) => (
          <PostComponent
            key={index}
            index={index}
            post={post}
            setPosts={setPosts}
            isCommentsExpanded={commentsToggle}
            setIsCommentsExpanded={setCommentsToggle}
          />
        ))}
      </div>
    </div>
  );
}
