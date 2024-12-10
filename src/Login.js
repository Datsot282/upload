import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import './Login.css';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [isRegistering, setIsRegistering] = useState(true); // Toggle between forms

  // Handle Registration
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email || !password || !username) {
      setError('All fields are required');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      alert('User Registered Successfully');
      setIsRegistering(false); // Switch to login after successful registration
    } catch (error) {
      setError(error.message);
    }
  };

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('All fields are required');
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Login successful');
      onLoginSuccess();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h3>{isRegistering ? 'Register' : 'Login'}</h3>
        </div>
        <div className="card-body">
          {error && <p style={{ color: 'red' }}>{error}</p>}

          {isRegistering ? (
            <form id="register-form" onSubmit={handleRegister}>
              <div className="form-group">
                <label htmlFor="email1">Email</label>
                <input
                  type="email"
                  id="email1"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="username1">Username</label>
                <input
                  type="text"
                  id="username1"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password1">Password</label>
                <input
                  type="password"
                  id="password1"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group text-center">
                <input
                  type="submit"
                  id="reg_btn"
                  value="Register"
                  className="btn btn-primary btn-block"
                />
              </div>
              <p className="text-center">
                Already have an account?{' '}
                <span
                  style={{ color: 'blue', cursor: 'pointer' }}
                  onClick={() => setIsRegistering(false)}
                >
                  Login here
                </span>
              </p>
            </form>
          ) : (
            <form id="login-form" onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group text-center">
                <input
                  type="submit"
                  id="login_btn"
                  value="Login"
                  className="btn btn-primary btn-block"
                />
              </div>
              <p className="text-center">
                Don't have an account?{' '}
                <span
                  style={{ color: 'blue', cursor: 'pointer' }}
                  onClick={() => setIsRegistering(true)}
                >
                  Register here
                </span>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
export default Login;
