// PostForm.js
import React, { useState } from 'react';

const PostForm = ({ onPost }) => {
  const [songLink, setSongLink] = useState('');
  const [pictureUrl, setPictureUrl] = useState('');
  const [caption, setCaption] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // We pass the songLink, pictureUrl, and caption as separate arguments, not as an object
    onPost(songLink, pictureUrl, caption);
    setSongLink('');
    setPictureUrl('');
    setCaption('');
  }
  

  return (
    <form onSubmit={handleSubmit}>
      <input type="url" placeholder="Song Link" value={songLink} onChange={e => setSongLink(e.target.value)} required />
      <input type="url" placeholder="Picture URL" value={pictureUrl} onChange={e => setPictureUrl(e.target.value)} />
      <input type="text" placeholder="Caption" value={caption} onChange={e => setCaption(e.target.value)} />
      <button type="submit">Post</button>
    </form>
  );
};

export default PostForm;
