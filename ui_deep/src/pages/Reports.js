import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar.js";
import { useLocation } from "react-router-dom";
import { FaFilePdf, FaCheckCircle } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./Reports.css";

function Reports() {

  const location = useLocation();

  const [reportData, setReportData] = useState(location.state || null);
  const [history, setHistory] = useState([]);

useEffect(() => {

  if (location.state) {
    setReportData(location.state);

    // ✅ save latest
    localStorage.setItem("latestReport", JSON.stringify(location.state));

  } else {
    const saved = localStorage.getItem("latestReport");

    if (saved) {
      setReportData(JSON.parse(saved));
    }
  }

}, [location.state]);



  /* =============================
        DOWNLOAD PDF
  ============================= */

  const handleDownload = async () => {

    if (!reportData) return;

    try {

      const doc = new jsPDF("p", "mm", "a4");
      const pageWidth = doc.internal.pageSize.getWidth();

      /* ==========================
        Convert uploaded image (SAFE)
      ========================== */

      const getBase64Image = (url) => {
        return new Promise((resolve, reject) => {

          const img = new Image();
          img.crossOrigin = "Anonymous";
          img.src = url;

          img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);

            resolve(canvas.toDataURL("image/jpeg"));
          };

          img.onerror = () => reject("Image load failed");
        });
      };

      let uploadedImage = null;

      if (reportData.image_url) {
        try {
          uploadedImage = await getBase64Image(reportData.image_url);
        } catch (e) {
          console.log("Image load failed");
        }
      }

      /* ==========================
        BACKEND CALL (SAFE)
      ========================== */
      
      const isVideo = reportData.model && reportData.model.includes("Video");
      let analysis = {};

      if (reportData.file && !isVideo) {
        try {
          const formData = new FormData();
          formData.append("file", reportData.file);

          const response = await fetch("http://localhost:8000/generate-report/", {
            method: "POST",
            body: formData
          });

          analysis = await response.json();

          if (!analysis.gradcam) {
            console.warn("Backend analysis missing gradcam");
          }
        } catch (err) {
          console.error("Backend API analysis failed", err);
          alert("Backend image analysis failed.");
          return;
        }
      }

      /* ==========================
        PAGE 1 (Always generated)
      ========================== */

      doc.setFontSize(22);
      doc.text("Deepfake Detection Analysis Report", pageWidth / 2, 20, { align: "center" });

      doc.setFontSize(10);
      doc.text("AI Powered Forgery Detection System", pageWidth / 2, 28, { align: "center" });

      doc.line(10, 32, 200, 32);

      doc.setFontSize(14);

      if (reportData.prediction === "Fake") {
        doc.setTextColor(200, 0, 0);
        doc.text("RESULT: FAKE DETECTED", pageWidth / 2, 40, { align: "center" });
      } else {
        doc.setTextColor(0, 150, 0);
        doc.text("RESULT: AUTHENTIC", pageWidth / 2, 40, { align: "center" });
      }

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.text(isVideo ? "Uploaded Video Data" : "Uploaded Image", 14, 55);

      if (uploadedImage && !isVideo) {
        doc.addImage(uploadedImage, "JPEG", 40, 60, 120, 80);
      }

      doc.setFontSize(14);
      doc.text("Detection Summary", 14, 150);

      autoTable(doc, {
        startY: 155,
        head: [["Parameter", "Value"]],
        body: [
          ["File Name", reportData.fileName || "N/A"],
          ["Prediction", reportData.prediction || "N/A"],
          ["Confidence Score", (reportData.confidence || "0") + "%"],
          ["Model Used", reportData.model || "N/A"],
          ["Detection Time", (reportData.inference_time || "0") + " s"],
          ["Resolution", (reportData.width || "0") + " x " + (reportData.height || "0")],
          ["Fake Probability", (reportData.fake_prob || "0") + "%"],
          ["Real Probability", (reportData.real_prob || "0") + "%"]
        ],
      });

      /* ==========================
        PAGES 2 & 3 (Images Only)
      ========================== */

      if (!isVideo) {
        if (analysis.gradcam || analysis.face_heatmap || analysis.fft || analysis.prob_chart) {
          doc.addPage();
          doc.setFontSize(18);
          doc.text("AI Forensic Analysis", 14, 20);

          if (analysis.gradcam) {
            doc.text("GradCAM Attention Map", 14, 35);
            doc.addImage(`data:image/png;base64,${analysis.gradcam}`, "PNG", 14, 40, 85, 85);
          }
          if (analysis.face_heatmap) {
            doc.text("Face Heatmap", 110, 35);
            doc.addImage(`data:image/png;base64,${analysis.face_heatmap}`, "PNG", 110, 40, 85, 85);
          }
          if (analysis.fft) {
            doc.text("Frequency Spectrum (FFT)", 14, 145);
            doc.addImage(`data:image/png;base64,${analysis.fft}`, "PNG", 14, 150, 85, 85);
          }
          if (analysis.prob_chart) {
            doc.text("Prediction Probability", 110, 145);
            doc.addImage(`data:image/png;base64,${analysis.prob_chart}`, "PNG", 110, 150, 85, 85);
          }
        }

        if (analysis.confidence_gauge) {
          doc.addPage();
          doc.setFontSize(18);
          doc.text("Model Confidence", 14, 20);
          doc.addImage(`data:image/png;base64,${analysis.confidence_gauge}`, "PNG", 14, 30, 180, 90);
        }
      }

      /* ==========================
        FOOTER
      ========================== */

      const pageCount = doc.getNumberOfPages();

      for (let i = 1; i <= pageCount; i++) {

        doc.setPage(i);

        doc.setFontSize(9);

        doc.text(
          "Generated by Deepfake Detection System",
          pageWidth / 2,
          290,
          { align: "center" }
        );
      }

      /* ==========================
        SAVE
      ========================== */

      doc.save(`${reportData.fileName}_Deepfake_Report.pdf`);

    } catch (err) {

      console.error(err);
      alert("Report generation failed");

    }

  };


  if (!reportData) {

    return (
      <div className="reports-page">
        <Navbar />
        <div className="reports-container">
          <h2>No Reports Available</h2>
        </div>
      </div>
    );

  }

  return (

    <div className="reports-page">

      <Navbar />

      <div className="reports-container">

        <h1 className="reports-title">Deepfake Detection Report</h1>

        <div className="uploaded-image-card">

          <h3>Uploaded {reportData.model && reportData.model.includes("Video") ? "Video" : "Image"}</h3>

          {reportData.model && reportData.model.includes("Video") ? (
            <video
              src={reportData.image_url}
              controls
              autoPlay
              muted
              className="uploaded-image"
              style={{ maxWidth: "100%", maxHeight: "300px" }}
            />
          ) : (
            <img
              src={reportData.image_url || "https://via.placeholder.com/300"}
              alt="uploaded"
              className="uploaded-image"
            />
          )}


        </div>

        <div className="report-preview-card">

          <div className="preview-header">

            <FaCheckCircle style={{ color: "#00ff88", fontSize: "3rem" }} />

            <h3>Prediction Summary</h3>

          </div>

          <div className="report-details">

            <div className="detail-item">
              <span>File Name</span>
              <span>{reportData.fileName}</span>
            </div>

            <div className="detail-item">
              <span>Model</span>
              <span>{reportData.model}</span>
            </div>

            <div className="detail-item">
              <span>Prediction</span>
              <span>{reportData.prediction}</span>
            </div>

            <div className="detail-item">
              <span>Detection Time</span>
              <span>{reportData.inference_time}s</span>
            </div>

            <div className="detail-item">
              <span>Resolution</span>
              <span>{reportData.width} x {reportData.height}</span>
            </div>

          </div>

        </div>

        <div className="report-actions">

          <button className="download-btn" onClick={handleDownload}>
            <FaFilePdf /> Download PDF Report
          </button>

        </div>

      </div>

    </div>

  );

}

export default Reports;
