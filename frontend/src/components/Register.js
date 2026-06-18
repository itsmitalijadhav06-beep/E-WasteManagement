// src/components/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/v1/auth/register', {
        username,
        email,
        password,
        phone,
        lat: 18.5204,
        lng: 73.8567
      });
      const token = res.data.token;
      localStorage.setItem('token', token);
      setToken(token);
      alert('Registered successfully!');
      navigate('/locator');
    } catch (error) {
      const msg = error.response?.data?.error || error.message;
      alert('Registration failed: ' + msg);
    }
  };

  return (
    <div className="auth-page">
    <div className="auth-container">
      <form onSubmit={handleRegister} className="register-form">
        <h2>Register for Eco Bright</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input-field"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
          required
        />
        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="input-field"
          required
        />
        <button type="submit" className="btn-primary">
          REGISTER
        </button>
        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
      </div>
    </div>
  );
};

export default Register;