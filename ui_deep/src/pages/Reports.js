import React, { useState } from "react";
import Navbar from "../Components/Navbar.js";
import { 
  FaDownload, 
  FaFileAlt, 
  FaChartBar, 
  FaShieldAlt, 
  FaClock,
  FaCheckCircle,
  FaFilePdf,
  FaSync
} from "react-icons/fa";
import "./Reports.css";

function Reports() {
  const [selectedItem, setSelectedItem] = useState("");
  const [isGenerated, setIsGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const historyData = [
    { 
      id: 1, 
      fileName: "profile_photo.jpg", 
      date: "2024-03-15", 
      result: "Fake", 
      confidence: 97,
      fileSize: "2.4 MB",
      analysisTime: "3.2s",
      detectionModel: "Advanced CNN v2.1"
    },
    { 
      id: 2, 
      fileName: "vacation_pic.png", 
      date: "2024-03-14", 
      result: "Real", 
      confidence: 91,
      fileSize: "3.1 MB",
      analysisTime: "2.8s",
      detectionModel: "Advanced CNN v2.1"
    },
    { 
      id: 3, 
      fileName: "document.jpg", 
      date: "2024-03-13", 
      result: "Fake", 
      confidence: 88,
      fileSize: "1.8 MB",
      analysisTime: "2.5s",
      detectionModel: "Advanced CNN v2.1"
    },
  ];

  const selectedFileData = historyData.find(item => item.fileName === selectedItem);

  const handleGenerate = () => {
    if (selectedItem) {
      setIsGenerating(true);
      // Simulate report generation
      setTimeout(() => {
        setIsGenerating(false);
        setIsGenerated(true);
      }, 2000);
    }
  };

  const handleNewReport = () => {
    setSelectedItem("");
    setIsGenerated(false);
  };

  const handleDownload = () => {
    alert(`Downloading report for: ${selectedItem}`);
    // In real implementation, this would download the PDF
  };

  return (
    <div className="reports-page">
      <Navbar />
      
      <div className="reports-container">
        {/* Header */}
        <div className="reports-header">
          <h1 className="reports-title">Analysis Reports</h1>
          <p className="reports-subtitle">
            Generate comprehensive deepfake detection reports with detailed analysis and insights
          </p>
        </div>

        {/* Main Content */}
        <div className="reports-content">
          {/* Report Generation Section */}
          <div className="report-generation-card">
            <div className="form-group">
              <label htmlFor="select-item" className="form-label">
                Select Analysis Result
              </label>
              <select
                id="select-item"
                className="report-select"
                value={selectedItem}
                onChange={(e) => {
                  setSelectedItem(e.target.value);
                  setIsGenerated(false);
                }}
              >
                <option value="">-- Choose a file --</option>
                {historyData.map((item) => (
                  <option key={item.id} value={item.fileName}>
                    {item.fileName} ({item.result} - {item.date})
                  </option>
                ))}
              </select>
            </div>

            <button
              className="generate-btn"
              onClick={handleGenerate}
              disabled={!selectedItem || isGenerating}
            >
              {isGenerating ? (
                <>
                  <FaSync className="loading-spinner" />
                  Generating Report...
                </>
              ) : (
                <>
                  <FaFileAlt />
                  Generate Detailed Report
                </>
              )}
            </button>
          </div>

          {/* Report Preview Section */}
          <div className="report-preview-section">
            {isGenerated && selectedFileData ? (
              <div className="report-preview-card fade-in">
                <div className="preview-header">
                  <FaCheckCircle style={{ color: '#00ff88', fontSize: '3rem', marginBottom: '1rem' }} />
                  <h3 className="preview-title">Report Generated Successfully</h3>
                  <p className="preview-subtitle">Comprehensive analysis report is ready</p>
                </div>

                <div className="report-details">
                  <div className="detail-item">
                    <span className="detail-label">File Name:</span>
                    <span className="detail-value">{selectedFileData.fileName}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Analysis Date:</span>
                    <span className="detail-value">{selectedFileData.date}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">File Size:</span>
                    <span className="detail-value">{selectedFileData.fileSize}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Detection Result:</span>
                    <span className={`result-badge ${selectedFileData.result === 'Fake' ? 'badge-fake' : 'badge-real'}`}>
                      {selectedFileData.result}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Detection Model:</span>
                    <span className="detail-value">{selectedFileData.detectionModel}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Analysis Time:</span>
                    <span className="detail-value">{selectedFileData.analysisTime}</span>
                  </div>
                </div>

                <div className="confidence-meter">
                  <div className="confidence-header">
                    <span className="confidence-label">Confidence Level</span>
                    <span className="confidence-value">{selectedFileData.confidence}%</span>
                  </div>
                  <div className="confidence-bar">
                    <div 
                      className="confidence-fill"
                      style={{ width: `${selectedFileData.confidence}%` }}
                    ></div>
                  </div>
                </div>

                <div className="report-actions">
                  <button className="download-btn" onClick={handleDownload}>
                    <FaFilePdf />
                    Download PDF Report
                  </button>
                  <button className="new-report-btn" onClick={handleNewReport}>
                    <FaSync />
                    New Report
                  </button>
                </div>
              </div>
            ) : (
              <div className="report-preview-card">
                <div className="empty-preview">
                  <FaFileAlt className="empty-icon" />
                  <div className="empty-text">No Report Generated</div>
                  <div className="empty-subtext">
                    Select a file and generate a report to see the preview
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Report Features */}
        <div className="report-features">
          <h3 className="features-title">What's Included in Your Report</h3>
          <div className="features-grid">
            <div className="feature-card">
              <FaChartBar className="feature-icon" />
              <div className="feature-title">Detailed Analysis</div>
              <div className="feature-desc">
                Comprehensive breakdown of detection methods and confidence scores
              </div>
            </div>
            <div className="feature-card">
              <FaShieldAlt className="feature-icon" />
              <div className="feature-title">Security Insights</div>
              <div className="feature-desc">
                Technical details about detected manipulations and security implications
              </div>
            </div>
            <div className="feature-card">
              <FaFileAlt className="feature-icon" />
              <div className="feature-title">Professional Format</div>
              <div className="feature-desc">
                PDF reports with professional layout suitable for presentations and documentation
              </div>
            </div>
            <div className="feature-card">
              <FaClock className="feature-icon" />
              <div className="feature-title">Historical Tracking</div>
              <div className="feature-desc">
                Track detection patterns and model performance over time
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;