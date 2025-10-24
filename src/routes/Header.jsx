import './Header.css';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ onLogout }) => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  const handleLogoutClick = () => {
    onLogout(); // update App.js state
    navigate("/"); // ✅ redirect to login page
  };

  return (
    <header className="header">
      <h1 className="logo">Mk</h1>
      <nav>
        <ul className="nav-list">
          {isLoggedIn ? (
            <>
              <Link to="/home"><li>Home</li></Link>
              <Link to="/partyadd"><li>PartyAdd</li></Link>
              <Link to="/settlingentry"><li>SettlingEntry</li></Link>
              <Link to="/balancesheet"><li>BalanceSheet</li></Link>
              <Link to="/deleteall"><li>Deleteall</li></Link>
              <li onClick={handleLogoutClick} style={{ cursor: "pointer", color: "red" }}>
                Logout
              </li>
            </>
          ) : (
            <Link to="/"><li>Login</li></Link>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
