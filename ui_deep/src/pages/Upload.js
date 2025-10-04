import React, { useState, useRef } from "react";
import Navbar from "../Components/Navbar.js";
import './Upload.css';

function Upload() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null); 

  const fileInputRef = useRef();

  const handleUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
      setPreview(URL.createObjectURL(selectedFile)); 
    }
  };

  const openFileDialog = () => {
    fileInputRef.current.click();
  };

  const runDetection = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/predict/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Network error");

      const data = await response.json();
      setResult(`Prediction: ${data.prediction} (${data.confidence}%)`);
    } catch (error) {
      console.error(error);
      setResult("❌ Error occurred while detecting.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard-body">
        <div className="upload-container">
          <h2 className="title">Upload & Detect</h2>

          <div className="upload-card">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleUpload}
              accept="image/*"
              style={{ display: "none" }}
            />
            <div
              className="upload-box"
              onClick={openFileDialog}
              style={{ cursor: "pointer" }}
            >
              {file ? <span>{file.name}</span> : <span>📂 Click to choose a file</span>}
            </div>

            {preview && (
              <div className="image-preview">
                <img
                  src={preview}
                  alt="Uploaded preview"
                  style={{ maxWidth: "100%", maxHeight: "300px", marginTop: "10px" }}
                />
              </div>
            )}

            <button
              className="detect-btn"
              onClick={runDetection}
              disabled={!file || loading}
              style={{ marginTop: "10px" }}
            >
              {loading ? "Detecting..." : "Run Detection"}
            </button>

            {result && (
            <div className="results fade-in">
              <h3>Results:</h3>
              <p>{result}</p>
            </div>
            )}
          
          </div>

          
        </div>
      </div>
    </div>
  );
}

export default Upload;
