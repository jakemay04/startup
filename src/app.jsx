import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Home } from './home/home';
import { Profile } from './profile/profile';
import { Chatroom } from './chatroom/chatroom';
import { About } from './about/about';
import { AuthState } from './login/authstate';


export default function App() {
  const [email, setEmail] = React.useState(localStorage.getItem('email') || '');
  const currentAuthState = email ? AuthState.Authenticated : AuthState.Unauthenticated;
  const [authState, setAuthState] = React.useState(currentAuthState);
  function onAuthChange(newEmail, newAuthState) {
    setAuthState(newAuthState);
    setEmail(newEmail);
    
    // Ensure localStorage is updated so the state persists on refresh
    if (newEmail) {
      localStorage.setItem('email', newEmail);
    } else {
      localStorage.removeItem('email');
    }
  }

  return (
    <BrowserRouter>
                <div className="body bg-light text-light">
                <header>
                        <link rel="icon" href="/favicon.ico" />
                        <h1>
                            <img src="/psf logo.png" alt="logo" className="navbar-logo" />
                            personal-favorite
                        </h1>
            <nav>
                <menu>
                <div className="tabs"></div>
                <div className="tabs"></div>
                {console.log("DEBUG: Current AuthState is:", authState)}
                {authState === AuthState.Authenticated && (
                  <>
                    <NavLink className="tab" to="home">
                      Home
                    </NavLink>
                    <NavLink className="tab" to="profile">
                      Profile
                    </NavLink>
                  </>
                )}
                <NavLink className="tab" to="about">
                    About
                </NavLink>
                </menu>
            </nav>
            <hr />
        </header>
            <Routes>
                <Route 
                    path='/' 
                    element={<Login 
                        email={email} 
                        authState={authState}
                        onAuthChange={onAuthChange}
                    />} 
                />
                <Route 
                    path='/login' 
                    element={<Login 
                        email={email} 
                        authState={authState}
                        onAuthChange={onAuthChange}
                    />} 
                />
                <Route path='/home' element={<Home />} />
                <Route 
                    path='/profile' 
                    element={<Profile 
                        onAuthChange={onAuthChange}
                    />} 
                />
                <Route path='/chatroom' element={<Chatroom />} />
                <Route path='/about' element={<About />} />
                <Route path='*' element={<NotFound />} />
            </Routes>
            <footer>
            <hr />
            <NavLink className="footer-button" to="login">
                    Back to Login
                </NavLink>
            <span className="text-reset">Jake May</span>
            <a href="https://github.com/jakemay04/startup/tree/main" className= "footer-button">GitHub</a>
            </footer>

        </div>
    </BrowserRouter>
  );
}

function NotFound() {
  return <main className="container-fluid bg-secondary text-center">404: Return to sender. Address unknown.</main>;
}