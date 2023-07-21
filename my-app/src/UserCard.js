import React from 'react';
import './UserCard.css'; // Import CSS

const UserCard = ({ user }) => {
  return (
    <div className="user-card">
      <p>{user}</p>
    </div>
  );
};

export default UserCard;
