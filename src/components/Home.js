import React from 'react';
import './Home.css'; // Importing the CSS file for styling

const Home = () => {
  return (
    <div className="home">
      <header className="home-header">
        <h1>Welcome to React Secured App</h1>
        <nav>
          <ul>
            <li><a href="/profile">Profile</a></li>
            <li><a href="/login">Login</a></li>
            <li><a href="/register">Register</a></li>
          </ul>
        </nav>
      </header>
      <main className="home-main">
        <h2>About Us</h2>
        <p>
          This is a secure web application built with React and Firebase. To prioritize user data protection and provide a seamless experience with built-in authentication and authorization.
        </p>
      </main>
      <footer className="home-footer">
        <p>&copy; 2024 Secure React App.</p>
      </footer>
    </div>
  );
};

export default Home;

