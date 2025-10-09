import React, { useState, useRef } from "react";
import Navbar from "../Components/Navbar.js";
import "./Upload.css";

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
      const response = await fetch("http://localhost:8000/predict/", {
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

  const reuploadImage = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    fileInputRef.current.click(); // immediately open file picker
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

            <div className="button-group" style={{ marginTop: "10px" }}>
              <button
                className="detect-btn"
                onClick={runDetection}
                disabled={!file || loading}
              >
                {loading ? "Detecting..." : "Run Detection"}
              </button>

              {file && !loading && (
                <button
                  className="reupload-btn"
                  onClick={reuploadImage}
                  style={{
                    marginLeft: "10px",
                    backgroundColor: "#f0f0f0",
                    color: "#333",
                  }}
                >
                  🔁 Re-upload
                </button>
              )}
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
    </div>
  );
}

export default Upload;
