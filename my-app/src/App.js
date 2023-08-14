// App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import RegisterPage from './RegisterPage';
import LoginPage from './LoginPage';
import PostForm from './PostPage';
import UserProfile from './ProfilePage'; 
import FrontPage from './FrontPage'; // update the path according to your directory structure

function App() {
  return (
    <Router>
      <div className="App">
        <div className="container">
          <Routes>
            <Route path="/" element={<FrontPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/post" element={<PostForm />} />
            <Route path="/users/:username" element={<UserProfile />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
export default App;
