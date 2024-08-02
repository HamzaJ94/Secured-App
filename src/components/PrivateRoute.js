import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return user ? children: <Navigate to="/"/>
};

export default PrivateRoute;
