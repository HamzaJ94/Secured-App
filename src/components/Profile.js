import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import './Profile.css'; // Importing the CSS file for styling

// Example of navigation links in Profile.js

const Profile = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="profile">
      <header className="profile-header">
        <h1>Profile Page</h1>
        <nav>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/login">Login</a></li>
            <li><a href="/register">Register</a></li>
          </ul>
        </nav>
      </header>
      <main className="profile-main">
        {user ? (
          <div className="profile-info">
            <h2>User Information</h2>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>UID:</strong> {user.uid}</p>
            <button onClick={() => window.location.href = '/'}>Go to Home Page</button>
          </div>
        ) : (
          <p>No user information available. Please log in.</p>
        )}
      </main>
      <footer className="profile-footer">
        <p>&copy; 2024 Secure React App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Profile;

