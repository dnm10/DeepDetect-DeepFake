import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.js";
import Signup from "./pages/Signup.js";
import Twofactor from "./pages/Twofactor.js";
import Dashboard from "./pages/Dashboard.js";
import Upload from "./pages/Upload.js";
import Navbar from "./Components/Navbar.js";
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
        </Routes>
      </Router>
    </div>
  );
}

export default App;
