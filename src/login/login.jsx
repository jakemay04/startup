import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../context/userContext';
import './login.css';

export function Login() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  // submit handler: captures current input values into constants
  function handleSubmit(event) {
    event.preventDefault();
    const enteredUsername = username.trim();
    const enteredPassword = password;
    
    // Set the user in context
    setUser({ username: enteredUsername });
    
    console.log('enteredUsername:', enteredUsername);
    console.log('enteredPassword:', enteredPassword);
    navigate('/home');
  }

  // handler for Create button
  function handleCreateClick() {
    navigate('/home');
  }

  return (
    <main className="container-fluid bg-secondary text-center">
      <h1>Welcome to personal-favorite</h1>
      <form onSubmit={handleSubmit}>
        <div className="logincontainer">
            <h2>Start Here</h2>
          <span>:)    </span>
          <input
            type="text"
            placeholder="username"
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