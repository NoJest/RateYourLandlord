import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../App'; // Import UserContext if you need it
import './Signup.css'; // Import the CSS for Signup component

const Signup = () => {
  const { setCurrentUser } = useContext(UserContext); // You can use this to update the logged-in user if needed
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Handle input changes
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handlePasswordConfirmChange = (e) => setPasswordConfirm(e.target.value);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !username || !password || !passwordConfirm) {
      setError('All fields are required!');
      return;
    }

    if (password !== passwordConfirm) {
      setError('Passwords do not match!');
      return;
    }

    try {
      // Send data to backend to create a new user
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, password }),
      });

      if (!response.ok) {
        throw new Error('Failed to create account. Please try again.');
      }

      const data = await response.json(); // Assuming the response returns user data

      // Optionally set the user as the current user if the signup is successful
      setCurrentUser(data);

      // Save user data in localStorage
      localStorage.setItem('currentUser', JSON.stringify(data));

      setSuccessMessage('Account created successfully! Please log in.');
      setEmail('');
      setUsername('');
      setPassword('');
      setPasswordConfirm('');
      setError('');
      // After a short delay, navigate to the /dashboard route
      setTimeout(() => {
        navigate('/dashboard');  // Redirect to the dashboard page
      }, 2000);  // You can adjust the delay time as per your preferenc
    } catch (err) {
      setError(err.message); // Handle any error that occurred
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter your email"
            required
          />
        </div>

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

        <div className="form-group">
          <label htmlFor="passwordConfirm">Confirm Password</label>
          <input
            type="password"
            id="passwordConfirm"
            name="passwordConfirm"
            value={passwordConfirm}
            onChange={handlePasswordConfirmChange}
            placeholder="Confirm your password"
            required
          />
        </div>

        {/* Show error or success message */}
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        <div className="form-group">
          <button type="submit">Sign Up</button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
