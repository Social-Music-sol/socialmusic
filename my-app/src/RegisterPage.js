import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
        const loginData = await loginResponse.json();

        // Here we save the token and user id from the login response to local storage
        localStorage.setItem('token', loginData.token);
        localStorage.setItem('user_id', loginData.user_id);

        setUsername("");
        setPassword("");
        setEmail("");

        // Redirect the user to the home page
        navigate('/'); // navigate to homepage
      } else {
        // handle login error
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
