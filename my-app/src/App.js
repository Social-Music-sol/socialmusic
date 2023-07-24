// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import RegisterPage from './RegisterPage';
import LoginPage from './LoginPage';
import PostForm from './PostForm';
import UserProfile from './UserProfile'; // import the new component


function App() {
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
          <Route path="/post" element={<PostForm />} /> 
          <Route path="/users/:username" element={<UserProfile />} /> {/* new route for user profiles */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
