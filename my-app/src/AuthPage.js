import React from 'react';
import { Link } from "react-router-dom";
import './FrontPage.css';

function AuthPage() {
  return (
    <div className="container">
      <div className="auth-container">
        <Link className="create-post-button post-button" to="/register">Register</Link>
        <br />
        <Link className="create-post-button post-button" to="/login">Login</Link>
      </div>
    </div>
  );
}

export default AuthPage;