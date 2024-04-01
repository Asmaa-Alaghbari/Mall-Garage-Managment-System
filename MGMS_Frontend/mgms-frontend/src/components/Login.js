import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './AuthForms.css';

// Handle user authentication
export default function Login() {
  const [username, setUsername] = useState(''); // username, email or phone number
  const [password, setPassword] = useState(''); // password

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
   
  };

  return (
    <div className="auth-form-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username, Email or Phone"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );

}