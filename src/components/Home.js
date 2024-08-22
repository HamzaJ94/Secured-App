import React from 'react';
import '../../src/styles/Home.css'; // Importing the CSS file for styling
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home">
      <header className="home-header">
        <h1>Welcome to React Secured App</h1>
        <br></br>
        <nav>
          <ul>
            <li><Link to="/profile">Profile</Link></li>
            <li><a href="/register">Register</a></li>
          </ul>
        </nav>
      </header>
      <main className="home-main">
      </main>
      <footer className="home-footer">
        <h2>About This App</h2>
        <p>
          This is a secure web application built with React and Firebase. 
          To prioritize user data protection and provide a seamless experience 
          with built-in authentication and authorization.
        </p>
      </footer>
    </div>
  );
};

export default Home;

