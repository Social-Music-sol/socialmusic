// PostForm.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';



const PostForm = () => {
  const [songLink, setSongLink] = useState('');
  const [pictureUrl, setPictureUrl] = useState('');
  const [caption, setCaption] = useState('');
  const history = useHistory();


  const handlePost = async (songLink, pictureUrl, caption) => {
    const response = await fetch(`${process.env.REACT_APP_API_DOMAIN}/post`, { 
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
    // Add this line to redirect to the home page after posting
    history.push('/');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handlePost(songLink, pictureUrl, caption);
    setSongLink('');
    setPictureUrl('');
    setCaption('');
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="url" placeholder="Song Link" value={songLink} onChange={e => setSongLink(e.target.value)} required />
        <input type="url" placeholder="Picture URL" value={pictureUrl} onChange={e => setPictureUrl(e.target.value)} />
        <input type="text" placeholder="Caption" value={caption} onChange={e => setCaption(e.target.value)} />
        <button type="submit">Post</button>
    </form>
    <Link to="/">Go To Homepage</Link>
  </div>
  );
};

export default PostForm;
