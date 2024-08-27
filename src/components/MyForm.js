// src/components/MyForm.js

import React, { useState } from 'react';
import { fetchCsrfToken } from '../utils/csrf'; // Adjust the path as necessary
import '../../src/styles/MyForm.css'; // Importing the CSS file for styling

const MyForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const csrfToken = await fetchCsrfToken(); // Get the CSRF token

    const response = await fetch('/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'CSRF-Token': csrfToken, // Include the CSRF token in the headers
      },
      credentials: 'include', // Ensure cookies are included in the request
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      console.log('Data submitted securely');
    } else {
      console.error('Failed to submit data');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default MyForm;
