import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../App'; // Import UserContext
import './Login.css';

const Login = () => {
  // const thing = useContext(UserContext)
  // console.log(thing)
  // debuggggging
  const { setCurrentUser, currentUser } = useContext(UserContext);  // Access setCurrentUser from context
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();  // Used to navigate to the dashboard

  // Handle input changes
  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Username and password are required!');
      return;
    }

    try {
      // API call to login the user
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

      const data = await response.json(); // Assuming the response contains the user data
      setCurrentUser(data); // Set the user data in context
      localStorage.setItem('currentUser', JSON.stringify(data)); // Persist user to localStorage
      alert('Login successful!');

      // Redirect to dashboard after successful login
      navigate('/dashboard'); // Ensure this navigation happens only once
    } catch (err) {
      setError(err.message); // Handle errors (e.g., invalid credentials)
    }
  };
  // console.log({setCurrentUser})


  // Check if the user is already logged in and redirect to dashboard
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    // console.log('Stored User:', JSON.parse(storedUser)); // Debugging: check if user is stored in localStorage
    // console.log(currentUser)
    if (storedUser && !currentUser) {
      setCurrentUser(JSON.parse(storedUser)); // Load user from localStorage
      // navigate('/dashboard'); // Redirect to dashboard if user is already logged in
    }
  }, []);  // `setCurrentUser` and `navigate` are stable, so this runs once on mount

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

        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
