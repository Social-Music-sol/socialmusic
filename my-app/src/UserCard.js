import React from 'react';
import './UserCard.css'; // Import CSS

const UserCard = ({ user }) => {
  return (
    <div className="user-card">
      <p>{user.name}</p>
    </div>
  );
};

export default UserCard;
