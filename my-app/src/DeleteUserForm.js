import React, { useState } from 'react';

function DeleteUserForm({ onUserDelete }) {
  const [name, setName] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onUserDelete(name);
    setName("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter user name" required />
      <button type="submit">Delete User</button>
    </form>
  );
}

export default DeleteUserForm;
