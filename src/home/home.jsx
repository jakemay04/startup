import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/userContext';
import './home.css';

const GOOGLE_CALENDAR_API_KEY = 'AIzaSyBuR7XMNxS8_Zj2PgL1IBZfbyspMs2qLM4';
const CALENDAR_ID = '6fd630cadd120e8cd62d73e0929066b7792b0c2c0a793de395262e052a5494df@group.calendar.google.com';

const PostCard = ({ post }) => {
  return (
    <div className="post-card">
      <div className="profile-info">
        <div className="profile-pic">{post.email?.[0] || 'U'}</div>
        <div className="mock_user">{post.username || 'User'}</div>
      </div>
      <p>{post.content}</p>
    </div>
  );
};

const getInitialPosts = () => {
  const initialPosts = [
    { id: 1, content: "This is the first post in the feed!", email: "default@user.com", username: "DefaultUser" },
    { id: 2, content: "Here's another post with some text.", email: "default@user.com", username: "DefaultUser" },
    { id: 3, content: "Enjoy this third post in the feed!", email: "default@user.com", username: "DefaultUser" },
  ];
  
  try {
    const storedPosts = localStorage.getItem('app_posts');
    if (storedPosts) {
      // Parse the stored JSON data
      const parsedPosts = JSON.parse(storedPosts);
      // Return stored posts if valid, otherwise return the default list
      return parsedPosts.length > 0 ? parsedPosts : initialPosts;
    }
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    // Fallback to initial posts if reading or parsing fails
  }
  return initialPosts;
};


const PostInput = ({ onPostSubmit }) => {
  const [postContent, setPostContent] = React.useState('');
  const { user } = useContext(UserContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (postContent.trim()) {
      // Pass 'username' and 'email' to the new post object
      onPostSubmit({ 
        id: Date.now(), 
        content: postContent, 
        username: user?.username || user?.email || 'Unknown User',
        email: user?.email || 'U' // for avatar display
      });
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
  const [postContent, setPostContent] = React.useState('');
  const { user } = useContext(UserContext);
  const [posts, setPosts] = React.useState(getInitialPosts);
  const [calendarEvents, setCalendarEvents] = useState([]);

  useEffect(() => {
    try {
      localStorage.setItem('app_posts', JSON.stringify(posts));
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  }, [posts]);

  const handlePostSubmit = (newPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  }
  return (
    <main className="container-fluid bg-secondary text-center">
      <div>Logged in as: {user?.username || user?.email}</div>
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