import React from 'react';
import './PublicPages.css';

const About = () => {
  return (
    <div className="page-container">
      <div className="page-content" style={{ maxWidth: '900px' }}>
        <h1>About Talk-A-Tive</h1>
        
        <div className="about-section">
          <h2>Our Mission</h2>
          <p>
            Talk-A-Tive is a premier real-time messaging application designed to connect people seamlessly. 
            Whether you're looking for one-on-one conversations or dynamic group chats, our platform provides 
            a reliable, secure, and highly engaging experience. Our mission is to make digital communication 
            as effortless and natural as face-to-face conversations.
          </p>
        </div>

        <div className="about-section">
          <h2>Key Features</h2>
          <ul className="features-list">
            <li><strong>Real-Time Messaging:</strong> Powered by Socket.io for instantaneous message delivery.</li>
            <li><strong>Group Chats:</strong> Easily create, manage, and rename group conversations. Add or remove participants dynamically.</li>
            <li><strong>Media Sharing:</strong> Share images and files effortlessly, powered by Cloudinary for robust media management.</li>
            <li><strong>Live Search:</strong> Search for users across the platform instantly to start new conversations.</li>
            <li><strong>Typing Indicators & Notifications:</strong> See when others are typing and get real-time badge notifications for new messages.</li>
            <li><strong>Secure Authentication:</strong> Fully protected with JWT (JSON Web Tokens) and bcrypt password hashing.</li>
            <li><strong>Responsive Design:</strong> A seamless experience across desktop, tablet, and mobile devices.</li>
          </ul>
        </div>

        <div className="about-section">
          <h2>Technology Stack</h2>
          <p>
            Talk-A-Tive is built using the modern <strong>MERN stack</strong> to ensure high performance and scalability:
          </p>
          <div className="tech-stack-tags">
            <span className="tech-tag">MongoDB</span>
            <span className="tech-tag">Express.js</span>
            <span className="tech-tag">React.js</span>
            <span className="tech-tag">Node.js</span>
            <span className="tech-tag">Socket.io</span>
            <span className="tech-tag">Cloudinary</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
