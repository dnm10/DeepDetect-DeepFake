import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Signup.css";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Password must have 8 chars, 1 uppercase, 1 digit, 1 special char
  const validatePassword = (pass) => {
    const regex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(pass);
  };

  // Name should contain only alphabets and spaces
  const validateName = (name) => /^[A-Za-z\s]+$/.test(name);

  // Contact should be exactly 10 digits
  const validateContact = (contact) => /^\d{10}$/.test(contact);

  // Email should end with gmail.com or yahoo.com
  const validateEmail = (email) =>
    /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com)$/.test(email);

  const handleSignup = async (e) => {
    e.preventDefault();

    // Frontend validations
    if (!validateName(name)) {
      setError("Name can only contain alphabets and spaces.");
      return;
    }
    if (!validateContact(contact)) {
      setError("Contact number must be exactly 10 digits.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Email must be a valid Gmail or Yahoo address.");
      return;
    }
    if (!validatePassword(password)) {
      setError(
        "Password must be at least 8 characters, include 1 uppercase, 1 number, and 1 special character."
      );
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Send data to backend
    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, contact, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Signup failed");
        return;
      }

      setError("");
      navigate("/2fa"); // go to 2FA page on success
    } catch (err) {
      setError("Server error, try again later");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="logo-section">
        <img src="/logo192.png" alt="App Logo" className="logo" />
        <h1>DeepDetect</h1>
        <p>Your Shield Against Deepfakes</p>
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
            placeholder="Email (Gmail/Yahoo only)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="tel"
            placeholder="Contact Number (10 digits)"
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
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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

/*import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Signup.css";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Password must have 8 chars, 1 uppercase, 1 digit, 1 special char
  const validatePassword = (pass) => {
    const regex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(pass);
  };

  // Name should contain only alphabets and spaces
  const validateName = (name) => {
    return /^[A-Za-z\s]+$/.test(name);
  };

  // Contact should be exactly 10 digits
  const validateContact = (contact) => {
    return /^\d{10}$/.test(contact);
  };

  // Email should end with gmail.com or yahoo.com
  const validateEmail = (email) => {
    return /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com)$/.test(email);
  };

  const handleSignup = (e) => {
    e.preventDefault();

    if (!validateName(name)) {
      setError("Name can only contain alphabets and spaces.");
      return;
    }

    if (!validateContact(contact)) {
      setError("Contact number must be exactly 10 digits.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Email must be a valid Gmail or Yahoo address.");
      return;
    }

    if (!validatePassword(password)) {
      setError(
        "Password must be at least 8 characters, include 1 uppercase, 1 number, and 1 special character."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    // ✅ Normally you'd call API to register user here
    navigate("/2fa");
  };

  return (
    <div className="auth-wrapper">
      <div className="logo-section">
        <img src="/logo192.png" alt="App Logo" className="logo" />
        <h1>DeepDetect</h1>
        <p>Your Shield Against Deepfakes</p>
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
            placeholder="Email (Gmail/Yahoo only)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="tel"
            placeholder="Contact Number (10 digits)"
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
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
*/