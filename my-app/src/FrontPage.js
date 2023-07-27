import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faCircle } from '@fortawesome/free-solid-svg-icons';
import { getLoggedInUser, handleLogout, handleLike } from './utils';
import textlogo from './images/textlogo.png';
import pfp from './images/circle.png';
import './FrontPage.css'; // Import your CSS file

function HomePage() {
    const username = getLoggedInUser();
    const [posts, setPosts] = useState([]);
  
    useEffect(() => {
      const getRecentPosts = async () => {
        const response = await fetch(`${process.env.REACT_APP_API_DOMAIN}/recent-feed?limit=50`);
  
        if (response.ok) {
          const postsData = await response.json();
          setPosts(postsData);
        }
      };
  
      getRecentPosts();
      setTimeout(() => setLoading(false), 2000); // <-- Add this line
    }, []);
  
    if (loading) return <div>Loading...</div>; // <-- Add this line
  
    return (
      <div className="container">
        <div className="header">
          <img src={textlogo} alt="JamJar Text Logo" className="textlogo" />
          {username && 
            <div className="create-post-button">
              <Link to="/post">
                <button className="post-button">+Post</button>
              </Link>
            </div>
          }
        </div>
        {username && 
          <div className="pfp-container">
            <Link to={`/users/${username}`}>
              <img src={pfp} alt="Profile Icon" className="pfp" />
            </Link>
            <button className="logout-button" onClick={handleLogout}>Log-out</button>
          </div>
        }
        {!username && <Link to="/register">Register</Link>}
        <br />
        {!username && <Link to="/login">Login</Link>}
        <br />
        <div className="posts-container">
          {posts.map((post, index) => (
            <div key={index} className="post-box">
              <div className="post-content">
                <div className="post-embed">
                  <div style={{width: '100%', height: '100%', position: 'relative'}} dangerouslySetInnerHTML={{
                    __html: `<iframe src=${post.song_embed_url} style="top: 0; left: 0; width: 100%; height: 100%; position: absolute; border: 0;" allowfullscreen allow="clipboard-write; encrypted-media; fullscreen; picture-in-picture; autoplay;"></iframe>`
                  }}>
                  </div>
                </div>
                <div className="post-text">
                  <Link to={`/users/${post.username}`}>
                    <h3>{post.username}</h3>
                  </Link>
                  <div className="caption-container">
                    <p>{post.content}</p>
                  </div>
                  <p>{post.image_url}</p>
                </div>
                <Link to={`/users/${post.username}`} className="profile-link">
                  <FontAwesomeIcon icon={faCircle} className="profile-icon" />
                </Link>
              </div>
              <div className="like-container">
                <FontAwesomeIcon 
                  icon={post.liked_by_requester ? faHeart : faHeart} 
                  className="like-button" 
                  style={{ color: post.liked_by_requester ? 'pink' : 'black' }}
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
