import React from 'react';
import './home.css';

export function Home() {
  return (
    <main className="container-fluid bg-secondary text-center">
      <div className="feed-container">
          <div className="feed-item-profile">
            <p className="feed-text">New post:</p>
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