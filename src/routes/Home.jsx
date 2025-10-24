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

const styles = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: "40px",
    maxWidth: "900px",
    margin: "auto",
    backgroundColor: "#f8f9fa",
    color: "#212529",
    lineHeight: "1.6",
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
  },
  title: {
    fontSize: "3rem",
    color: "#343a40",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "1.25rem",
    color: "#6c757d",
  },
  section: {
    marginBottom: "40px",
  },
  sectionTitle: {
    fontSize: "1.75rem",
    marginBottom: "15px",
    color: "#495057",
  },
  text: {
    fontSize: "1.1rem",
  },
  footer: {
    textAlign: "center",
    fontSize: "0.9rem",
    color: "#6c757d",
    marginTop: "60px",
  },
};

export default Home;
