import React, { useState, useEffect } from 'react';
import UserList from './UserList';
import AddUserForm from './AddUserForm';

function App() {
  const [users, setUsers] = useState([]); 

  const fetchUsers = () => {
    fetch('/users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error:', error));
  };

  useEffect(fetchUsers, []);  // Fetch the list of users when the component mounts

  return (
    <div className="App">
      <h1>JamJar</h1>
      <AddUserForm onUserAdded={fetchUsers} />
      <UserList users={users} />
    </div>
  );
}

export default App;
