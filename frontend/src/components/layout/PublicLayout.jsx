import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { ChatState } from '../../context/ChatProvider';
import { useEffect } from 'react';
import './PublicLayout.css';

const PublicLayout = () => {
  const { user } = ChatState();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/chats');
    }
  }, [user, navigate]);

  return (
    <div className="public-layout">
      <header className="public-header">
        <div className="header-content">
          <Link to="/" className="logo">Talk-A-Tive</Link>
          <nav className="header-nav">
            <Link to="/about" className="nav-link">About Us</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
            <Link to="/auth?tab=login" className="nav-btn signin-btn">Sign In</Link>
            <Link to="/auth?tab=signup" className="nav-btn signup-btn">Sign Up</Link>
          </nav>
        </div>
      </header>

      <main className="public-main">
        <Outlet />
      </main>

      <footer className="public-footer">
        <div className="footer-content">
          <div className="footer-grid">
            
            <div className="footer-column">
              <h3 className="footer-logo">Talk-A-Tive</h3>
              <p className="footer-description">
                Experience the next generation of seamless communication. Secure, real-time, and built for everyone.
              </p>
            </div>

            <div className="footer-column">
              <h4 className="footer-heading">Quick Links</h4>
              <div className="footer-links-col">
                <Link to="/about">About Us</Link>
                <Link to="/contact">Contact</Link>
                <Link to="/terms">Terms of Service</Link>
                <Link to="/privacy">Privacy Policy</Link>
              </div>
            </div>

            <div className="footer-column">
              <h4 className="footer-heading">Developer Links</h4>
              <div className="footer-links-col">
                <a href="#" target="_blank" rel="noreferrer">Portfolio</a>
                <a href="#" target="_blank" rel="noreferrer">GitHub</a>
                <a href="#" target="_blank" rel="noreferrer">LinkedIn</a>
                <a href="#" target="_blank" rel="noreferrer">Resume</a>
              </div>
            </div>

          </div>

          <div className="footer-bottom">
            <p className="copyright">&copy; {new Date().getFullYear()} Talk-A-Tive. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
