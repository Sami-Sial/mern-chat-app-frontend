import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="hero-section" aria-label="Hero">
        <div className="hero-content">
          <h1 className="hero-title">Connecting You in Real-Time with Talk-A-Tive</h1>
          <p className="hero-subtitle">
            Experience the next generation of seamless communication. Whether for personal chats or professional group collaborations, Talk-A-Tive provides instant, secure, and reliable messaging.
          </p>
          <div className="hero-buttons">
            <Link to="/auth?tab=signup" className="btn btn-primary">Start Chatting Now</Link>
            <Link to="/about" className="btn btn-secondary">About Us</Link>
          </div>
        </div>
      </section>

      {/* SEO Optimized Introduction */}
      <section className="seo-intro-section">
        <div className="seo-intro-content">
          <h2>Why Choose Talk-A-Tive for Your Messaging Needs?</h2>
          <p>
            In today's fast-paced digital world, staying connected is more important than ever. <strong>Talk-A-Tive</strong> is built on the robust MERN stack (MongoDB, Express, React, Node.js) and powered by WebSockets to deliver ultra-low latency messaging. 
            Our platform ensures that your conversations are not just real-time, but also secure and highly available across all your devices.
          </p>
        </div>
      </section>

      {/* Comprehensive Features Section */}
      <section className="features-section" aria-label="Features">
        <h2 className="section-title">Platform Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Real-Time Instant Messaging</h3>
            <p>Powered by Socket.io, messages are delivered instantly without the need to refresh, providing a fluid conversational experience.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Advanced Group Chats</h3>
            <p>Create dedicated groups, easily add or remove members, and rename groups dynamically to keep your teams organized.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Smart User Search</h3>
            <p>Find friends or colleagues quickly with our optimized real-time search functionality that queries our secure database instantly.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔔</div>
            <h3>Instant Notifications</h3>
            <p>Never miss a message. Get real-time badge notifications for unread messages across all your active conversations.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🖼️</div>
            <h3>Media Sharing</h3>
            <p>Seamlessly upload and share images and files via our integrated Cloudinary storage solution for lightning-fast media delivery.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure Authentication</h3>
            <p>Your data is protected. We use JWT (JSON Web Tokens) and bcrypt password hashing to ensure your account remains secure.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
