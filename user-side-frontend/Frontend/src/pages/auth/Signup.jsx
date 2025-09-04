import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './signup.css';

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    try {
      const response = await axios.post("http://localhost:3002/api/auth/register", {
        name,
        email,
        password
      });
      if (response.data.success) {
        setSuccessMessage('Signup successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/customer-login');
        }, 2000);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="page_wrapper">
      <div className="form_container">
        <h2>Signup</h2>
        {successMessage && <div style={{ color: 'green', marginBottom: '10px' }}>{successMessage}</div>}
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Sign Up</button>
          <p className="login-link">
            Already have an account? <Link to="/customer-login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
