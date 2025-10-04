import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Twofactor.css";

function Twofactor() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const email = localStorage.getItem("email"); // retrieve email

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (data.success) {
        localStorage.removeItem("email"); // cleanup
        navigate("/dashboard");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Server error, try again.");
    }
  };

  const handleResend = async () => {
    try {
      await fetch("http://localhost:5000/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      alert("OTP resent to your email!");
    } catch {
      alert("Failed to resend OTP.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Two-Step Verification</h2>
      <p>Enter the 6-digit code sent to {email}</p>
      <form onSubmit={handleVerify}>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <button type="submit">Verify</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button onClick={handleResend}>Resend OTP</button>
    </div>
  );
}

export default Twofactor;
