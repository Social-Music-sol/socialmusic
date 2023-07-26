import React from 'react';
import { useHistory } from 'react-router-dom';
import './homePage.css'; // Import the CSS

function homePage() {
  const history = useHistory(); // Allows us to programatically change the route

  // Handle the box click
  const handleBoxClick = () => {
    history.push('/profile'); // change '/profile' to wherever you want to redirect
  };

  return (
    <div className="home-page">
      <h1>Welcome to Home Page!</h1>
      <div className="clickable-box" onClick={handleBoxClick}>
        Go to Profile
      </div>
    </div>
  );
}

export default HomePage;