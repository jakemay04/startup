import React from 'react';
import './profile.css';

//mock profile data
const initialProfile = {
  name: "Alex Johnson",
  email: "alex.j@devco.com",
  bio: "Front-end enthusiast and lover of clean code.",
  location: "Austin, TX",
};

const handleSave = () => {
    setProfile(formData); // Update the permanent profile state
    setIsEditing(false); // Switch back to display mode
  };


const handleCancel = () => {
    setFormData(profile); // Revert form data back to the saved profile state
    setIsEditing(false); // Switch back to display mode
  };

const handleEdit = () => {
    setFormData(profile); // Initialize form data with current profile data
    setIsEditing(true);
  };

export function Profile() {
  const [profile, setProfile] = useState(initialProfile);
  // State to track if the profile is in editing mode
  const [isEditing, setIsEditing] = useState(false);
  // State for temporary form data while editing (to allow cancellation)
  const [formData, setFormData] = useState(profile);

  // Function to handle changes in the input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };
  return (
    <main className="container-fluid bg-secondary text-center">
      <div>

        <header>{profile.name[0]}
          <h1>{profile.name}</h1>
          <p>{profile.email}</p>
          <p>{profile.bio}</p>
          <button className="site-button" onClick={handleEdit}>Edit Profile</button>
        </header>
        {isEditing ?  (
          <div>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              />

            <textarea
                id="bio"
                name="bio"
                rows="3"
                value={formData.bio}
                onChange={handleChange}
              ></textarea>
            
            <div style={buttonContainerStyle}>
              <button
                onClick={handleCancel}
                style={buttonStyle}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                style={primaryButtonStyle}
              >
                Save
              </button>
            </div>

          </div>
          ) : (
          <div>
          </div>
          )}

      </div>
    </main>
  );
}