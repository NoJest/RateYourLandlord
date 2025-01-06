import { useState, createContext, useContext, useEffect } from 'react'
import { useLocation, Outlet, Navigate } from 'react-router-dom';
import './App.css'
import Homepage from "./Homepage"
import UserDashboard from './UserDashboard'
export const UserContext = createContext({
  currentUser: null,
  setCurrentUser: () => {},
});
function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);  
  // Adding loading state to manage UI feedback

  // we'll partially track the signed in user using state
  async function checkSession() {
    try {
      const response = await fetch('/api/check_session');
      if (response.status === 200) {
        const data = await response.json();
        setCurrentUser(data);
        localStorage.setItem('currentUser', JSON.stringify(data));
      } else { 
        setCurrentUser(null);
        localStorage.removeItem('currentUser');
      }
    } catch (error) {
      console.error("Failed to check session", error);
      setError("Failed to check session. Please try again later.");
    } finally {
      setLoading(false); // when done, loading state is set to false
    }
  }
  useEffect(() => {
    const storedUser= localStorage.getItem('current User');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
      setLoading(false);
    }
    checkSession();
  
  }, [])

  if (loading) {
    return <div>Loading...</div>; // display loading state until the session is checked
  }
  
  if (error) {
    return <div>{error}</div>;
  }

  // RENDER //
  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      <div className="App">
        {!currentUser ? (
          <>
            {/* If no user, render the Home component and Outlet */}
            <Homepage />
            <Outlet /> {/* This will render the nested routes */}
          </>
        ) : (
          <UserDashboard/>
        )}
      </div>
    </UserContext.Provider>
  );
}

export default App;
