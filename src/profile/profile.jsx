import React, { useState, useContext, useEffect } from 'react';
import './profile.css';
import { UserContext } from '../context/userContext';

export function Profile() {
  const { user, setUser } = useContext(UserContext);
  
  const initialProfile = {
    name: user?.username || 'User',
    email: user?.email || "example@byu.edu",
    bio: user?.bio || "best college ever to exist",
    location: user?.location || "Provo, UT",
  };

  const [profile, setProfile] = useState(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);

  useEffect(() => {
    const newProfile = {
      name: user?.username || initialProfile.name,
      email: user?.email || initialProfile.email,
      bio: user?.bio || initialProfile.bio,
      location: user?.location || initialProfile.location,
    };
    setProfile(newProfile);
    if (!isEditing) {
        setFormData(newProfile);
    }
  }, [user]);

  // Small inline style objects used by the component
  const buttonContainerStyle = {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    marginTop: '12px',
  };
  const buttonStyle = {
    padding: '10px 16px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    background: '#fff',
    cursor: 'pointer',
  };
  const primaryButtonStyle = {
    ...buttonStyle,
    background: '#007bff',
    color: '#fff',
    border: 'none',
  };

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

  setUser(prevUser => ({
    ...prevUser,
    username: formData.name,
    bio: formData.bio,
    location: formData.location,
  }));

  setIsEditing(false);

  fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
  });
};

  // Handle input changes for both inputs and textarea
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <main className="container-fluid bg-secondary text-center">
      <div className="profile-card">
        <header style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div className="profile-avatar">{profile.name[0]}</div>
          <div style={{ textAlign: 'left' }}>
            <h2 style={{ margin: 0 }}>{profile.name}</h2>
            <p style={{ margin: 0, fontSize: 14, color: '#666' }}>{user.email}</p>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <button className="site-button" onClick={handleEdit}>Edit Profile</button>
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
                <p style={{ margin: 0, fontSize: 14, color: '#666' }}>{user.email}</p> 
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

              <div style={buttonContainerStyle}>
                <button onClick={handleCancel} style={buttonStyle}>Cancel</button>
                <button onClick={handleSave} style={primaryButtonStyle}>Save</button>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}