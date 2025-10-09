import React from 'react';

export function Login() {
  return (
    <main className="container-fluid bg-secondary text-center">
      <h1>Welcome to personal-favorite</h1>
      <form method="get" action="profile.html">
        <div className="logincontainer">
            <h2>3rd party login api</h2>
          <span>@</span>
          <input type="text" placeholder="your@email.com" className="logininput" />
        </div>
        <div className="logincontainer">
          <span>🔒</span>
          <input type="password" placeholder="password" className="logininput"/>
        </div>
        <button className="site-button">Login</button>
        <button className="site-button">Create</button>
      </form>
    </main>
  );
}