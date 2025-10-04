import React from "react";
import Navbar from "../Components/Navbar.js";
import { FaUpload, FaHistory, FaFileAlt, FaCog, FaLock, FaPalette } from "react-icons/fa"; 
import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard">
      <Navbar />

      <div className="dashboard-body">
        <div className="main-content">
          <h2>Welcome to DeepDetect Dashboard</h2>
          <p>Choose an option below to get started </p>

          {/* Quick Actions */}
          <div className="card-section">
            <div className="card">
              <FaUpload className="card-icon" />
              <h3>Upload</h3>
              <p>Upload new media for deepfake detection.</p>
            </div>
            <div className="card">
              <FaHistory className="card-icon" />
              <h3>History</h3>
              <p>Check your previous scans and results.</p>
            </div>
            <div className="card">
              <FaFileAlt className="card-icon" />
              <h3>Reports</h3>
              <p>Generate detailed detection reports.</p>
            </div>
          </div>

          {/* Stats */}
          <div className="stats-section">
            <div className="stat-box">
              <h4>Scans Completed</h4>
              <p>0</p>
            </div>
            <div className="stat-box">
              <h4>Deepfakes Detected</h4>
              <p>0</p>
            </div>
            <div className="stat-box">
              <h4>Reports Generated</h4>
              <p>0</p>
            </div>
          </div>

          {/* Settings Shortcuts */}
          <div className="settings-shortcuts">
            <button className="shortcut-btn">
              <FaCog className="btn-icon" /> Profile Settings
            </button>
            <button className="shortcut-btn">
              <FaLock className="btn-icon" /> Security
            </button>
            <button className="shortcut-btn">
              <FaPalette className="btn-icon" /> Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
