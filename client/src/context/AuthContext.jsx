import { createContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const base_url ='http://localhost:3000';
  console.log("IsAuthenticated in context:",isAuthenticated);
  

  const logoutTimerRef = useRef(null);

  const clearLogoutTimer = () => {
    if (logoutTimerRef.current) {
      console.log('Clearing logout timer');
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
  };

  const startLogoutTimer = () => {
    console.log('Starting logout timer for 2 minutes');
    clearLogoutTimer();
    logoutTimerRef.current = setTimeout(() => {
      console.log('Logout timer expired — performing auto-logout');
      logout(true);
    }, 10 * 60 * 1000);
  };


  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const savedUser = localStorage.getItem('user');
    if (accessToken && savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
      startLogoutTimer();
    }
    setLoading(false);
  }, []);

  //____________________( Signup function )_______________________
  const signup = async (fullName,username, email, password, role) => {
    try {
      const response = await axios.post(`${base_url}/api/auth/sign-up`, {
        fullName,
        username,
        email,
        password,
        role
      });
      const { accessToken, user } = response.data;
    
      if (user && user.role === 'Admin') {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        setIsAuthenticated(true);
        startLogoutTimer();
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Signup failed');
    }
  };
  
//____________________( SignIn function )_______________________

  const signin = async (email, password) => {
    try {
      const response = await axios.post(`${base_url}/api/auth/sign-in`, {
        email,
        password,
      });
      const { accessToken, user } = response.data;
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      setIsAuthenticated(true);
      startLogoutTimer();
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Signin failed');
    }
  };

  // Logout function
  // If `redirect` is true, navigate to the login page after clearing state.
  const logout = (redirect = false) => {
    console.log('Logging out. redirect=', redirect);
    clearLogoutTimer();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    if (redirect) {
      try {
        window.location.href = '/login';
      } catch (e) {
        console.log('Redirect after logout failed', e);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, signup, signin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};