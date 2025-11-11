import React, { useContext, useEffect, useState } from 'react';
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


const PostInput = ({ onPostSubmit }) => {
  const [postContent, setPostContent] = React.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (postContent.trim()) {
      try {
        const response = await fetch('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ content: postContent }),
        });
        if (response.ok) {
          const newPost = await response.json();
          onPostSubmit(newPost);
          setPostContent('');
        }
      } catch (error) {
        console.error('Error posting:', error);
      }
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
  const [posts, setPosts] = React.useState([]);
  const [username, setUsername] = React.useState('User');
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
  async function fetchUsername() {
    try {
      const response = await fetch('/api/profile', {
        method: 'GET',
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setUsername(data.name);
      }
    } catch (error) {
      console.error('Error fetching username:', error);
    }
  }
  fetchUsername();
  }, []);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('/api/posts', {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          if (data.length === 0) {
          const initialPosts = [
            { id: 1, content: 'Welcome to the feed!', username: 'Admin', email: 'admin@example.com' },
            { id: 2, content: 'Feel free to share your thoughts!', username: 'Admin', email: 'admin@example.com' },
          ];
          setPosts(initialPosts);
        } else {
          setPosts(data);
        }
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  useEffect(() => {
    fetch('https://quote.cs260.click')
      .then((response) => response.json())
      .then((data) => {
        setQuote(data.quote);
        setQuoteAuthor(data.author);
      })
      .catch();
  }, []);

    const handlePostSubmit = (newPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  if (loading) {
    return <main className="container-fluid bg-secondary text-center"><h2>Loading...</h2></main>;
  }

  return (
    <main className="container-fluid bg-secondary text-center">
      <div>Logged in as: {username || email}</div>
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