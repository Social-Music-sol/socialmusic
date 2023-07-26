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

export const handleLike = async (postId, likedPosts, setLikedPosts) => {
    const isAlreadyLiked = likedPosts.includes(postId);
  
    if (isAlreadyLiked) {
      setLikedPosts(likedPosts.filter(id => id !== postId));
    } else {
      setLikedPosts([...likedPosts, postId]);
    }
  
    const response = await fetch(`${process.env.REACT_APP_API_DOMAIN}/like-post?post_id=${postId}`, {
      method: isAlreadyLiked ? 'DELETE' : 'POST',
      credentials: 'include',
    });
  
    if (!response.ok) {
      console.error(`Failed to ${isAlreadyLiked ? 'unlike' : 'like'} post ${postId}`);
      // If the request failed, revert the like state
      if (isAlreadyLiked) {
        setLikedPosts([...likedPosts, postId]);
      } else {
        setLikedPosts(likedPosts.filter(id => id !== postId));
      }
    }
};
  
        