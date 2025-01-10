import { useState, createContext, useContext, useEffect } from 'react';
import { useLocation, Outlet, useNavigate } from 'react-router-dom';
import './App.css';
import Homepage from './components/Homepage';
import UserDashboard from './components/UserDashboard';

export const UserContext = createContext();
console.log("test")
function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  // Async function to check the session status
  async function checkSession() {
    try {
      const response = await fetch('/api/check_session');
      if (response.status === 200) {
        const data = await response.json();
        setCurrentUser(data); // Set user to state
        localStorage.setItem('currentUser', JSON.stringify(data)); // Persist in localStorage
      } else {
        setCurrentUser(null);
        localStorage.removeItem('currentUser'); // Clear invalid session
      }
    } catch (error) {
      console.error("Failed to check session", error);
      setError("Failed to check session. Please try again later.");
    } finally {
      setLoading(false); // Set loading to false once the check is done
    }
  }

  // Use effect to load user from localStorage or check session
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    // console.log('Stored User:', storedUser);
     // Debugging: check if user is stored in localStorage
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser)); // Load user from localStorage if available
      setLoading(false);
    } else {
      checkSession(); // If not in localStorage, check the session
    }
  }, []);

  // Show loading state while the session is being checked
  if (loading) {
    return <div>Loading... Please wait while we check your session.</div>;
  }

  // If there's an error checking the session, show the error
  if (error) {
    return <div>{error}</div>;
  }

  // RENDER //
  return (
    
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      <div className="App">
        {/* If there is no currentUser, show the homepage, otherwise show the dashboard */}
        {!currentUser ? (
          <>
            <Homepage />
            <Outlet /> 
            {/* // Render nested routes for non-logged-in users */}
          </>
        ) : (
          <>
          {/* <UserDashboard /> */}
          <Outlet /> {/* Render nested routes for logged-in users */}
          </>
        )}
      </div>
    </UserContext.Provider>
  );
}

export default App;
