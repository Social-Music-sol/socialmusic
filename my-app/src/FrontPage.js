import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    const getRecentPosts = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_DOMAIN}/recent-feed?limit=50`);

      if (response.ok) {
        const postsData = await response.json();
        setPosts(postsData);
      }
    };

    const getProfilePicture = async () => {
      const userId = localStorage.getItem('user_id');
      
      const response = await fetch(`${process.env.REACT_APP_API_DOMAIN}/get-pfp?id=${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
    
      if (response.ok) {
        const userData = await response.json();
        setUserProfilePic(userData.pfp_url);
      }
    };
    
    if (username) {
      getProfilePicture().then(getRecentPosts);
    } else {
      getRecentPosts();
    }
  }, [username]);

  const handleCommentSubmit = async (e, postId) => {
    e.preventDefault();

    const commentContent = e.target.comment.value;
    e.target.comment.value = '';  // clear the input

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
      setPosts((prevPosts) => prevPosts.map(post =>
        post.id === postId
          ? { ...post, replies: [...post.replies, newComment] }
          : post
      ));
    }
  };

  return (
    <div className="container">
      <div className="header">
            <div className="header-left">
        <img src={textlogo} alt="JamJar Text Logo" className="textlogo" />
        {username && 
          <Link to="/post" className="create-post-button">
            <button className="post-button">+Post</button>
          </Link>
        }
      </div>
        <div className="header-right">
          {username && 
            <div className="pfp-container">
              <Link to={`/users/${username}`} className="pfp-link">
                <img src={userProfilePic || pfp} alt="Profile Icon" className="pfp" /> 
              </Link>
              <button className="logout-button" onClick={handleLogout}>Log-out</button>
            </div>
          }
        </div>
      </div>
      {!username && <Link to="/register">Register</Link>}
      <br />
      {!username && <Link to="/login">Login</Link>}
      <br />
      <div className="posts-container">
        {posts.map((post, index) => (
          <div key={index} className="post-box">
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
              <div className="comments-section">
              {post.replies.map((reply, index) => (
                <div key={index} className="reply-box">
                  <div className="reply-header">
                    <Link to={`/users/${reply.username}`} className="profile-link">
                      <img src={reply.poster_pfp_url} alt={`${reply.username}'s profile`} className="profile-icon" />
                    </Link>
                    <h3>{reply.username}</h3>
                  </div>
                  <p>{reply.content}</p>
                  {/* You can add more elements here as per your design */}
                </div>
              ))}
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
        ))}
      </div>
    </div>
  );
}

export default HomePage;
