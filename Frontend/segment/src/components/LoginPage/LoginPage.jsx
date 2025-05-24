import React from 'react';
import './styles.css';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ setIsAuthenticated }) => {  // <-- added setIsAuthenticated prop
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Login successful!');
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        setIsAuthenticated(true);  // <-- update auth state here
        navigate('/eventform');    // <-- redirect after login
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="particle-container">
      {[...Array(5)].map((_, index) => (
        <div className="particle" key={index}></div>
      ))}

      <div className="login-container">
        <div className="background"></div>
        <div className="login-form">
          <h2 className="login-id">Login</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required  />

            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" required/>

            <button type="submit">LOGIN</button>

            <div className="links">
              <a href="#">Forgot password?</a>
              <a href="#">Forgot ID?</a>
            </div>

            <div style={{ marginTop: '15px', textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => navigate('/signup')}
                style={{
                  background: 'transparent',
                  border: '1px solid white',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                Don't have an account? Sign Up
              </button>
            </div>
          </form>
        </div>
        <div className="powered-text">Powered by Stack-Nova(P) Ltd.</div>
      </div>
    </div>
  );
};

export default LoginPage;
