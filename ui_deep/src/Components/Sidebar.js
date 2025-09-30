import React from "react";
import { Link } from "react-router-dom";
import './Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <ul>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/upload">Upload & Detect</Link></li>
        <li><Link to="#">History</Link></li>
        <li><Link to="#">Reports</Link></li>
        <li><Link to="#">Settings</Link></li>
        <li><Link to="#">About</Link></li>
      </ul>
    </div>
  );
}

export default Sidebar;
