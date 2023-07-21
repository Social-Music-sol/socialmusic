import React, { useState, useEffect } from 'react';
import UserCard from './UserCard';
import './UserList.css'; // import CSS for user list

function UserList() {
  const [users, setUsers] = useState([]); 

  useEffect(() => {
    fetch('/users')
      .then(response => response.json())  
      .then(data => setUsers(data)) 
      .catch(error => console.error('Error:', error));
  }, []);

  return (
    <div className="user-list">
      {users.map((user, index) => (
        <UserCard key={index} user={user} />
      ))}
    </div>
  );
}

export default UserList;
