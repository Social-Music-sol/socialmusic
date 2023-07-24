// PostForm.js
import React, { useState } from 'react';

const PostForm = () => {
  const [songLink, setSongLink] = useState('');
  const [pictureUrl, setPictureUrl] = useState('');
  const [caption, setCaption] = useState('');

  const handlePost = async (songLink, pictureUrl, caption) => {
    const response = await fetch('https://findingnasa.xyz/api/post', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        content: caption,
        image_url: pictureUrl,
        song_url: songLink
      })
    });

    const data = await response.json();

    if (data.message) {
      alert(data.message);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handlePost(songLink, pictureUrl, caption);
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
