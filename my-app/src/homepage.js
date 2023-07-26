// App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Link } from "react-router-dom";
import { getLoggedInUser, handleLogout } from './utils';

function HomePage() {
  const username = getLoggedInUser();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getRecentPosts = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_DOMAIN}/recent-feed`);

      if (response.ok) {
        const postsData = await response.json();
        setPosts(postsData);
      }
    };

    getRecentPosts();
  }, []);

  return (
    <div>
      <h1>JamJar</h1>
      {!username && <Link to="/register">Register</Link>}
      <br />
      {!username && <Link to="/login">Login</Link>}
      <br />
      {username && <Link to="/post">Create a Post</Link>}
      <br />
      {username && <Link to={`/users/${username}`}>Go to Profile</Link>}
      <br />
      {username && <button onClick={handleLogout}>Logout</button>}
      <h2>Recent Posts:</h2>
      {posts.map((post, index) => (
        <div key={index}>
          <Link to={`/users/${post.username}`}>
            <h3>{post.username}</h3>
          </Link>
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

export default HomePage;
