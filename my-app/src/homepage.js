// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import RegisterPage from './RegisterPage';
import LoginPage from './LoginPage';
import PostForm from './PostForm';
import UserProfile from './UserProfile'; // import the new component
import { getLoggedInUser } from './utils'; // import the utility function
import handleLogout from './handleLogout'; // import the logout function

function App() {
  const username = getLoggedInUser();

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={
            <div>
              <h1>JamJar</h1>
              {!username && <Link to="/register">Register</Link>}
              <br />
              {!username && <Link to="/login">Login</Link>}
              <br />
              {username && <Link to="/post">Create a Post</Link>}
              <br />
              {username && <Link to={`/users/${username}`}>Profile</Link>}
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
