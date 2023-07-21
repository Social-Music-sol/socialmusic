import React from 'react';
import './UserCard.css'; // Import CSS

const UserCard = ({ user }) => {
  return (
    <div className="user-card">
      <p>{user.name}</p> // Assuming user object has a username property
    </div>
  );
};

export default UserCard;
