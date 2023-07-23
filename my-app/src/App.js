import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import RegisterPage from './RegisterPage';
import LoginPage from './LoginPage';
import PostForm from './PostForm';
import UserPost from './UserPost';

/*
// inside App component
const handlePost = (postData) => {
  fetch('/http://52.38.156.74:3000/posts', { // replace with your real API endpoint
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(postData)
  })
  .then(response => response.json())
  .then(data => {
    if (data.message) {
      alert(data.message);
    }
  })
  .catch(error => console.error('Error:', error));
};

// inside App return
{posts.map(post => {
  const user = user.find(user => user.id === post.userId);
  return <UserPost key={post.id} post={post} user={user} />
})}

// inside App component
const [posts, setPosts] = useState([]);

const fetchUsersAndPosts = () => {
  Promise.all([
    fetch('/users'),  // replace with your real API endpoint
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

// inside App return
<PostForm onPost={handlePost} />
*/
function App() {

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={
            <div>
              <h1>JamJar</h1>
              <Link to="/RegisterPage">Register</Link>
              <br />
              <Link to="/LoginPage">Login</Link>
            </div>
          }/>
          <Route path="/RegisterPage" element={<RegisterPage />} />
          <Route path="/LoginPage" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
