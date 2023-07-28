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
      const userId = localStorage.getItem('user_id'); // Replace 'userId' with the actual key you use to store the user id in local storage.
      
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

  return (
    <div className="container">
      <div className="header">
        <div className="header-left">
          <img src={textlogo} alt="JamJar Text Logo" className="textlogo" />
          {username && 
            <div className="create-post-button">
              <Link to="/post">
                <button className="post-button">+Post</button>
              </Link>
            </div>
          }
        </div>
        <div className="header-right">
          {username && 
            <div className="pfp-container">
            <Link to={`/users/${username}`} className="pfp-link">
              <img src={userProfilePic || pfp} alt="Profile Icon" className="pfp" /> 
            </Link>
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
