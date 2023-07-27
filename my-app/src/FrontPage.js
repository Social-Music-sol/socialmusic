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
    }, []);
    
    return (
      <div className="container">
        <div className="header">
          <img src={textlogo} alt="JamJar Text Logo" className="textlogo" />
          {username && 
            <Link to="/post">
              <button className="post-button">+Post</button>
            </Link>
          }
          {username ? (
            <div className="pfp-container">
              <Link to={`/users/${username}`}>
                <img src={pfp} alt="Profile Icon" className="pfp" />
              </Link>
              <button className="logout-button" onClick={handleLogout}>Log-out</button>
            </div>
          ) : (
            <div>
              <Link to="/register">Register</Link>
              <br />
              <Link to="/login">Login</Link>
            </div>
          )}
        </div>
        <div className="posts-container">
          {posts.map((post, index) => (
            {/* Rendering posts code here */}
          ))}
        </div>
      </div>
    );
}

export default HomePage;
