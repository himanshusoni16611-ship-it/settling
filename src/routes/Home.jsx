import React from "react";

const Home = () => {
  return (
    <div style={styles.container}>
        

      <header style={styles.header}>
        <h1 style={styles.title}>Welcome to MK digital setlling app</h1>
      </header>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>About Me</h2>
        <p style={styles.text}>
          I am a developer passionate about building clean and user-friendly interfaces.
          I specialize in web app and love working on creative web experiences.
        </p>
     <p style={styles.subtitle}>Crafted with passion by <strong>Mayank Soni</strong></p>
      </section>

      <footer style={styles.footer}>
        <p>© {new Date().getFullYear()} Mayank Soni. All rights reserved.</p>
      </footer>
    </div>
  );
};


export default Home;
