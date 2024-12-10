import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './Login';
import Dashboard from './Dashboard';
import Purchase from './Purchase';
import Sales from './Sales';
import Transaction from './Transaction';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  // Simulate successful login
  const handleLoginSuccess = () => {
    setLoggedIn(true);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Conditional Route: Redirect to Login if not logged in */}
        {!loggedIn ? (
          <Route path="*" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        ) : (
          <>
            {/* Protected Routes */}
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/Purchase" element={<Purchase />} />
            <Route path="/Sales" element={<Sales />} />
            <Route path="/Transaction" element={<Transaction />} />
            <Route path="*" element={<Navigate to="/Dashboard" />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
