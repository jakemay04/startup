import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../context/userContext';
import './login.css';



export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const { setUser } = useContext(UserContext);

  function handleLogin() {
    createAuth('PUT');
  }

  function handleRegister() {
    createAuth('POST');
  }

  function handleSubmit(event) {
    event.preventDefault();
    const enteredEmail = email.trim();
    const enteredPassword = password;
    
    // Set the user in context
    setUser(prevUser => ({
      ...prevUser, 
      username: enteredEmail 
    }));
    
    console.log('enteredEmail:', enteredEmail);
    console.log('enteredPassword:', enteredPassword);
    navigate('/home');
  }


  async function createAuth(method) {
    const res = await fetch('api/auth', {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      setUser(prevUser => ({ 
        ...prevUser, 
        email: data.email 
      }));
      navigate('/home');
    } else {
      alert('Authentication failed');
    }
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
            placeholder="email"
            className="logininput"
            value={email}
            onChange={(e) => setEmail(e.target.value)} required
          />
        </div>
        <div className="logincontainer">
          <span>🔒</span>
          <input
            type="password"
            placeholder="password"
            className="logininput"
            value={password}
            onChange={(e) => setPassword(e.target.value)} required
          />
        </div>
  <button type="button" className="site-button" disabled={!(email && password)} onClick={handleLogin}>Login</button>
  <button type="button" className="site-button" disabled={!(email && password)} onClick={handleRegister}>Create</button>
      </form>
    </main>
  );
}