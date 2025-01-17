import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';
import CyberAttackMap from './components/Map';
import MyForm from './components/MyForm';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>}/>
            <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>}/>
            <Route path="/map" element={<CyberAttackMap />} />
            <Route path="/form" element={<MyForm />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;