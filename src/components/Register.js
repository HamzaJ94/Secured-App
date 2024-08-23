import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../firebase';
import * as yup from 'yup';
import '../../src/styles/Register.css'; // Import the CSS file

const passwordSchema = yup.string().min(8, 'Password must be at least 8 characters')
  .matches(/[A-Z]/, 'Password must contain an uppercase letter')
  .matches(/[a-z]/, 'Password must contain a lowercase letter')
  .matches(/[0-9]/, 'Password must contain a number')
  .matches(/[@$!%*?&]/, 'Password must contain a special character');

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await passwordSchema.validate(password);
      await createUserWithEmailAndPassword(auth, email, password);
      // navigate to home page
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="register-container">
    <div className="register-box">
      <h2>Register</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleRegister}>
        <div className='input-group2'>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="username"/>
        </div>
        <div className='input-group2'>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
        </div>
        <button type="submit" className="register-button">Register</button>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
    </div>
  );
};

export default Register;
