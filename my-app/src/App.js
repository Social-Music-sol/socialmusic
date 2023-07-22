import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
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
        <Routes>
          <Route path="/" element={
            <div>
              <h1>JamJar</h1>
              <a href="/RegisterPage">Register</a>
              <br />
              <a href="/LoginPage">Login</a>
              <AddUserForm onUserAdd={handleAddUser} />
              <DeleteUserForm onUserDelete={handleDeleteUser} />
              <UserList users={users} />
            </div>
          }/>
          <Route path="/RegisterPage" element={<RegisterPage />} />
          <Route path="/LoginPage" element={<LoginPage />} /> {/* Add this line */}
        </Routes>
      </div>
    </Router>
  );
}

const Navigation = () => {
  const location = useLocation();
  
  if (location.pathname === '/register') {
    return <Link to="/">Go to Home</Link>
  } else {
    return <Link to="/register">Register</Link>
  }
}

export default App;
