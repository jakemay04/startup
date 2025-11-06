import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../context/userContext';
import { AuthState } from './authstate';
import './login.css';



export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const { authState, setUser } = useContext(UserContext);

  function handleLogin() {
    createAuth('PUT');
  }

  function handleRegister() {
    createAuth('POST');
  }

 async function createAuth(method) {
    try {
      const res = await fetch('api/auth', {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      let data = {};
      try {
        data = await res.json();
      } catch (e) {
        console.warn('Could not parse API response as JSON (likely empty body or text response).');
      }

      if (res.ok) {
        setUser(data);
        navigate('/home');
      } else {
        const errorMsg = data.msg || `Authentication failed with status ${res.status}.`;
        alert(errorMsg);
      }

    } catch (error) {
      console.error("Network Error:", error);
      alert("Could not connect to the server. Please check your network connection.");
    }
  }

  useEffect(() => {
    if (authState === AuthState.Authenticated) {
      navigate('/home');
    }
  }, [authState, navigate]);

  
  if (authState === AuthState.Unknown) {
    return <main className="container-fluid bg-secondary text-center">
      <h2>Loading...</h2>
    </main>;
  }
  
  if (authState === AuthState.Unauthenticated)  { 
    return (
    <main className="container-fluid bg-secondary text-center">
      {authState !== AuthState.Unknown && <h1>Welcome to Personal Favorite</h1>}
      {/* <form onSubmit={handleSubmit}> */}
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
      {/* </form> */}
    </main>
  );
}
return null;
}
  