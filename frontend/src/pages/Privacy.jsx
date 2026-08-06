import React from 'react';
import './PublicPages.css';

const Privacy = () => {
  return (
    <div className="page-container">
      <div className="page-content">
        <h1>Privacy Policy</h1>
        <p>Talk-A-Tive is committed to protecting your privacy. This policy outlines how we handle your data.</p>
        <h3>Data Collection</h3>
        <p>We collect information you provide directly to us, such as when you create an account or send a message. This includes your name, email address, profile picture, and the content of your communications.</p>
        <h3>Data Usage</h3>
        <p>We use the information we collect to operate, maintain, and provide the features of our service. We do not sell your personal data to third parties.</p>
        <h3>Security</h3>
        <p>We implement reasonable security measures to protect your information, but remember that no method of transmission over the Internet is 100% secure.</p>
      </div>
    </div>
  );
};

export default Privacy;
