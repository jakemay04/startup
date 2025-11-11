import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthState } from './authstate';
import './login.css';



export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [authState,setAuthState] = React.useState(AuthState.Unauthenticated);

  function handleLogin() {
    createAuth(`POST`);
  }

  function handleRegister() {
    createAuth(`PUT`);
  }

 async function createAuth(method) {
    try {
      const response = await fetch('api/auth', {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response?.status === 200) {
        localStorage.setItem('email', email);
        setAuthState(AuthState.Authenticated);
        navigate('/home');
      }
    }
 catch (error) {
      console.error('Error during authentication:', error);
    }
  }


  useEffect(() => {
    if (authState === AuthState.Authenticated) {
      // navigate('/home');
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
  