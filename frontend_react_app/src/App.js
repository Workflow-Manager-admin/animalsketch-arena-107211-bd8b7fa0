import React, { useEffect, useState, createContext } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signOut } from 'firebase/auth';
import { ThemeProvider } from './theme/ThemeProvider';
import './App.css';
import './theme/palettes.css';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import DrawingPage from './pages/DrawingPage';
import LoadingSpinner from './components/LoadingSpinner';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBNA7xaoiynpwD8j3rE3qB9-daUnmDIbno",
  authDomain: "doodlefinder.firebaseapp.com",
  projectId: "doodlefinder",
  storageBucket: "doodlefinder.firebasestorage.app",
  messagingSenderId: "306458973633",
  appId: "1:306458973633:web:5862a96764e4bd75a6cb40",
  measurementId: "G-2H7VRGX2VY"
};
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

// Auth Context
export const AuthContext = createContext(null);

// PUBLIC_INTERFACE
function AppRoutes() {
  const { user, loading } = React.useContext(AuthContext);

  if (loading) return <LoadingSpinner />;
  return (
    <Routes>
      <Route path="/" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={user ? <DashboardPage /> : <Navigate to="/" />} />
      <Route path="/drawing" element={user ? <DrawingPage /> : <Navigate to="/" />} />
      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} />} />
    </Routes>
  );
}

// PUBLIC_INTERFACE
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Anonymous login flow handled here; update user context
  useEffect(() => {
    // Listen for firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // PUBLIC_INTERFACE
  const doAnonymousLogin = async (username) => {
    // (Optional: Save username in backend after login)
    await signInAnonymously(auth);
    setLoading(true); // Show spinner until Firebase finishes
  };

  // PUBLIC_INTERFACE
  const doLogout = () => {
    signOut(auth);
    setLoading(true);
  };

  return (
    <AuthContext.Provider value={{ user, loading, doAnonymousLogin, doLogout }}>
      <ThemeProvider>
        <Router>
          <AppRoutes />
        </Router>
      </ThemeProvider>
    </AuthContext.Provider>
  );
}

export default App;
