import React from "react";

const Home = () => {
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Welcome to MK Digital Settling App</h1>
      
      <div style={{ marginTop: '30px' }}>
        <h2>About Me</h2>
        <p>
          I am a developer passionate about building clean and user-friendly interfaces.
          I specialize in web apps and love working on creative web experiences.
        </p>
        <p>
          <strong>Crafted with passion by Mayank Soni</strong>
        </p>
      </div>

      <footer style={{ marginTop: '50px', color: '#666' }}>
        <p>© {new Date().getFullYear()} Mayank Soni. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
