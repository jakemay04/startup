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
      <table>
          <tr>
            <th>Profile</th>
            <th>Recent Posts</th>
          </tr>
          <tr>
            <td> Name: About:</td>
            <td>Recent Posts</td>
          </tr>
          
        </table>
        </div>
    </main>
  );
}