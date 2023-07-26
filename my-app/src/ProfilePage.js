import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";

export default function UserProfile() {
  const { username } = useParams();
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

      console.log("userId:", userId);

      if (!userId) return;

      const response = await fetch(`${process.env.REACT_APP_API_DOMAIN}/get-posts/${userId}`);

      console.log("response:", response);

      if (response.ok) {
        const postsData = await response.json();
        console.log("postsData:", postsData);
        setPosts(postsData);
      }
    };

    getUserPosts();
}, [username]); // <-- This ensures the function inside useEffect is only called once when the component mounts

  return (
    <div>
      <h1>{username}'s Profile</h1>
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