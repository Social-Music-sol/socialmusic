import React, { useState, useEffect } from 'react';
import UserList from './UserList';
import AddUserForm from './AddUserForm';
import DeleteUserForm from './DeleteUserForm';

function App() {
  const [users, setUsers] = useState([]);

  const fetchUsers = () => {
    fetch('/users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error:', error));
  };

  useEffect(fetchUsers, []);

  const handleAddUser = (name) => {
    fetch(`/add-user/${name}`, {
      method: 'POST'
    })
    .then(fetchUsers)
    .catch(error => console.error('Error:', error));
  };

  const handleDeleteUser = (name) => {
    fetch(`/delete-user/${name}`, {
      method: 'DELETE'
    })
    .then(fetchUsers)
    .catch(error => console.error('Error:', error));
  };

  return (
    <div className="App">
      <h1>User List</h1>
      <AddUserForm onUserAdd={handleAddUser} />
      <DeleteUserForm onUserDelete={handleDeleteUser} />
      <UserList users={users} />
    </div>
  );
}

export default App;
