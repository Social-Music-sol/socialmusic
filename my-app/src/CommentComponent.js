import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faCircle } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import { handleLike } from './utils';

function CommentComponent(props) {
  const {reply, index, comments, setComments} = props;

  return (
    <div key={index + 3} className="reply-box"> {/* added +3 to avoid potential key conflicts */}
            <div className="reply-header">
                <Link to={`/users/${reply.username}`} className="profile-link">
                    <img src={reply.poster_pfp_url} alt={`${reply.username}'s profile`} className="profile-icon" />
                </Link>
                <h3>{reply.username}</h3>
            </div>
            {/* <div className="comment-like-container">
                <FontAwesomeIcon 
                icon={reply.liked_by_requester ? faHeart : faHeart} 
                className="like-button" 
                style={{ color: reply.liked_by_requester ? 'red' : 'pink' }}
                onClick={() => handleLike(reply.id, comments, setComments)}
                />
            <p className="like-count">{reply.like_count}</p>
            </div>
            <p>{reply.content}</p> */}
        
    </div>
    );
}

export default CommentComponent;