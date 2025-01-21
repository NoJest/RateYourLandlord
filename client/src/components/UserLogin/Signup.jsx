import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../App'; // Import UserContext
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import HomePageButton from '../Buttons/HomePageButton';

const Signup = () => {
  const { setCurrentUser } = useContext(UserContext); // Access UserContext
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

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

      const data = await response.json();
      setCurrentUser(data);
      localStorage.setItem('currentUser', JSON.stringify(data));
      setSuccessMessage('Account created successfully! Redirecting...');
      setEmail('');
      setUsername('');
      setPassword('');
      setPasswordConfirm('');
      setError('');

      setTimeout(() => {
        navigate('/dashboard'); // Redirect to dashboard
      }, 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center bg-gray-100">
      <div className="w-full max-w-md ">
        <HomePageButton className="w-full" />
      </div>
      <Card className="w-full max-w-md p-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-lg">Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-group">
              <Label htmlFor="email">Email</Label>
              <Input
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
            <div className="form-group">
              <Label htmlFor="passwordConfirm">Confirm Password</Label>
              <Input
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
            {error && <div className="text-red-500 text-sm">{error}</div>}
            {successMessage && <div className="text-green-500 text-sm">{successMessage}</div>}

            <div className="form-group">
              <Button type="submit" variant="default" className="w-full">
                Sign Up
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
