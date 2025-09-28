import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Twofactor from "./pages/Twofactor";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import './App.css';

function App() {
  return (
    <div className="App">   
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/2fa" element={<Twofactor />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<Upload />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
