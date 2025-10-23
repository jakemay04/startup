import React, { useContext } from 'react';
import { UserContext } from '../context/userContext';
import './home.css';

const PostCard = ({ post }) => {
  return (
    <div className="post-card">
      <div className="profile-info">
        <div className="profile-pic">{post.username?.[0] || 'U'}</div>
        <div className="mock_user">{post.username || 'User'}</div>
      </div>
      <p>{post.content}</p>
    </div>
  );
};

const initialPosts = [
  { id: 1, content: 'This is the first post in the feed!' },
  { id: 2, content: 'Here\'s another post with some text.' },
  { id: 3, content: 'Enjoy this third post in the feed!' },
];


const PostInput = ({ onPostSubmit }) => {
  const [postContent, setPostContent] = React.useState('');
  const { user } = useContext(UserContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (postContent.trim()) {
      onPostSubmit({ id: Date.now(), content: postContent, username: user?.username || 'Anonymous' });
      setPostContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="post-input-form">
      <input
        type="text"
        value={postContent}
        onChange={(e) => setPostContent(e.target.value)}
        placeholder="Insert text here"
        className="postinput"
      />
      <button type="submit" className="send-button">➤</button>
    </form>
  );
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
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
          {posts.length === 0 && <p>No posts available.</p>}
        </div>
      </div>
    </main>
  );
}