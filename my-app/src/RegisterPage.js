import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('https://findingnasa.xyz/api/register', { // replace '/api/endpoint' with your real API endpoint
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
      setUsername("");
      setPassword("");
      setEmail("");
    } else {
      // handle the error
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
