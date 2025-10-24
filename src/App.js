import './App.css';
import Header from './routes/Header';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PartyAdd from './routes/partyadd';
import SettlingEntry from './routes/settling';
import Bs from './routes/balancesheet';
import { PartyProvider } from './Context/partycontext';
import Home from './routes/Home';
import Deleteall from './routes/deleteall';
import LoginPage from './routes/Login';
import { useState } from 'react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  const handleLogin = () => {
    localStorage.setItem("isLoggedIn", "true");
    setIsLoggedIn(true); // update state to re-render
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false); // update state to re-render
  };

  return (
    <BrowserRouter>
      {!isLoggedIn ? (
        <Routes>
          {/* Show login page if not logged in */}
          <Route path="*" element={<LoginPage onLogin={handleLogin} />} />
        </Routes>
      ) : (
        <>
          <Header onLogout={handleLogout} />
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} /> {/* redirect / */}
            <Route path="/home" element={<Home />} />
            <Route path="/balancesheet" element={<Bs />} />
            <Route
              path="/partyadd"
              element={
                <PartyProvider>
                  <PartyAdd />
                </PartyProvider>
              }
            />
            <Route
              path="/settlingentry"
              element={
                <PartyProvider>
                  <SettlingEntry />
                </PartyProvider>
              }
            />
            <Route path="/deleteall" element={<Deleteall />} />
          </Routes>
        </>
      )}
    </BrowserRouter>
  );
}

export default App;
