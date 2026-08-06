import React from 'react';
import './PublicPages.css';

const Projects = () => {
  const myProjects = [
    {
      id: 1,
      title: 'File Cloud Drive',
      description: 'A secure and scalable cloud storage solution for all your files. Seamlessly upload, organize, and access your data from anywhere.',
      tags: ['React', 'Node.js', 'MongoDB', 'AWS S3', 'Capacitor'],
      link: 'http://localhost:3000' // Assuming portfolio is running on standard port
    },
    {
      id: 2,
      title: 'PDF AI Insights',
      description: 'Unlock the power of your documents with AI. Automatically extract insights, summarize pages, and chat with your PDFs directly.',
      tags: ['Next.js', 'OpenAI', 'Tailwind CSS', 'Capacitor'],
      link: 'http://localhost:3000' // Assuming portfolio is running on standard port
    },
    {
      id: 3,
      title: 'Talk-A-Tive (This App)',
      description: 'A real-time messaging application providing instant communication, group chats, and seamless media sharing via WebSockets.',
      tags: ['MERN Stack', 'Socket.io', 'Cloudinary'],
      link: '/'
    }
  ];

  return (
    <div className="page-container">
      <div className="page-content" style={{ maxWidth: '1000px', backgroundColor: 'transparent', boxShadow: 'none', padding: '1rem' }}>
        <h1 style={{ color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.5)', marginBottom: '3rem' }}>My Other Projects</h1>
        
        <div className="projects-grid">
          {myProjects.map((project) => (
            <div key={project.id} className="project-card">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="tech-stack-tags" style={{ marginTop: 'auto', paddingTop: '1rem', paddingBottom: '1rem' }}>
                {project.tags.map((tag, index) => (
                  <span key={index} className="tech-tag" style={{ fontSize: '0.8rem', padding: '0.3rem 0.8rem' }}>{tag}</span>
                ))}
              </div>
              <a href={project.link} className="submit-btn" style={{ textAlign: 'center', textDecoration: 'none', padding: '0.6rem', marginTop: '0.5rem' }}>
                {project.title.includes('Talk-A-Tive') ? 'Go to App' : 'View on Portfolio'}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;
