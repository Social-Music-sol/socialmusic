import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import RegisterPage from './RegisterPage';
import LoginPage from './LoginPage';
import PostForm from './PostForm';


function App() {
  const handlePost = async (songLink, pictureUrl, caption) => {

    const response = await fetch('http://52.38.156.74:5000/post', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        content: caption,
        image_url: pictureUrl,
        song_url: songLink
      })
    });
  
    const data = await response.json();
  
    if (data.message) {
      alert(data.message);
    }
  };

  <PostForm onPost={handlePost} />
  return (
    <Router>
    <div className="App">
      <Routes>
        <Route path="/" element={
          <div>
            <h1>JamJar</h1>
            <Link to="/register">Register</Link>
            <br />
            <Link to="/login">Login</Link>
            <br />
            <Link to="/post">Create a Post</Link>
          </div>
        } />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/post" element={<PostForm onPost={handlePost} />} /> 
      </Routes>
    </div>
    </Router>
  );
}

export default App;

