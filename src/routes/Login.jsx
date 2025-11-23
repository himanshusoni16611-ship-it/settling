import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import './Login.css';

const LoginPage = ({ onLogin }) => {
  const [usr, setUsr] = useState('');
  const [pass, setPass] = useState('');

  const navigate = useNavigate();
  const userRef = useRef(null);
  const passRef = useRef(null);
  const buttonRef = useRef(null); // ref for the button

  const handleLogin = () => {
    if (usr === "Mk" && pass === "9900") {
      onLogin(); // ✅ tell App.js that user logged in
      navigate("/home");
    } else {
      alert("Invalid username or password ❌");
    }
  };

  const focusnextinput = (e, currentRef, nextRef) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (nextRef) {
        nextRef.current.focus();
      }
    }
  };

  return (
      <div className="app-container">
    <div className="login-container" id="login-container" name="login-containers">
      <h2>Login To Mkditigals</h2>
      User:
      <input
        type="text"
        ref={userRef}
        value={usr}
        className="usernm"
        id="usernm"
        name="usernm"
        onChange={(e) => setUsr(e.target.value)}
        onKeyDown={(e) => focusnextinput(e, userRef, passRef)}
        autoComplete="off"
      /><br />
      Password:
      <input
        type="password"
        ref={passRef}
        value={pass}
        className="pass"
        id="pass"
        name="pass"
        onChange={(e) => setPass(e.target.value)}
        onKeyDown={(e) => focusnextinput(e, passRef, buttonRef)} // focus button on Enter
     autoComplete="off"
     /><br />
      <button ref={buttonRef} onClick={handleLogin}>Login</button>
    </div>
      </div>
    </div>
  );
};

export default LoginPage;
