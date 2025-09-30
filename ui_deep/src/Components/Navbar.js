import React from "react";
import { Link } from "react-router-dom";
import './Navbar.css';
// import logo from './logo.png'; // make sure you have a logo image in src folder

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
      {/*  <img src={logo} alt="Logo" className="logo" />*/}
        <h1>Deepfake Detector</h1>
      </div>
      <div className="navbar-right">
        <ul>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/upload">Upload</Link></li>
          <li><Link to="/history">History</Link></li>
          <li><Link to="/reports">Reports</Link></li>
          <li><Link to="/settings">Settings</Link></li>
          <li><Link to="/about">About</Link></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
