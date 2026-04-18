import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar.js";
import "./Upload.css";

function Upload() {

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Clean preview memory
  useEffect(() => {
  return () => {};
  }, [preview]);

  const handleUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    if (selectedFile.type.startsWith("image")) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    } else {
      const videoURL = URL.createObjectURL(selectedFile);
      console.log("Generated Object URL via createObjectURL:", videoURL);
      setPreview(videoURL);
    }
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

      // AI Backend
      const endpoint = file.type.startsWith("video")
        ? "http://localhost:8000/predict-video/"
        : "http://localhost:8000/predict/";

      const response = await fetch(endpoint, {
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
        width: imageSize.width,
        height: imageSize.height,

        prediction: data.prediction,
        confidence: data.confidence,
        fake_prob: data.fake_prob,
        real_prob: data.real_prob,

        model: data.model,
        inference_time: data.inference_time,

        // Only for images
        gradcam: data.gradcam || null,
        fft: data.fft || null,
        face_heatmap: data.face_heatmap || null,
        prob_chart: data.prob_chart || null,
        confidence_gauge: data.confidence_gauge || null,

        date: new Date().toLocaleString()
      };

      // NEW: Save to backend DB
    try {
      await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fileName: file.name,
          result: data.prediction,
          confidence: data.confidence
        })
      });
    } catch (err) {
      console.log("DB save failed (ignored)");
    }



      // OLD localStorage (optional, kept as backup)
      let history = JSON.parse(localStorage.getItem("reports")) || [];
      history.unshift(reportData);
      if (history.length > 5) {
        history = history.slice(0, 5); // Reduced from 10 to 5 to save space
      }
      
      try {
        localStorage.setItem("reports", JSON.stringify(history));
        localStorage.setItem("latestReport", JSON.stringify(reportData));
      } catch (e) {
        console.warn("Storage quota filled, clearing history array.", e);
        // If it still exceeds, just clear history and save just this one
        localStorage.setItem("reports", JSON.stringify([reportData]));
        localStorage.setItem("latestReport", JSON.stringify(reportData));
      }
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
              accept="image/png, image/jpeg, image/jpg, video/mp4, video/avi, video/mov"
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
                {file.type.startsWith("image") ? (
                  <img
                    src={preview}
                    alt="Preview"
                    style={{ maxWidth: "100%", maxHeight: "300px" }}
                    onLoad={(e) => {
                      const { naturalWidth, naturalHeight } = e.target;
                      setImageSize({
                        width: naturalWidth,
                        height: naturalHeight
                      });
                    }}
                  />
                ) : (
                  <video
                    src={preview}
                    controls
                    autoPlay
                    muted
                    style={{ maxWidth: "100%", maxHeight: "300px" }}
                    onLoadedMetadata={(e) => {
                      setImageSize({
                        width: e.target.videoWidth,
                        height: e.target.videoHeight
                      });
                    }}
                  />
                )}
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
