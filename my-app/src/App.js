import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import RegisterPage from './RegisterPage';
import LoginPage from './LoginPage';
import PostForm from './PostForm';


function App() {
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [songUrl, setSongUrl] = useState('');

  // inside App component
  const handlePost = async (e) => {
    e.preventDefault();
    
    const response = await fetch('http://52.38.156.74:5000/post', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // to ensure that cookies are included in the request
      body: JSON.stringify({
        content,
        imageUrl,
        songUrl
      })
    });

    const data = await response.json();

    if (data.message) {
      alert(data.message);
      setContent('');
      setImageUrl('');
      setSongUrl('');
    }
  };

  /*
  // inside App return
  {posts.map(post => {
    const user = user.find(user => user.id === post.userId);
    return <UserPost key={post.id} post={post} user={user} />
  })}

  // inside App component
  const [posts, setPosts] = useState([]);

  const fetchUsersAndPosts = () => {
    Promise.all([
      fetch('/user/user_id'),  // replace with your real API endpoint
      fetch('/posts')   // replace with your real API endpoint
    ])
    .then(([usersRes, postsRes]) => Promise.all([usersRes.json(), postsRes.json()]))
    .then(([usersData, postsData]) => {
      setUsers(usersData);
      setPosts(postsData);
    })
    .catch(error => console.error('Error:', error));
  };

  // call fetchUsersAndPosts in useEffect
  useEffect(fetchUsersAndPosts, []);

  */
  // inside App return
  <PostForm onPost={handlePost} />


  return (
    <Router>
    <div className="App">
      <Routes>
        <Route path="/" element={
          <div>
            <h1>JamJar</h1>
            <Link to="/register">Register</Link>
            <br />
            <Link to="/login">Login</Link>
            <br />
            <Link to="/post">Create a Post</Link>
          </div>
        } />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/post" element={<PostForm onPost={handlePost} />} /> 
      </Routes>
    </div>
    </Router>
  );
}

export default App;

