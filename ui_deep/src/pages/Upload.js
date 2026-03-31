import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar.js";
import "./Upload.css";

function Upload() {

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Clean preview memory
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleUpload = (e) => {

    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    const validTypes = ["image/png", "image/jpeg", "image/jpg"];

    if (!validTypes.includes(selectedFile.type)) {
      alert("Only PNG, JPG, JPEG images are allowed.");
      return;
    }

    setFile(selectedFile);

    const reader = new FileReader();

    reader.onloadend = () => {
      setPreview(reader.result);
    };

    reader.readAsDataURL(selectedFile);
  };

  const openFileDialog = () => {

    if (fileInputRef.current) {
      fileInputRef.current.click();
    }

  };

  const runDetection = async () => {

    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    try {

      // 🔹 AI Backend
      const response = await fetch("http://localhost:8000/predict/", {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      

      if (data.error) {
        alert(data.error);
        return;
      }

      const reportData = {
        id: Date.now(),
        fileName: file.name,
        file: file,
        image_url: preview,
        prediction: data.prediction,
        confidence: data.confidence,
        fake_prob: data.fake_prob,
        real_prob: data.real_prob,
        model: data.model,
        width: data.width,
        height: data.height,
        inference_time: data.inference_time,

        gradcam: data.gradcam,
        fft: data.fft,
        face_heatmap: data.face_heatmap,
        prob_chart: data.prob_chart,
        confidence_gauge: data.confidence_gauge,

        date: new Date().toLocaleString()
      };

      // 🔥 NEW: Save to backend DB
await fetch("http://localhost:5000/predict", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    fileName: file.name,
    result: data.prediction,
    confidence: data.confidence,
    image_url: preview,
    model: data.model,
    width: data.width,
    height: data.height,
    inference_time: data.inference_time,
    fake_prob: data.fake_prob,
    real_prob: data.real_prob,
    gradcam: data.gradcam,
    fft: data.fft,
    face_heatmap: data.face_heatmap,
    prob_chart: data.prob_chart,
    confidence_gauge: data.confidence_gauge
  })
});



      // OLD localStorage (optional, kept as backup)
      let history = JSON.parse(localStorage.getItem("reports")) || [];
      history.unshift(reportData);
      if (history.length > 10) {
        history = history.slice(0, 10);
      }
      localStorage.setItem("reports", JSON.stringify(history));

      localStorage.setItem("latestReport", JSON.stringify(reportData));
      navigate("/reports", { state: reportData });

    } catch (error) {

      console.error(error);
      alert("Detection failed. Please check backend.");

    } finally {

      setLoading(false);

    }

  };

  const reuploadImage = () => {

    setFile(null);
    setPreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
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
              accept="image/png, image/jpeg, image/jpg"
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
                    marginTop: "10px"
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

                {loading ? "Analyzing..." : "Run Detection"}

              </button>

              {file && !loading && (

                <button
                  className="reupload-btn"
                  onClick={reuploadImage}
                  style={{
                    marginLeft: "10px",
                    backgroundColor: "#f0f0f0",
                    color: "#333"
                  }}
                >

                  🔁 Re-upload

                </button>

              )}

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

export default Upload;
