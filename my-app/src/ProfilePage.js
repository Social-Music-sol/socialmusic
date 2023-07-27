import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";
import { getLoggedInUser } from './utils';

export default function UserProfile() {
  const { username } = useParams();
  const loggedInUser = getLoggedInUser();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getUserID = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_DOMAIN}/user-by-name/${username}`);

      if (response.ok) {
        const postData = await response.json();
        return postData.user_id;
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
}, [username]); // <-- This ensures the function inside useEffect is only called once when the component mounts

const handleFollow = async () => {
  const response = await fetch(`${process.env.REACT_APP_API_DOMAIN}/follow-user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: loggedInUser,
      followUsername: username,
    }),
  });

  if (response.ok) {
    alert('Successfully followed the user!');
  } else {
    alert('Failed to follow the user. Please try again.');
  }
};

  return (
    <div>
      <h1>{username}'s Profile</h1>
      {loggedInUser !== username && <button onClick={handleFollow}>Follow</button>}
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
