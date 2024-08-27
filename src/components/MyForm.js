import React, { useState, useEffect } from 'react';

const MyForm = () => {
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    // Fetch the CSRF token from the server when the component mounts
    fetch('/api/csrf-token')
      .then((response) => response.json())
      .then((data) => setCsrfToken(data.csrfToken));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare form data
    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
    };

    // Submit form data with CSRF token
    fetch('/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'CSRF-Token': csrfToken, // Send the CSRF token
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.text())
      .then((data) => alert(data))
      .catch((error) => console.error('Error:', error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input type="text" name="name" required />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" name="email" required />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default MyForm;
