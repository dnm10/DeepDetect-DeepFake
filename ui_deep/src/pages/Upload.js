import React, { useState } from "react";
import Navbar from "../Components/Navbar.js";
import './Upload.css';

function Upload() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleUpload = (e) => {
    setFile(e.target.files[0]);
    setResult(null); // reset result on new upload
  };

  const runDetection = () => {
    // Fake detection logic
    setTimeout(() => {
      setResult("⚠️ This file is likely FAKE (85%)");
    }, 1000); // simulate loading
  };

  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard-body">
        <div className="upload-container">
          <h2 className="title">Upload & Detect</h2>

          <div className="upload-card">
            <input type="file" id="file-upload" onChange={handleUpload} hidden />
            <label htmlFor="file-upload" className="upload-box">
              {file ? (
                <span>{file.name}</span>
              ) : (
                <span>📂 Click to choose a file</span>
              )}
            </label>

            <button 
              className="detect-btn" 
              onClick={runDetection}
              disabled={!file}
            >
              Run Detection
            </button>
          </div>

          {result && (
            <div className="results fade-in">
              <h3>Results:</h3>
              <p>{result}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Upload;
