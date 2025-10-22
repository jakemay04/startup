import React from 'react';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const [username, setUsername] = React.useState('initialize-username');
  const [password, setPassword] = React.useState('initialize-password');
  const navigate = useNavigate();

  // submit handler: captures current input values into constants
  function handleSubmit(event) {
    event.preventDefault();
    const enteredUsername = username;
    const enteredPassword = password;
    console.log('enteredUsername:', enteredUsername);
    console.log('enteredPassword:', enteredPassword);
    // Navigate to home page after submit
    navigate('/home');
  }

  // handler for Create button
  function handleCreateClick() {
    // You can add create logic here
    navigate('/home');
  }

  return (
    <main className="container-fluid bg-secondary text-center">
      <h1>Welcome to personal-favorite</h1>
      <form onSubmit={handleSubmit}>
        <div className="logincontainer">
            <h2>3rd party login api</h2>
          <span>@</span>
          <input
            type="text"
            placeholder="your@email.com"
            className="logininput"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="logincontainer">
          <span>🔒</span>
          <input
            type="password"
            placeholder="password"
            className="logininput"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
  <button type="submit" className="site-button">Login</button>
  <button type="button" className="site-button" onClick={handleCreateClick}>Create</button>
      </form>
    </main>
  );
}