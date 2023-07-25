// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import RegisterPage from './RegisterPage';
import LoginPage from './LoginPage';
import PostForm from './PostForm';
import UserProfile from './UserProfile'; // import the new component
import { getLoggedInUser } from './utils'; // import the utility function
import Cookies from 'js-cookie'; // import js-cookie for cookie management


function App() {
  const username = getLoggedInUser();

  const getUserID = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_DOMAIN}/user-by-name/${username}`, 
    {method:'POST', credentials:'include'});

    if (response.ok) {
      const postData = await response.json();
      return postData.user_id;
    }
  };

  const handleLogout = async () => {
    localStorage.clear(); // clear all local storage
    const response = await fetch(`${process.env.REACT_APP_API_DOMAIN}/logout`);
    if (response.ok) {
      window.location.reload(); // refresh the page
      console.log('logged out!')
    }
  };

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
              {username && <Link to="/post">Create a Post</Link>}
              <br />
              {username && <Link to={`/users/${username}`}>Go to Profile</Link>}
              <br />
              {username && <button onClick={handleLogout}>Logout</button>}
            </div>
          } />
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