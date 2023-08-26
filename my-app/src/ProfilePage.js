import './FrontPage.css';
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { handleLogout } from './utils';
import PostComponent from './PostComponent';
import textlogo from './images/textlogo.png';
const PROFILE_PIC_BASE_URL = 'https://jamjar.live/profile-pictures/';

export default function UserProfile() {
  const loggedInUser = localStorage.getItem('username');
  const { username: pageUsername } = useParams();
  const [posts, setPosts] = useState([]);
  const [isCommentsExpanded, setIsCommentsExpanded] = useState({});
  const [lastTimestamp, setLastTimestamp] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(false);
  const [profilePic, setProfilePic] = useState('');

  // Fetch posts for the user whose page we're on
  const getUserPosts = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    const response = await fetch(
      `${process.env.REACT_APP_API_DOMAIN}/get-user-posts/${pageUsername}?limit=10` +
      (lastTimestamp ? `&timestamp=${lastTimestamp}` : '')
    );

    if (response.ok) {
      const postsData = await response.json();
      const newPosts = postsData.posts;
      setPosts(prevPosts => [...prevPosts, ...newPosts]);
      if (newPosts.length > 0) {
        setLastTimestamp(postsData.timestamp);
      }
    }

    setLoading(false);

    if (!initialLoad) {
      setInitialLoad(true);
    }
  }, [pageUsername, lastTimestamp, loading, initialLoad]);

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
        <div className="header-right">
          {loggedInUser && (
            <div className="pfp-container">
              <Link to={`/users/${loggedInUser}`} className="pfp-link">
                <img src={profilePic} alt="Profile Icon" className="pfp" />
              </Link>
              <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
      {/* Existing Profile Details and UI here */}
      <div className="posts-container">
        {posts.map((post, index) => (
          <PostComponent
            key={index}
            index={index}
            post={post}
            setPosts={setPosts}
            isCommentsExpanded={isCommentsExpanded}
            setIsCommentsExpanded={setIsCommentsExpanded}
            posts={posts}
          />
        ))}
        {loading && <p>Loading...</p>}
      </div>
    </div>
  );
}
