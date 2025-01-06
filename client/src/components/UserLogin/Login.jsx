import React, { useState, useContext } from 'react';
import { UserContext } from '../../App'; // Import the context to access user state
import './Login.css'
const Login = () => {
  const { setCurrentUser } = useContext(UserContext); // Accessing the setCurrentUser function from context
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Handle form input changes
  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form reload

    if (!username || !password) {
      setError('Username and password are required!');
      return;
    }

    try {
      // Simulate a login API call
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid username or password!');
      }

      const data = await response.json(); // Assuming the response returns user data

      setCurrentUser(data); // Set the logged-in user using context
      localStorage.setItem('currentUser', JSON.stringify(data)); // Save user in localStorage
      alert('Login successful!');
    } catch (err) {
      setError(err.message); // Handle any error (e.g., network issues or invalid credentials)
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={handleUsernameChange}
            placeholder="Enter your username"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Enter your password"
            required
          />
        </div>

        {/* Show error message if there's any */}
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
