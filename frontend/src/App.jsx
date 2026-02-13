import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TopicSelection from './pages/TopicSelection';
import Quiz from './pages/Quiz';
import Shop from './pages/Shop';
import LanguageToggle from './components/LanguageToggle';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <LanguageProvider>
        <AuthProvider>
          <div className="app-container">
            <Navbar />
            <div className="container">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/topics"
                  element={
                    <PrivateRoute>
                      <TopicSelection />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/quiz/:topicId"
                  element={
                    <PrivateRoute>
                      <Quiz />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/shop"
                  element={
                    <PrivateRoute>
                      <Shop />
                    </PrivateRoute>
                  }
                />
                <Route path="/" element={<Navigate to="/dashboard" />} />
              </Routes>
            </div>
            <LanguageToggle />
          </div>
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;
