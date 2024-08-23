import React from 'react';
import '../../src/styles/Map.css'; // Importing the CSS file for styling

const CyberAttackMap = () => {
  return (
    <div className='map'>
        <header className="map-header">
        <nav>
        <ul>
        <li><a href="/login">Login</a></li>
         <li><a href="/register">Register</a></li>
         </ul>
         </nav>
         </header>
    <div className="map-container">
      <iframe 
        src="https://threatmap.checkpoint.com/" 
        width="100%" 
        height="600" 
        frameBorder="0" 
        allowFullScreen
        title="Live Cyber Attack Map"
      ></iframe>
    </div>
    </div>
  );
};

export default CyberAttackMap;
