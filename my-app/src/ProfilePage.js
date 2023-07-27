import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";
import { getLoggedInUser } from './utils';

export default function UserProfile() {
  const { username } = useParams();
  const loggedInUser = getLoggedInUser();
  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState(0);  // Add this
  const [following, setFollowing] = useState(0);  // Add this

  useEffect(() => {
    const getUserID = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_DOMAIN}/user-by-name/${username}`);

      if (response.ok) {
        const userData = await response.json();
        setUserId(userData.user_id);
        setFollowers(userData.followers);  // Set followers
        setFollowing(userData.following);  // Set following
        setIsFollowing(userData.requester_following);  // Update 'isFollowing' based on 'requester_following'
        return userData.user_id;
      }
    };

    const getUserPosts = async () => {
      const userId = await getUserID();

      if (!userId) return;

      const response = await fetch(`${process.env.REACT_APP_API_DOMAIN}/get-posts/${userId}`);

      if (response.ok) {
        const postsData = await response.json();
        setPosts(postsData);
      }
    };

    const checkFollowingStatus = async () => {
      // Fetch request to your server to check if the logged-in user follows the user of the profile.
      // Replace "/check-follow-status" with your endpoint.
      const response = await fetch(`${process.env.REACT_APP_API_DOMAIN}/check-follow-status?id=${userId}`);

      if (response.ok) {
        const data = await response.json();
        setIsFollowing(data.isFollowing);
      }
    };

    getUserPosts();
    checkFollowingStatus();
  }, [username]);

  const handleFollow = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_DOMAIN}/follow-user?id=${userId}`, {
      method: isFollowing ? 'DELETE' : 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (response.ok) {
      setIsFollowing(!isFollowing);  // Invert the 'isFollowing' state
      
      // Update followers count based on follow/unfollow action
      setFollowers(isFollowing ? followers - 1 : followers + 1);
    } else {
      alert('An error occurred while trying to update your follow status.');
    }
  };

  return (
    <div>
      <h1>{username}'s Profile</h1>
      {loggedInUser !== username && <button onClick={handleFollow}>{isFollowing ? 'Unfollow' : 'Follow'}</button>}
      <h2>Followers: {followers}</h2>  {/* Display followers */}
      <h2>Following: {following}</h2>  {/* Display following */}
      <Link to="/">Go to Homepage</Link>
      <h2>Posts:</h2>
      {posts.map((post, index) => (
        <div key={index}>
          <h3>Post {index + 1}</h3>
          <p>{post.content}</p>
          <p>{post.image_url}</p>
          <p>{post.created_at}</p>
          <div style={{left: 0, width: 900, height: 180, position: 'relative'}} dangerouslySetInnerHTML={{
            __html: `<iframe src=${post.song_embed_url} style="top: 0; left: 0; width: 100%; height: 100%; position: absolute; border: 0;" allowfullscreen allow="clipboard-write; encrypted-media; fullscreen; picture-in-picture; autoplay;"></iframe>`
          }}>
          </div>
        </div>
      ))}
    </div>
  );
}
