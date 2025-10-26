import React, { useState, useRef } from "react";
import Navbar from "../Components/Navbar.js";
import { 
  FaDownload, 
  FaFileAlt, 
  FaChartBar, 
  FaShieldAlt, 
  FaClock,
  FaCheckCircle,
  FaSync,
  FaImage,
  FaFilePdf 
} from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./Reports.css";

function Reports() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef();

  // Handle file selection
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      setReportData(null); // reset previous report
    }
  };

  const openFileDialog = () => fileInputRef.current.click();

  // Generate report using ML backend
  const handleGenerateReport = async () => {
    if (!uploadedFile) return;

    setIsGenerating(true);
    setReportData(null);

    const formData = new FormData();
    formData.append("file", uploadedFile);

    try {
      const response = await fetch("http://localhost:8000/predict/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Network error");

      const data = await response.json();

      const newReport = {
        fileName: uploadedFile.name,
        fileSize: `${(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB`,
        date: new Date().toLocaleDateString(),
        result: data.prediction,
        confidence: data.confidence,
        detectionModel: "Advanced CNN v2.1",
        analysisTime: "Real-time",
      };

      setReportData(newReport);

      // Optional: Save report to server history
      await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: newReport.fileName,
          result: newReport.result,
          confidence: newReport.confidence,
        }),
      });

    } catch (error) {
      console.error(error);
      alert("Error generating report: " + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNewReport = () => {
    setUploadedFile(null);
    setReportData(null);
  };

  // Generate PDF using jsPDF
  const handleDownload = () => {
    if (!reportData) return;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Deepfake Analysis Report", 14, 22);

    doc.setFontSize(12);
    doc.text(`File Name: ${reportData.fileName}`, 14, 40);
    doc.text(`Date: ${reportData.date}`, 14, 50);
    doc.text(`File Size: ${reportData.fileSize}`, 14, 60);
    doc.text(`Detection Model: ${reportData.detectionModel}`, 14, 70);
    doc.text(`Detection Result: ${reportData.result}`, 14, 80);
    doc.text(`Confidence Level: ${reportData.confidence}%`, 14, 90);
    doc.text(`Analysis Time: ${reportData.analysisTime}`, 14, 100);

    // Confidence bar
    doc.setDrawColor(0);
    const barWidth = reportData.confidence * 1.5;
    doc.setFillColor(reportData.result === "Fake" ? 255 : 0, reportData.result === "Fake" ? 0 : 255, 0);
    doc.rect(14, 105, barWidth, 10, "F");

    doc.save(`${reportData.fileName}_report.pdf`);
  };

  return (
    <div className="reports-page">
      <Navbar />

      <div className="reports-container">
        <div className="reports-header">
          <h1 className="reports-title">Real-Time Analysis Reports</h1>
          <p className="reports-subtitle">
            Upload an image and generate an instant AI-powered detection report.
          </p>
        </div>

        <div className="reports-content">
          {/* Upload & Generate Section */}
          <div className="report-generation-card">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              style={{ display: "none" }}
            />

            <div
              className="upload-box"
              onClick={openFileDialog}
              style={{ cursor: "pointer" }}
            >
              {uploadedFile ? (
                <span>{uploadedFile.name}</span>
              ) : (
                <span>📂 Click to choose an image</span>
              )}
            </div>

            {uploadedFile && (
              <p className="file-info">
                <FaImage /> {uploadedFile.name} ({(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB)
              </p>
            )}

            <button
              className="generate-btn"
              onClick={handleGenerateReport}
              disabled={!uploadedFile || isGenerating}
            >
              {isGenerating ? (
                <>
                  <FaSync className="loading-spinner" /> Generating Report...
                </>
              ) : (
                <>
                  <FaFileAlt /> Generate Report
                </>
              )}
            </button>
          </div>

          {/* Report Preview Section */}
          <div className="report-preview-section">
            {reportData ? (
              <div className="report-preview-card fade-in">
                <div className="preview-header">
                  <FaCheckCircle style={{ color: '#00ff88', fontSize: '3rem', marginBottom: '1rem' }} />
                  <h3 className="preview-title">Report Generated</h3>
                  <p className="preview-subtitle">AI-based analysis completed successfully</p>
                </div>

                <div className="report-details">
                  <div className="detail-item"><span>File Name:</span> <span>{reportData.fileName}</span></div>
                  <div className="detail-item"><span>Date:</span> <span>{reportData.date}</span></div>
                  <div className="detail-item"><span>File Size:</span> <span>{reportData.fileSize}</span></div>
                  <div className="detail-item"><span>Model:</span> <span>{reportData.detectionModel}</span></div>
                  <div className="detail-item">
                    <span>Result:</span> 
                    <span className={`result-badge ${reportData.result === "Fake" ? "badge-fake" : "badge-real"}`}>
                      {reportData.result}
                    </span>
                  </div>
                  <div className="detail-item"><span>Analysis Time:</span> <span>{reportData.analysisTime}</span></div>
                </div>

                <div className="confidence-meter">
                  <div className="confidence-header">
                    <span className="confidence-label">Confidence Level</span>
                    <span className="confidence-value">{reportData.confidence}%</span>
                  </div>
                  <div className="confidence-bar">
                    <div 
                      className="confidence-fill"
                      style={{ width: `${reportData.confidence}%` }}
                    ></div>
                  </div>
                </div>

                <div className="report-actions">
                  <button className="download-btn" onClick={handleDownload}>
                    <FaFilePdf /> Download PDF Report
                  </button>
                  <button className="new-report-btn" onClick={handleNewReport}>
                    <FaSync /> New Report
                  </button>
                </div>
              </div>
            ) : (
              <div className="report-preview-card">
                <div className="empty-preview">
                  <FaFileAlt className="empty-icon" />
                  <div className="empty-text">No Report Yet</div>
                  <div className="empty-subtext">
                    Upload an image and generate a report to see the results here
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Report Features */}
        <div className="report-features">
          <h3 className="features-title">What's Inside Your Report</h3>
          <div className="features-grid">
            <div className="feature-card">
              <FaChartBar className="feature-icon" />
              <div className="feature-title">Detailed Analysis</div>
              <div className="feature-desc">Comprehensive breakdown with model confidence and decision metrics</div>
            </div>
            <div className="feature-card">
              <FaShieldAlt className="feature-icon" />
              <div className="feature-title">Integrity Check</div>
              <div className="feature-desc">Verifies manipulation traces and authenticity clues</div>
            </div>
            <div className="feature-card">
              <FaFileAlt className="feature-icon" />
              <div className="feature-title">Professional Report</div>
              <div className="feature-desc">Auto-generated PDF reports ready for sharing or documentation</div>
            </div>
            <div className="feature-card">
              <FaClock className="feature-icon" />
              <div className="feature-title">Instant Processing</div>
              <div className="feature-desc">Real-time analysis within seconds of image upload</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;
