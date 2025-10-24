import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const base_url ='http://localhost:3000';
  console.log("IsAuthenticated in context:",isAuthenticated);
  

  // Check for existing token 
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const savedUser = localStorage.getItem('user');
    if (accessToken && savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  //____________________( Signup function )_______________________
  const signup = async (fullName, username, email, password) => {
    try {
      const response = await axios.post(`${base_url}/api/auth/sign-up`, {
        fullName,
        username,
        email,
        password,
      });
      const { accessToken, user } = response.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Signup failed');
    }
  };
  
//____________________( SignIn function )_______________________

  const signin = async (emailOrUsername, password) => {
    try {
      const response = await axios.post(`${base_url}/api/auth/sign-in`, {
        emailOrUsername,
        password,
      });
      const { accessToken, user } = response.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Signin failed');
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, signup, signin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};