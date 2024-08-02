import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import * as yup from 'yup';

const passwordSchema = yup.string().min(8, 'Password must be at least 8 characters')
  .matches(/[A-Z]/, 'Password must contain an uppercase letter')
  .matches(/[a-z]/, 'Password must contain a lowercase letter')
  .matches(/[0-9]/, 'Password must contain a number')
  .matches(/[@$!%*?&]/, 'Password must contain a special character');

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await passwordSchema.validate(password);
      await createUserWithEmailAndPassword(auth, email, password);
      // navigate to home page
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="register">
      <h2>Register</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleRegister}>
        <div>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
