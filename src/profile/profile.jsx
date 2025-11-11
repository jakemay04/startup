import React, { useState, useContext, useEffect } from 'react';
import './profile.css';
import { useNavigate } from 'react-router-dom';
import { AuthState } from '../login/authstate';


export function Profile() {
  // const { user, setUser, authState } = useContext(UserContext);

  const [email, setEmail] = React.useState(localStorage.getItem('email') || '');
  const currentAuthState = email ? AuthState.Authenticated : AuthState.Unauthenticated;
  const [authState, setAuthState] = React.useState(currentAuthState);
  
  const initialProfile = {
    name: 'User',
    email: "example@byu.edu",
    bio: "best college ever to exist",
    location: "Provo, UT",
  };

  const [profile, setProfile] = useState(initialProfile);

  useEffect(() => {
    // Fetch profile data from the server when component mounts
    async function fetchProfile() {
      try {
        const response = await fetch('/api/profile', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched profile data:', data);
          setProfile(data);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    }
    fetchProfile();
  }, []);




  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);

  useEffect(() => {
      if (!isEditing) {
        setFormData(profile);
      }
    }, [isEditing]);


  const handleEdit = () => {
    setFormData(profile);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };


  const handleSave = () => {
    setProfile(formData);
    setIsEditing(false);

    fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include',
    });

  };

    // Handle input changes for both inputs and textarea
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    const navigate = useNavigate();

    function handleLogout() {
      fetch('api/auth', {
        method: 'DELETE',
        credentials: 'include',
      });
      console.log({authState});
      navigate('/login');
      }

  if (authState === AuthState.Unknown) {
    return <main className="container-fluid bg-secondary text-center">
      <h2>Loading...</h2>
    </main>;
  }

  if (authState === AuthState.Unauthenticated) {
    return <main className="container-fluid bg-secondary text-center">
      <h2>{profile}</h2>
      <button className="site-button" onClick={() => navigate('/login')}>Go to Login</button>
    </main>;
  }

  
  if (authState === AuthState.Authenticated) {
    return (
    <main className="container-fluid bg-secondary text-center">
      <div className="profile-card">

        <header style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div className="profile-avatar">{profile.name[0]}</div>
          <div style={{ textAlign: 'left' }}>
            <h2 style={{ margin: 0 }}>{profile.name}</h2>
            <p style={{ margin: 0, fontSize: 14, color: '#666' }}>{profile.email}</p>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <button className="site-button" onClick={handleEdit}>Edit Profile</button>
            <button className="site-button" onClick={handleLogout}>Logout</button>

          </div>
        </header>

        {!isEditing ? (
          <section>
            <p style={{ color: '#333' }}>{profile.bio}</p>
            <p style={{ color: '#666', fontSize: 14 }}>{profile.location}</p>
          </section>
        ) : (
          <section>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ textAlign: 'left' }}>
                <h2 style={{ margin: 0 }}>{profile.name}</h2>
                {/* Display user email from context */}
                <p style={{ margin: 0, fontSize: 14, color: '#666' }}>{profile.email}</p> 
              </div>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="logininput"
              />

              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="logininput"
              />

              <textarea
                id="bio"
                name="bio"
                rows="4"
                value={formData.bio}
                onChange={handleChange}
                style={{ padding: 10, borderRadius: 6, border: '1px solid #ccc' }}
              ></textarea>

              <div className="button-container">
                <button onClick={handleCancel} className="buttonStyle" >Cancel</button>
                <button onClick={handleSave} className="primaryButtonStyle" >Save</button>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
}
  