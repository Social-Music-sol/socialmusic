import React, { useState, useEffect } from 'react';
import UserList from './UserList';
import AddUserForm from './AddUserForm';
import DeleteUserForm from './DeleteUserForm';
import RegisterPage from './RegisterPage'; // Import the RegisterPage component
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

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
        <Link to="/register">Register</Link>
        <Switch>
          <Route path="/register">
            <RegisterPage />
          </Route>
          <Route path="/">
            <AddUserForm onUserAdd={handleAddUser} />
            <DeleteUserForm onUserDelete={handleDeleteUser} />
            <UserList users={users} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
