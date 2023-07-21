import React, { useState } from 'react';

function AddUserForm() {
  const [username, setUsername] = useState('');

  const handleSubmit = event => {
    event.preventDefault();
    if (username) {
      fetch(`/add-user/${username}`, {
        method: 'GET',
      })
      .then(response => response.text())
      .then(message => {
        console.log(message);
        setUsername(''); // Clear the input field
        // You may want to fetch the updated list of users here
      })
      .catch(error => console.error('Error:', error));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        value={username} 
        onChange={event => setUsername(event.target.value)} 
        placeholder="Enter a username" 
      />
      <button type="submit">Add User</button>
    </form>
  );
}

export default AddUserForm;
