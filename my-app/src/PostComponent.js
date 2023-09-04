import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faCircle } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import { getLoggedInUser, handleLogout, handleLike, handleCommentSubmit, handleToggleComments} from './utils';
import CommentComponent from './CommentComponent';
import { useEffect, useState, useCallback } from 'react';


function PostComponent(props) {
  const {post, isCommentsExpanded, setIsCommentsExpanded, setPosts, index, posts} = props;
  
  const [comments, setComments] = useState(post.replies);

  return (
    <div className="posts-container">
            <div key={index} className="post-box">
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
    {comments.slice(0, 3).map((reply, index) => (
        <CommentComponent
        reply={reply}
        index={index}
        comments={comments}
        setComments={setComments}
      />
    ))}

    {isCommentsExpanded[post.id] && comments.slice(3).map((reply, index) => (
        <CommentComponent
          reply={reply}
          index={index}
          comments={comments}
          setComments={setComments}
        />
    ))}
    
    <div className="comment-actions-container">
        {post.replies.length > 3 && (
            <button className="toggle-comments-button" onClick={() => handleToggleComments(post.id, setIsCommentsExpanded)}>
                {isCommentsExpanded[post.id] ? 'Hide' : `Show ${post.replies.length - 3} more replies`}
            </button>
        )}
        
        {/* Comment form */}
        <form onSubmit={(e) => handleCommentSubmit(e, post.id, setPosts, setIsCommentsExpanded, setComments)} className="comment-form">
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
                  onClick={() => handleLike(post.id, posts, setPosts)}
                />
                <p className="like-count">{post.like_count}</p>
              </div>
            </div>
        {/* {loading && <p>Loading...</p>} */}
      </div>
  );
}

export default PostComponent;