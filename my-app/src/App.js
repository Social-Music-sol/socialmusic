// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterPage from './RegisterPage';
import LoginPage from './LoginPage';
import PostForm from './PostPage';
import UserProfile from './ProfilePage'; 
import FrontPage from './FrontPage'; 
import AuthPage from './AuthPage';  // Make sure you import AuthPage

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
            <Route path="/auth" element={<AuthPage />} />  {/* Add this line for the AuthPage route */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
