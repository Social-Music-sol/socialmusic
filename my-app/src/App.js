// App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import RegisterPage from './RegisterPage';
import LoginPage from './LoginPage';
import PostForm from './PostPage';
import UserProfile from './ProfilePage'; 
import { getLoggedInUser, handleLogout, handleLike } from './utils';
import './App.css'; // Import your CSS file
import textlogo from './images/textlogo.png'
import pfp from './images/circle.png';  // import the profile icon image


function HomePage() {
  const username = getLoggedInUser();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getRecentPosts = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_DOMAIN}/recent-feed`);

      if (response.ok) {
        const postsData = await response.json();
        setPosts(postsData);

        setLikedPosts(postsData.filter(post => post.liked_by_requester).map(post => post.id));
      }
    };

    getRecentPosts();
  }, []);

  return (
    <div>
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
        </div>
      }
      {!username && <Link to="/register">Register</Link>}
      <br />
      {!username && <Link to="/login">Login</Link>}
      <br />
      {username && <button onClick={handleLogout}>Logout</button>}
      <h2>Recent Jams:</h2>
      {posts.map((post, index) => (
        <div key={index} className="post-box">
          <Link to={`/users/${post.username}`}>
            <h3>{post.username}</h3>
          </Link>
          <p>{post.content}</p>
          <p>{post.image_url}</p>
          <p>{post.created_at}</p>
          <div style={{left: 0, width: 900, height: 180, position: 'relative'}} dangerouslySetInnerHTML={{
            __html: `<iframe src=${post.song_embed_url} style="top: 0; left: 0; width: 100%; height: 100%; position: absolute; border: 0;" allowfullscreen allow="clipboard-write; encrypted-media; fullscreen; picture-in-picture; autoplay;"></iframe>`
          }}>
          </div>
          <p>Likes: {post.like_count}</p>
          <button onClick={() => handleLike(post.id, posts, setPosts)}>
            {post.liked_by_requester ? 'Unlike' : 'Like'}
          </button>
        </div>
      ))}
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/post" element={<PostForm />} />
          <Route path="/users/:username" element={<UserProfile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
