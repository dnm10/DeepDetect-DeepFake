import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import './Upload.css';

function Upload() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const runDetection = () => {
    // Fake detection logic
    setResult("This file is likely FAKE (85%)");
  };

  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard-body">
        <Sidebar />
        <div className="main-content">
          <h2>Upload & Detect</h2>
          <input type="file" onChange={handleUpload} />
          <button onClick={runDetection}>Run Detection</button>

          {file && <p>Uploaded File: {file.name}</p>}
          {result && (
            <div className="results">
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
