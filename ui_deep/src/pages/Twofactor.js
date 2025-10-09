import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Twofactor.css";

function Twofactor() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [lockout, setLockout] = useState(false);
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();
  const email = localStorage.getItem("email"); // retrieve email

  // Reset attempts after 5 minutes (300 seconds)
  useEffect(() => {
    let interval;
    if (lockout) {
      setTimer(300);
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setAttempts(0);
            setLockout(false);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [lockout]);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (lockout) {
      setError(`Too many attempts. Try again in ${Math.ceil(timer / 60)} min.`);
      return;
    }

    if (otp.length !== 6) {
      setError("OTP must be exactly 6 digits.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.removeItem("email");
        setAttempts(0);
        navigate("/dashboard");
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        setError(`Invalid OTP. Attempt ${newAttempts} of 3.`);

        if (newAttempts >= 3) {
          setLockout(true);
          setError("Too many failed attempts. Try again in 5 minutes.");
        }
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
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, ""); // only numbers
            setOtp(value);
          }}
          maxLength={6}
          disabled={lockout}
          required
        />
        <button type="submit" disabled={lockout}>
          Verify
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={handleResend} disabled={lockout}>
        Resend OTP
      </button>

      {lockout && (
        <p style={{ color: "orange" }}>
          You can try again in {Math.floor(timer / 60)}:
          {String(timer % 60).padStart(2, "0")} minutes.
        </p>
      )}
    </div>
  );
}

export default Twofactor;
