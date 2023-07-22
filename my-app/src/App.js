import React, { useState, useEffect } from 'react';
import UserList from './UserList';
import AddUserForm from './AddUserForm';
import DeleteUserForm from './DeleteUserForm';
import homePage from './homePage'; // Adjust the import path according to your project structure
//import ProfilePage from './ProfilePage'; // Create and import your ProfilePage as well

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import ProfilePage from './ProfilePage';  // import the component for the profile page
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
      <Switch>
        <Route path="/profile">
          <ProfilePage />  // This is the profile page component
        </Route>
        <Route path="/">
          <div>
            <h1>User List</h1>
            {users.map((user, index) => (
              <div key={index}>
                <p>{user.name}</p>  {/* This assumes that user objects have a 'name' property */}
                <button onClick={() => handleDeleteUser(user.name)}>Delete</button>
              </div>
            ))}
            <form onSubmit={(event) => {
              event.preventDefault();
              const name = event.target.elements.name.value;
              handleAddUser(name);
              event.target.reset();
            }}>
              <input name="name" placeholder="New user name" required />
              <button type="submit">Add User</button>
            </form>
            <Link to="/profile">Go to profile</Link>
          </div>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
