import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/userContext';
import './home.css';

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

const SideBarTextBox = ({ title, content }) => {
  return (
    <div className="sidebar-textbox">
      <h3>{title}</h3>
      <p>{content}</p>
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
  const [quote, setQuote] = React.useState('Loading...');
  const [quoteAuthor, setQuoteAuthor] = React.useState('unknown');
  const { user } = useContext(UserContext);
  const [posts, setPosts] = React.useState(getInitialPosts);

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

  useEffect(() => {
    fetch('https://quote.cs260.click')
      .then((response) => response.json())
      .then((data) => {
        setQuote(data.quote);
        setQuoteAuthor(data.author);
      })
      .catch();
  }, []);

  return (
    <main className="container-fluid bg-secondary text-center">
      <div>Logged in as: {user?.username || user?.email}</div>
      <div className="feed-layout">

        <div className="feed-sidebar-left">
        <SideBarTextBox title= "Daily Inspo" content= {quote} />
        </div>

        <div className="feed-container">
          <PostInput onPostSubmit={handlePostSubmit} />

            <div className="scrollable-feed-content">

              {/* Profile info can go here */}
              {posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
              {posts.length === 0 && <p>No posts available.</p>}
            </div>
        </div>
      </div>
    </main>
  );
}