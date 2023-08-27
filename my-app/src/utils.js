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
    localStorage.removeItem('pfp_url'); // Clear the cached profile picture
    window.location.reload(); // refresh the page
}
};

export const handleLike = async (postId, posts, setPosts) => {
    const postIndex = posts.findIndex(post => post.id === postId);
    const post = posts[postIndex];
    const isAlreadyLiked = post.liked_by_requester;
    
    const newPosts = [...posts]; // Copy the posts array
    if (isAlreadyLiked) {
      newPosts[postIndex] = { ...post, liked_by_requester: false, like_count: post.like_count - 1 };
    } else {
      newPosts[postIndex] = { ...post, liked_by_requester: true, like_count: post.like_count + 1 };
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

  export const handleCommentSubmit = async (e, postId, setPosts, setIsCommentsExpanded, setComments) => {
    e.preventDefault();
  
    const commentContent = e.target.comment.value;
    e.target.comment.value = ''; 
  
    const response = await fetch(`${process.env.REACT_APP_API_DOMAIN}/post`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: commentContent,
        parent_id: postId,
      }),
    });

    if (response.ok) {
      const newComment = await response.json();
  
      newComment.username = getLoggedInUser();
      newComment.poster_pfp_url = localStorage.getItem('pfp_url'); 
  
      setPosts((prevPosts) => prevPosts.map(post =>
        post.id === postId
          ? { ...post, replies: [...post.replies, newComment] }
          : post
      ));
  
      setIsCommentsExpanded(prevState => ({
        ...prevState,
        [postId]: true
      }));

      setComments(prevState => ({
        ...prevState,
        newComment
      }))
    }
  };

  export const handleToggleComments = (postId, setIsCommentsExpanded) => {
    setIsCommentsExpanded(prevState => ({
      ...prevState,
      [postId]: !prevState[postId]
    }));
  };

  