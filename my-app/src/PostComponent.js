import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faCircle } from '@fortawesome/free-solid-svg-icons';

function PostComponent(props) {
  const { post, handleLike, handleToggleComments, handleCommentSubmit, isCommentsExpanded, setPosts } = props;

  return (
    <div className="post-box">
      <div className="post-header">
        <Link to={`/users/${post.username}`} className="profile-link">
          <img src={post.poster_pfp_url} alt={`${post.username}'s profile`} className="profile-icon" />
        </Link>
        <h3>{post.username}</h3>
      </div>
      <div className="post-content">
        <div className="post-embed">
          <div className="embed-container" dangerouslySetInnerHTML={{
            __html: `<iframe src=${post.song_embed_url} class="spotify-embed" allowfullscreen allow="clipboard-write; encrypted-media; fullscreen; picture-in-picture; autoplay;"></iframe>`
          }}>
          </div>
        </div>
        {post.content && (
          <div className="post-text-container">
            <div className="post-text">
              <p>{post.content}</p>
            </div>
          </div>
        )}
        <div className={`comments-section ${isCommentsExpanded[post.id] ? 'expanded' : ''}`}>
          {(isCommentsExpanded[post.id] ? post.replies : []).map((reply, index) => (
            <div key={index} className="reply-box">
              <div className="reply-header">
                <Link to={`/users/${reply.username}`} className="profile-link">
                  <img src={reply.poster_pfp_url} alt={`${reply.username}'s profile`} className="profile-icon" />
                </Link>
                <h3>{reply.username}</h3>
              </div>
              <p>{reply.content}</p>
            </div>
          ))}
          <div className="comment-actions-container">
            <button className="toggle-comments-button" onClick={() => handleToggleComments(post.id)}>
              {isCommentsExpanded[post.id] ? 'Hide' : 'Show'} replies
            </button>
            <form onSubmit={(e) => handleCommentSubmit(e, post.id)} className="comment-form">
              <input type="text" name="comment" placeholder="Add a comment..." />
              <button type="submit">Comment</button>
            </form>
          </div>
        </div>
      </div>
      <div className="like-container">
        <FontAwesomeIcon 
          icon={post.liked_by_requester ? faHeart : faHeart} 
          className="like-button" 
          style={{ color: post.liked_by_requester ? 'red' : 'pink' }}
          onClick={() => handleLike(post.id)}
        />
        <p className="like-count">{post.like_count}</p>
      </div>
    </div>
  );
}

export default PostComponent;