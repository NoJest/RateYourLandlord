import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../App'; // Import UserContext
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from 'react-router-dom';
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import HomePageButton from '../Buttons/HomePageButton';

const Login = () => {
  const { setCurrentUser, currentUser } = useContext(UserContext); // Access setCurrentUser from context
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Used to navigate to the dashboard

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

  // Check if the user is already logged in and redirect to dashboard
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser && !currentUser) {
      setCurrentUser(JSON.parse(storedUser)); // Load user from localStorage
    }
  }, []); // `setCurrentUser` is stable, so this runs once on mount

  return (
    <div className="flex flex-col justify-center items-center bg-gray-100 ">
      <div className="w-full max-w-sm ">
        <HomePageButton className="w-full" />
      </div>
      <Card className="w-full max-w-sm p-6 shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-group">
              <Label htmlFor="username">Username</Label>
              <Input
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
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter your password"
                required
              />
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <div className="form-group flex gap-4 mt-4">
              <Button type="submit" variant="default" className="w-full">
                Login
              </Button>
              <Link to="/signup" className="w-full">
                <Button variant="default" className="w-full" aria-label="Create a new account">
                  Sign Up
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;

