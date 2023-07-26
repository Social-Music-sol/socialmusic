// UserPost.js
import React from 'react';
import './UserPost.css';

const UserPost = ({ post, user }) => {
  return (
    <div className="user-post">
      <div className="user-info">
        <h3>{user.username}</h3>
      </div>
      <div className="post-info">
        <a href={post.songLink}>{post.songLink}</a>
        <p>{post.caption}</p>
      </div>
      {post.pictureUrl && <img src={post.pictureUrl} alt="User post" />}
    </div>
  );
};

export default UserPost;