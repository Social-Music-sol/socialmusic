import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faCircle } from '@fortawesome/free-solid-svg-icons';
import { getLoggedInUser, handleLogout, handleLike } from './utils';
import textlogo from './images/textlogo.png';
import pfp from './images/circle.png';
import './FrontPage.css';

function HomePage() {
  const username = getLoggedInUser();
  const [posts, setPosts] = useState([]);
  const [userProfilePic, setUserProfilePic] = useState(null);
  const [isCommentsExpanded, setIsCommentsExpanded] = useState({});
  const [lastTimestamp, setLastTimestamp] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(localStorage.getItem('user_id'));

  useEffect(() => {
    setUserId(localStorage.getItem('user_id'));
  }, [username]);

  const observer = useRef();

  const getRecentPosts = useCallback(async () => {
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
    setLoading(false);
  }, [lastTimestamp]);

  const lastPostElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[entries.length - 1].isIntersecting) {
        getRecentPosts();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, getRecentPosts]);

  const handleToggleComments = (postId) => {
    setIsCommentsExpanded(prevState => ({
      ...prevState,
      [postId]: !prevState[postId]
    }));
  };

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
    getRecentPosts();
  }, [username, getRecentPosts, getProfilePicture]);

  const handleCommentSubmit = async (e, postId) => {
    e.preventDefault();
  
    const commentContent = e.target.comment.value;
    e.target.comment.value = ''; 
  
    const response = await fetch(`${process.env.REACT_APP_API_DOMAIN}/post`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: commentContent,
        parent_id: postId,
      }),
    });
  
    if (response.ok) {
      const newComment = await response.json();
  
      newComment.username = username;
      newComment.poster_pfp_url = userProfilePic;
  
      setPosts((prevPosts) => prevPosts.map(post =>
        post.id === postId
          ? { ...post, replies: [...post.replies, newComment] }
          : post
      ));
  
      handleToggleComments(postId);
    }
  };

  
  return (
    <div className="container">
      <div className="header">
        <div className="header-left">
          <Link to="/">
            <img src={textlogo} alt="JamJar Text Logo" className="textlogo" />
          </Link>
          {username && 
            <Link to="/post" className="create-post-button">
              <button className="post-button">+++</button>
            </Link>
          }
        </div>
        <div className="header-right">
          {username && 
            <div className="pfp-container">
              <Link to={`/users/${username}`} className="pfp-link">
                <img src={userProfilePic || pfp} alt="Profile Icon" className="pfp" /> 
              </Link>
              <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>
          }
        </div>
      </div>
      {!username && <Link to="/register">Register</Link>}
      <br />
      {!username && <Link to="/login">Login</Link>}
      <br />
      <div className="posts-container">
        {posts.map((post, index) => {
          const isLastPost = posts.length === index + 1;
          return (
            <div ref={isLastPost ? lastPostElementRef : null} key={index} className="post-box">
              <div className="post-header">
                <Link to={`/users/${post.username}`} className="profile-link">
                  <img src={post.poster_pfp_url} alt={`${post.username}'s profile`} className="profile-icon" />
                </Link>
                <h3>{post.username}</h3>
              </div>
              <div className="post-content">
                <div className="post-embed">
                  <div className="embed-container" dangerouslySetInnerHTML={{
                    __html: `<iframe src=${post.song_embed_url} class="spotify-embed" allowfullscreen allow="clipboard-write; encrypted-media; fullscreen; picture-in-picture; autoplay;"></iframe>`
                  }}>
                  </div>
                </div>
                {post.content && (
                  <div className="post-text-container">
                    <div className="post-text">
                      <p>{post.content}</p>
                    </div>
                  </div>
                )}
                <div className={`comments-section ${isCommentsExpanded[post.id] ? 'expanded' : ''}`}>
                  {(isCommentsExpanded[post.id] ? post.replies : post.replies.slice(0, 1)).map((reply, index) => (
                    <div key={index} className="reply-box">
                      <div className="reply-header">
                        <Link to={`/users/${reply.username}`} className="profile-link">
                          <img src={reply.poster_pfp_url} alt={`${reply.username}'s profile`} className="profile-icon" />
                        </Link>
                        <h3>{reply.username}</h3>
                      </div>
                      <p>{reply.content}</p>
                    </div>
                  ))}
                  <div className="expand-collapse-container">
                    <button onClick={() => handleToggleComments(post.id)}>
                      {isCommentsExpanded[post.id] ? 'Collapse' : 'Expand'} comments
                    </button>
                  </div>
                  <form onSubmit={(e) => handleCommentSubmit(e, post.id)} className="comment-form">
                    <input type="text" name="comment" placeholder="Add a comment..." />
                    <button type="submit">Comment</button>
                  </form>
                </div>
              </div>
              <div className="like-container">
                <FontAwesomeIcon 
                  icon={post.liked_by_requester ? faHeart : faHeart} 
                  className="like-button" 
                  style={{ color: post.liked_by_requester ? 'red' : 'pink' }}
                  onClick={() => handleLike(post.id, posts, setPosts)}
                />
                <p>{post.like_count}</p>
              </div>
            </div>
          );
        })}
        {loading && <p>Loading...</p>}
      </div>
    </div>
  );  
}

export default HomePage;
