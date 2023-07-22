import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import RegisterPage from './RegisterPage';
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
    <Router>
      <div className="App">
        <h1>JamJar</h1>
        <Link to="/register">Register</Link>  {/* Add this line */}
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<>
            <AddUserForm onUserAdd={handleAddUser} />
            <DeleteUserForm onUserDelete={handleDeleteUser} />
            <UserList users={users} />
          </>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
