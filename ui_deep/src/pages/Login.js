import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validatePassword = (pass) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(pass);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validatePassword(password)) {
      setError(
        "Password must be at least 8 characters, include 1 uppercase, 1 number, and 1 symbol."
      );
      return;
    }

    try {
      // Step 1: Login request
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // Step 2: Send OTP request
      const otpResponse = await fetch("http://localhost:5000/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const otpData = await otpResponse.json();

      if (!otpData.success) {
        setError("Failed to send OTP. Try again.");
        return;
      }

      // Step 3: Store email for verification later
      localStorage.setItem("email", email);

      setError("");
      // Step 4: Navigate to Twofactor page
      navigate("/twofactor");

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
      </div>

      <div className="form-section">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email or Phone"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          <button type="submit">Login</button>
        </form>
        <p className="signup-text">
          Don’t have an account?{" "}
          <Link to="/signup" className="signup-link">
            Signup here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
