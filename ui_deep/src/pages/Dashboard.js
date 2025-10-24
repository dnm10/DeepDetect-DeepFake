import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar.js";
import {
  FaUpload,
  FaHistory,
  FaFileAlt,
  FaCog,
  FaLock,
  FaPalette,
  FaTwitter,
  FaLinkedin,
  FaGithub,
  FaEnvelope
} from "react-icons/fa";
import "./Dashboard.css";
import { Link } from "react-router-dom";

function Dashboard() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Fetch history from backend
    fetch("http://localhost:5000/history")
      .then(res => res.json())
      .then(data => setHistory(data))
      .catch(err => console.error("Error fetching history:", err));

    // Add floating particles to cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => createParticles(card));
  }, []);

  const createParticles = (card) => {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    
    for (let i = 0; i < 8; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 6}s`;
      particle.style.animationDuration = `${4 + Math.random() * 4}s`;
      particlesContainer.appendChild(particle);
    }
    
    card.appendChild(particlesContainer);
  };

  // Stats calculation
  const totalScans = history.length;
  const deepfakesDetected = history.filter(item => item.result === "Fake").length;
  const reportsGenerated = history.filter(item => item.result === "Real" || item.result === "Fake").length;

  return (
    <div className="dashboard">
      <Navbar />

      <div className="dashboard-body">
        <div className="main-content">
          <h2>Welcome to DeepDetect Dashboard</h2>
          <p>Choose an option below to get started</p>

          {/* Quick Actions */}
          <div className="card-section">
            <Link to="/upload" className="card-link">
              <div className="card card-upload">
                <div className="card-content">
                  <FaUpload className="card-icon" />
                  <h3>Upload</h3>
                  <p>Upload new media for deepfake detection.</p>
                </div>
              </div>
            </Link>

            <Link to="/history" className="card-link">
              <div className="card card-history">
                <div className="card-content">
                  <FaHistory className="card-icon" />
                  <h3>History</h3>
                  <p>Check previous uploads and results</p>
                </div>
              </div>
            </Link>

            <Link to="/reports" className="card-link">
              <div className="card card-reports">
                <div className="card-content">
                  <FaFileAlt className="card-icon" />
                  <h3>Reports</h3>
                  <p>Generate detailed analysis reports</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Stats */}
          <div className="stats-section">
            <div className="stat-box">
              <h4>Scans Completed</h4>
              <p>{totalScans}</p>
            </div>
            <div className="stat-box">
              <h4>Deepfakes Detected</h4>
              <p>{deepfakesDetected}</p>
            </div>
            <div className="stat-box">
              <h4>Reports Generated</h4>
              <p>{reportsGenerated}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="dashboard-footer">
        <div className="footer-content">
          <div className="footer-logo">DeepDetect</div>
          <div className="footer-links">
            <a href="/privacy" className="footer-link">Privacy Policy</a>
            <a href="/terms" className="footer-link">Terms of Service</a>
            <a href="/about" className="footer-link">About Us</a>
            <a href="/contact" className="footer-link">Contact</a>
            <a href="/help" className="footer-link">Help Center</a>
          </div>
          <div className="footer-social">
            <FaTwitter className="social-icon" />
            <FaLinkedin className="social-icon" />
            <FaGithub className="social-icon" />
            <FaEnvelope className="social-icon" />
          </div>
          <div className="footer-copyright">
            <p>&copy; 2024 DeepDetect. All rights reserved. | Advanced Deepfake Detection Technology</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;
