import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`${process.env.REACT_APP_API_DOMAIN}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        password,
        email
      })
    });

    if (response.ok) {
      // Here we directly call the login API once the registration is successful
      const loginResponse = await fetch(`${process.env.REACT_APP_API_DOMAIN}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          password
        })
      });

      if (loginResponse.ok) {
        const data = await response.json();
  
        // Store user id and username in local storage
        localStorage.setItem('user_id', data.user_id);
        localStorage.setItem('username', data.username);
  
        setUsername("");
        setPassword("");
  
        navigate('/'); // navigate to homepage
        window.location.reload(); // refresh the page
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

    } else {
      // handle registration error
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <button type="submit">Register</button>
      </form>
      <Link to="/">Go To Homepage</Link>
    </div>
  );
}

export default RegisterPage;
