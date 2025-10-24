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
    // 1️⃣ Send file to ML prediction endpoint
    const response = await fetch("http://localhost:8000/predict/", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Network error");

    const data = await response.json();
    setResult(`Prediction: ${data.prediction} (${data.confidence}%)`);

    // 2️⃣ Send result to server to save in history.json
    await fetch("http://localhost:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: file.name,
        result: data.prediction,
        confidence: data.confidence,
      }),
    });

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
              {file ? (
                <span>{file.name}</span>
              ) : (
                <span>📂 Click to choose a file</span>
              )}
            </div>

            {preview && (
              <div className="image-preview">
                <img
                  src={preview}
                  alt="Uploaded preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "300px",
                    marginTop: "10px",
                  }}
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

/*import React, { useState, useRef } from "react";
import Navbar from "../Components/Navbar.js";
import { FaUpload, FaCheck, FaTimes, FaDownload, FaSpinner, FaTimesCircle } from "react-icons/fa";
import "./Upload.css";

function Upload() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);
  const analysisTimeoutRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleFileSelect = (selectedFile) => {
    // Validate file type - Only JPEG and PNG
    const validTypes = ['image/jpeg', 'image/png'];
    if (!validTypes.includes(selectedFile.type)) {
      alert('Please select a valid image file (JPEG or PNG only)');
      return;
    }

    // Validate file size (50MB max)
    if (selectedFile.size > 50 * 1024 * 1024) {
      alert('File size must be less than 50MB');
      return;
    }

    setFile(selectedFile);
    setAnalysisResult(null);
    setUploadProgress(0);
  };

  const handleFileInput = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const simulateAnalysis = () => {
    setIsAnalyzing(true);
    setUploadProgress(0);

    // Simulate upload progress
    const uploadInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(uploadInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate analysis
    analysisTimeoutRef.current = setTimeout(() => {
      clearInterval(uploadInterval);
      setUploadProgress(100);
      
      // Simulate analysis completion
      const completionTimeout = setTimeout(() => {
        const isFake = Math.random() > 0.5;
        setAnalysisResult({
          isFake,
          confidence: Math.floor(Math.random() * 30) + 70, // 70-99% confidence
          analysisTime: Math.floor(Math.random() * 5) + 2 // 2-6 seconds
        });
        setIsAnalyzing(false);
      }, 1500);

      // Store completion timeout for cancellation
      analysisTimeoutRef.current = completionTimeout;
    }, 2000);
  };

  const handleClear = () => {
    setFile(null);
    setAnalysisResult(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCancel = () => {
    setIsAnalyzing(false);
    setUploadProgress(0);
    
    // Clear any ongoing timeouts
    if (analysisTimeoutRef.current) {
      clearTimeout(analysisTimeoutRef.current);
      analysisTimeoutRef.current = null;
    }
    
    // Reset analysis state
    setAnalysisResult(null);
  };

  const handleReupload = () => {
    handleClear();
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileType = (type) => {
    if (type === 'image/jpeg') return 'JPEG Image';
    if (type === 'image/png') return 'PNG Image';
    return 'Unknown';
  };

  return (
    <div className="upload-page">
      <Navbar />
      
      <div className="upload-container">
        <div className="upload-header">
          <h1 className="upload-title">Deepfake Detection</h1>
          <p className="upload-subtitle">
            Upload JPEG or PNG images to analyze for AI-generated content using our advanced detection algorithms
          </p>
        </div>

        <div className="upload-main">
          <div className="upload-card">
            <div 
              className={`upload-box ${isDragging ? 'drag-over' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !file && fileInputRef.current?.click()}
            >
              <FaUpload className="upload-icon" />
              <div className="upload-text">
                {file ? 'File Selected' : 'Drag & Drop or Click to Upload'}
              </div>
              <p className="upload-hint">
                Supports JPEG and PNG images up to 50MB
              </p>
              
              <div className="supported-formats">
                <span className="format-tag">JPEG</span>
                <span className="format-tag">PNG</span>
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInput}
              accept="image/jpeg,image/png"
              style={{ display: 'none' }}
            />

            {file && (
              <div className="file-info">
                <div className="file-info-header">
                  <div className="file-name">{file.name}</div>
                  <div className="file-size">{formatFileSize(file.size)}</div>
                </div>
                <div className="file-details">
                  <div className="file-detail">
                    <span className="detail-label">Type</span>
                    <span className="detail-value">{getFileType(file.type)}</span>
                  </div>
                  <div className="file-detail">
                    <span className="detail-label">Last Modified</span>
                    <span className="detail-value">
                      {new Date(file.lastModified).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {isAnalyzing && (
              <div className="upload-progress">
                <div className="progress-info">
                  <span>Analyzing...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <div className="upload-actions">
              {!file ? (
                <div className="no-file-message">
                  Please select a file to begin analysis
                </div>
              ) : isAnalyzing ? (
                <div className="analysis-buttons">
                  <button 
                    className="cancel-btn"
                    onClick={handleCancel}
                  >
                    <FaTimesCircle />
                    Cancel Analysis
                  </button>
                </div>
              ) : analysisResult ? (
                <div className="post-analysis-buttons">
                  <button 
                    className="detect-btn"
                    onClick={simulateAnalysis}
                  >
                    <FaUpload />
                    Analyze Again
                  </button>
                  <button 
                    className="clear-btn"
                    onClick={handleClear}
                  >
                    <FaTimesCircle />
                    Clear File
                  </button>
                </div>
              ) : (
                <div className="pre-analysis-buttons">
                  <button 
                    className="detect-btn"
                    onClick={simulateAnalysis}
                  >
                    <FaUpload />
                    Detect Deepfake
                  </button>
                  <button 
                    className="clear-btn"
                    onClick={handleClear}
                  >
                    <FaTimesCircle />
                    Clear File
                  </button>
                </div>
              )}
            </div>
          </div>

          {analysisResult && (
            <div className="results-section">
              <div className="results-card">
                <div className="results-header">
                  <h2 className="results-title">Analysis Results</h2>
                </div>
                
                <div className="results-content">
                  <div className={`result-indicator ${analysisResult.isFake ? 'result-fake' : 'result-real'}`}>
                    {analysisResult.isFake ? (
                      <>
                        <FaTimes className="result-icon" />
                        <div className="result-text">Potential Deepfake Detected</div>
                      </>
                    ) : (
                      <>
                        <FaCheck className="result-icon" />
                        <div className="result-text">Likely Authentic Content</div>
                      </>
                    )}
                  </div>

                  <div className="confidence-meter">
                    <div className="confidence-label">
                      <span>Confidence Level</span>
                      <span>{analysisResult.confidence}%</span>
                    </div>
                    <div className="confidence-bar">
                      <div 
                        className="confidence-fill"
                        style={{ width: `${analysisResult.confidence}%` }}
                      ></div>
                    </div>
                    <div className="confidence-value">
                      Analysis completed in {analysisResult.analysisTime}s
                    </div>
                  </div>

                  <div className="results-actions">
                    <button className="reupload-btn" onClick={handleReupload}>
                      <FaUpload />
                      Analyze Another File
                    </button>
                    <button className="download-btn">
                      <FaDownload />
                      Download Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Upload;*/
