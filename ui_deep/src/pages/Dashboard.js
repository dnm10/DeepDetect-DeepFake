import React from "react";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import "./Dashboard.css";  

function Dashboard() {
  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard-body">
        <Sidebar />
        <div className="main-content">
          <h2>Welcome to Deepfake Detection Dashboard</h2>
          <p>Select a section from the sidebar to begin.</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
