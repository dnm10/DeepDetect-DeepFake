import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.js";
import Signup from "./pages/Signup.js";
import Twofactor from "./pages/Twofactor.js";
import Dashboard from "./pages/Dashboard.js";
import History from "./pages/History.js";
import Upload from "./pages/Upload.js";
import About from "./pages/About.js"; 
import Navbar from "./Components/Navbar.js";
import Reports from "./pages/Reports.js";
// import Sidebar from "./Components/Sidebar.js";
import './App.css';

function App() {
  return (
    <div className="App">   
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/twofactor" element={<Twofactor />} />   
          <Route path="/dashboard" element={<Dashboard />} />
       {  /* <Route path="/sidebar" element={<Sidebar />} />  */}
          <Route path="/navbar" element={<Navbar />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/history" element={<History />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/About" element={<About />} /> 
        </Routes>
      </Router>
    </div>
  );
}

export default App;
