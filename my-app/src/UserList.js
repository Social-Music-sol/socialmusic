import React, { useState, useEffect } from 'react';

function UserList() {
  const [users, setUsers] = useState([]);  // Initialize state to hold user data

  // Fetch user data from Flask backend when component mounts
  useEffect(() => {
    fetch('/users')  // Make a GET request to the Flask /users endpoint
      .then(response => response.json())  // Parse the JSON response
      .then(data => setUsers(data))  // Update state with user data
      .catch(error => console.error('Error:', error));  // Log any errors
  }, []);  // Empty dependency array means this effect runs once when the component mounts

  // Render user data
  return (
    <ul>
      {users.map((user, index) => (
        <li key={index}>{user}</li>
      ))}
    </ul>
  );
}

export default UserList;
