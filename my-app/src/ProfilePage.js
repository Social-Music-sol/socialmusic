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
  const [profilePic, setProfilePic] = useState('');  // Default profile picture URL


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

    getUserPosts();
  }, [username]);

  const handleProfileImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    
    const formData = new FormData();
    formData.append('photo', file);
  
    const response = await fetch(`${process.env.REACT_APP_API_DOMAIN}/profile/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });
  
    if (response.ok) {
      const data = await response.json();
      setUserId(userData.user_id);
      setProfilePic(userData.photo);  // Set profile picture URL
      setFollowers(userData.followers);
      setFollowing(userData.following);
      setIsFollowing(userData.requester_following);
      return data.user_id;

      // Here you can handle the response from the server, such as updating the profile picture in your state
    } else {
      // Handle the error from the server
      alert('An error occurred while trying to update your profile picture.');
    }
  };

  
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
    <h1>{username}</h1>
    {profilePic && <img src={profilePic} alt="Profile" />}  {/* Display profile picture */}
    {loggedInUser !== username && <button onClick={handleFollow}>{isFollowing ? 'Unfollow' : 'Follow'}</button>}
    <h2>Followers: {followers}</h2>
    <h2>Following: {following}</h2>
    <Link to="/">Go to Homepage</Link>
    <h2>Posts:</h2>
    {posts.map((post, index) => (
      <div key={index}>
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
