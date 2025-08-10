import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add your login logic here, or just navigate somewhere
    // Example:
    // if (username && password) {
    //   navigate('/partyadd');
    // }
  };

  return (
    <form className="loginform" id="loginform" name="loginform" onSubmit={handleSubmit}>
      <label>UserName</label>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        name="username"
        id="username"
        className="username"
        required
      />
      <label>Password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        name="password"
        id="password"
        className="pass"
        required
      />
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
