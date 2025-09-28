import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Twofactor.css';
function Twofactor() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleVerify = (e) => {
    e.preventDefault();
   
    navigate("/dashboard");
  };

  return (
    <div className="auth-container">
      <h2>Two-Step Verification</h2>
      <p>Enter the 6-digit code sent to your email/phone.</p>
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
      <button onClick={() => alert("Resending OTP...")}>Resend OTP</button>
    </div>
  );
}

export default Twofactor;
