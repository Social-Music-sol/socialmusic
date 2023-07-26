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

export const handleLike = async (postId, posts, setPosts) => {
    const postIndex = posts.findIndex(({ post }) => post.id === postId);
    const { post, likes } = posts[postIndex];
    const isAlreadyLiked = post.liked_by_requester;
    
    const newPosts = [...posts]; // Copy the posts array
    if (isAlreadyLiked) {
      newPosts[postIndex] = { post: { ...post, liked_by_requester: false }, likes: likes - 1 };
    } else {
      newPosts[postIndex] = { post: { ...post, liked_by_requester: true }, likes: likes + 1 };
    }
  
    const response = await fetch(`${process.env.REACT_APP_API_DOMAIN}/like-post?post_id=${postId}`, {
      method: isAlreadyLiked ? 'DELETE' : 'POST',
      credentials: 'include',
    });
  
    if (!response.ok) {
      console.error(`Failed to ${isAlreadyLiked ? 'unlike' : 'like'} post ${postId}`);
      // If the request failed, revert the like state
      setPosts(posts);
    } else {
      setPosts(newPosts);
    }
  };
  
  
        