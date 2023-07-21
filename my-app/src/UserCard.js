import React from 'react';
import './UserCard.css';

const UserCard = ({ user }) => {
  return (
    <div className="user-card">
      <p>{user.username}</p>
    </div>
  );
};

export default UserCard;
