import React, { useState, useRef } from "react";
import Navbar from "../Components/Navbar.js";
import { FaUpload, FaCheck, FaTimes, FaDownload, FaSpinner } from "react-icons/fa";
import "./Upload.css";

function Upload() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

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
    setTimeout(() => {
      clearInterval(uploadInterval);
      setUploadProgress(100);
      
      // Simulate analysis completion
      setTimeout(() => {
        const isFake = Math.random() > 0.5;
        setAnalysisResult({
          isFake,
          confidence: Math.floor(Math.random() * 30) + 70, // 70-99% confidence
          analysisTime: Math.floor(Math.random() * 5) + 2 // 2-6 seconds
        });
        setIsAnalyzing(false);
      }, 1500);
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
              onClick={() => fileInputRef.current?.click()}
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
              <button 
                className="detect-btn"
                onClick={simulateAnalysis}
                disabled={!file || isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <FaSpinner className="loading-spinner" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <FaUpload />
                    Detect Deepfake
                  </>
                )}
              </button>
              
              {file && (
                <button 
                  className="clear-btn"
                  onClick={handleClear}
                  disabled={isAnalyzing}
                >
                  Clear
                </button>
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

export default Upload;