import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import "./signup.css";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isEmployee = location.pathname === '/employee-login';

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    try {
      const response = await axios.post("http://localhost:3002/api/auth/login", {
        email,
        password,
        userType: isEmployee ? 'employee' : 'customer'
      });
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userType", isEmployee ? 'employee' : 'customer');
        navigate(isEmployee ? "/admin-dashboard" : "/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="page_wrapper">
      <div className="form_container">
        <h2>{isEmployee ? "Employee Login" : "Customer Login"}</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit">Login</button>
          {!isEmployee && (
            <div className="signup-link">
              <p>Not an existing user? <Link to="/signup">Sign up</Link></p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
