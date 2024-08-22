import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import '../../src/styles/Profile.css'; // Importing the CSS file for styling
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="profile">
      <header className="profile-header">
        <h1>Profile Page</h1>
        <br></br>
        <nav>
          <ul>
          <li><Link to="/">Home</Link></li>
          </ul>
        </nav>
      </header>
      <main className="profile-main">
        {user ? (
          <div className="profile-info">
            <h2>User Information</h2>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>UID:</strong> {user.uid}</p>
            <button onClick={() => window.location.href = '/'}>Logout</button>
          </div>
        ) : (
          <p>No user information available. Please log in.</p>
        )}
      </main>
      <footer className="profile-footer">
        <p>&copy; 2024 Secure React App.</p>
      </footer>
    </div>
  );
};

export default Profile;

