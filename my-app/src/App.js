import React from 'react';
import UserList from './UserList';
import AddUserForm from './AddUserForm';

function App() {
  return (
    <div className="App">
      <h1>User List</h1>
      <AddUserForm />
      <UserList />
    </div>
  );
}

export default App;
