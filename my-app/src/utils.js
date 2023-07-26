// utils.js
export function getLoggedInUser() {
    return localStorage.getItem('username');
  }
  
export const handleLogout = async () => {
// Make a POST request to /logout
const response = await fetch(`${process.env.REACT_APP_API_DOMAIN}/logout`, {
    method: 'POST',
    credentials: 'include', // Include cookies in the request
});

// Only clear local storage and cookies if the request was successful
if (response.ok) {
    localStorage.removeItem('username');
    localStorage.removeItem('user_id');
    window.location.reload(); // refresh the page
}
};

export const handleLike = async (postId) => {
    const response = await fetch(`${process.env.REACT_APP_API_DOMAIN}/like-post?post_id=${postId}`, {
      method: 'POST', // The request method is POST
      credentials: 'include', // Include cookies in the request
    });
  
    // Check if the request was successful
    if (response.ok) {
      console.log(`Post ${postId} has been liked successfully!`);
      // Here, you might want to refresh the feed or update the state to reflect the new like
      window.location.reload(); // refresh the page
    } else {
      console.error(`Failed to like post ${postId}`);
    }
  };  