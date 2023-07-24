// UserProfile.js
import React from 'react';
import { Link, useParams } from "react-router-dom";

function UserProfile() {
  // We use the `useParams` hook here to get the dynamic parts of the URL.
  let { username } = useParams();

  return (
    <div>
      <h2>User Profile: {username}</h2>
      <Link to="/">Go to Homepage</Link>
    </div>
  );
}

export default UserProfile;
