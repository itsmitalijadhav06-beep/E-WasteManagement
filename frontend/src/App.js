// src/App.js
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './components/login';
import Register from './components/Register';
import BinLocator from './components/BinLocator';

const Home = () => <Navigate to={localStorage.getItem('token') ? '/locator' : '/login'} />;

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const ProtectedRoute = ({ children }) => {
    return token ? children : <Navigate to="/login" />;
  };

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/register" element={<Register setToken={setToken} />} />
          <Route
            path="/locator"
            element={
              <ProtectedRoute>
                <BinLocator />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;