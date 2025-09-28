import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Signup.css";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validatePassword = (pass) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(pass);
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (!validatePassword(password)) {
      setError(
        "Password must be at least 8 characters, include 1 uppercase, 1 number, and 1 symbol."
      );
      return;
    }
    setError("");
    navigate("/2fa");
  };

  return (
    <div className="auth-wrapper">
      <div className="logo-section">
        <img src="/logo192.png" alt="App Logo" className="logo" />
        <h1>DeepDetect</h1>
        <p>Create your account</p>
      </div>

      <div className="form-section">
        <h2>Signup</h2>
        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="tel"
            placeholder="Contact Number"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="error">{error}</p>}
          <button type="submit">Signup</button>
        </form>
        <p className="signup-text">
          Already have an account?{" "}
          <Link to="/" className="signup-link">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
