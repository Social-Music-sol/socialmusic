const handleLogout = async () => {
  // Make a POST request to /logout
  const response = await fetch(`${process.env.REACT_APP_API_DOMAIN}/logout`, {
    method: 'POST',
    credentials: 'include', // Include cookies in the request
  });

  // Only clear local storage and cookies if the request was successful
  if (response.ok) {
    localStorage.removeItem('username');
    localStorage.removeItem('user_id');
  }
};

export default handleLogout;
