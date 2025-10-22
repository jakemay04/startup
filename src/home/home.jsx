import React from 'react';
import './home.css';


const PostCard = ({ post }) => (
  <div className="post-card">
    <p>{post.content}</p>
  </div>
); 
const initialPosts = [
  { id: 1, content: 'This is the first post in the feed!' },
  { id: 2, content: 'Here\'s another post with some text.' },
  { id: 3, content: 'Enjoy this third post in the feed!' },
];


const PostInput = ({ onPostSubmit }) => {
  const [postContent, setPostContent] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (postContent.trim()) {
      onPostSubmit({ id: Date.now(), content: postContent });
      setPostContent('');
    }
  };
};

export function Home() {
  const [posts, setPosts] = React.useState(initialPosts);

  const handlePostSubmit = (newPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  }
  return (
    <main className="container-fluid bg-secondary text-center">
      <div className="feed-container">
          <div className="feed-item-profile">
            <PostInput onPostSubmit={handlePostSubmit} />
            {/* Profile info can go here */}
            {posts.map((post => (
              <postCard key={post.id} post={post} />
            )))}
            {posts.length === 0 && <p>No posts available.</p>   }
            <input type="text" placeholder="insert text here" className="postinput" />
            <button className="send-button">➤</button>
          </div>

          
          <div className="feed-item">
            <img src="image1.jpg" alt="Post Image"></img>
            <p className="feed-text">This is the first post in the feed!</p>
          </div>

          <div className="feed-item">
            <img src="image2.jpg" alt="Post Image"></img>
            <p className="feed-text">Here's another post with some text.</p>
          </div>

          <div className="feed-item">
          <img src="image3.jpg" alt="Post Image"></img>
          <p className="feed-text">Enjoy this third post in the feed!</p>
          </div>

        </div>
    </main>
  );
}