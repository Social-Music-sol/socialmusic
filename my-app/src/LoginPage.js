import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    const response = await fetch(`${process.env.REACT_APP_API_DOMAIN}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        password
      }),
      credentials: 'include'
    });
    if (response.ok) {
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
  };
  
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      <a href="/">Go to Homepage</a>
    </div>
  );
}

export default LoginPage;
