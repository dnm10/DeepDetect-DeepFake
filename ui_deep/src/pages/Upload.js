import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar.js";
import "./Upload.css";

function Upload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [videoError, setVideoError] = useState(false);

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  const [videoPoster, setVideoPoster] = useState(null);

  // 1. Properly handle Object URLs and FileReader in React 18 Strict Mode
  useEffect(() => {
    if (!file) {
      setPreview(null);
      setVideoPoster(null);
      return;
    }

    let objectUrl = null;

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      // Instantly hit the backend to forcefully decode the first frame, 
      // defeating the browser's codec decode limitation completely.
      const formData = new FormData();
      formData.append("file", file);
      fetch("http://localhost:8000/extract-first-frame/", {
        method: "POST",
        body: formData
      })
      .then(res => res.json())
      .then(data => {
         if (data.poster) setVideoPoster(data.poster);
      })
      .catch(err => console.log("Poster gen failed", err));
    }

    return () => {
      if (objectUrl) {
         // Optionally revoke, though keeping it alive is safer for router transition
      }
    };
  }, [file]);

  // 2. Reload the video element when a new preview URL is generated
  useEffect(() => {
    if (videoRef.current && preview) {
      videoRef.current.load();
    }
  }, [preview]);

  const handleUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const isImage = selectedFile.type.startsWith("image/");
    const isSupportedVideo = selectedFile.type === "video/mp4";

    if (!isImage && !isSupportedVideo) {
      alert("Unsupported file format! Please upload an Image (JPG/PNG) or an MP4 Video.");
      e.target.value = "";
      return;
    }

    setFile(selectedFile);
    setVideoError(false);
    setVideoPoster(null);
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
      const endpoint = file.type.startsWith("video/")
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
        poster: videoPoster,
        width: imageSize.width,
        height: imageSize.height,

        prediction: data.prediction,
        confidence: data.confidence,
        fake_prob: data.fake_prob,
        real_prob: data.real_prob,

        model: data.model,
        inference_time: data.inference_time,

        gradcam: null,
        fft: null,
        face_heatmap: null,
        prob_chart: null,
        confidence_gauge: null,

        date: new Date().toLocaleString()
      };

      // Save to backend DB
      try {
        await fetch("http://localhost:5000/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            result: data.prediction,
            confidence: data.confidence,
            image_url: reportData.image_url,
            model: data.model,
            width: reportData.width,
            height: reportData.height,
            inference_time: data.inference_time,
            fake_prob: data.fake_prob,
            real_prob: data.real_prob,
            gradcam: null,
            fft: null,
            face_heatmap: null,
            prob_chart: null,
            confidence_gauge: null
          })
        });
      } catch (err) {
        console.log("DB save failed (ignored)");
      }

      // History constraint & backup
      let history = JSON.parse(localStorage.getItem("reports")) || [];
      history.unshift(reportData);
      if (history.length > 5) {
        history = history.slice(0, 5);
      }
      
      try {
        localStorage.setItem("reports", JSON.stringify(history));
        localStorage.setItem("latestReport", JSON.stringify(reportData));
      } catch (e) {
        console.warn("Storage quota filled, clearing history array.", e);
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
    setVideoError(false);
    setVideoPoster(null);

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
              accept="image/png, image/jpeg, image/jpg, video/mp4"
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
                {file.type.startsWith("image/") ? (
                  <img
                    src={preview}
                    alt="Preview"
                    style={{ maxWidth: "100%", maxHeight: "300px" }}
                    onLoad={(e) => {
                      setImageSize({
                        width: e.nativeEvent.srcElement.naturalWidth,
                        height: e.nativeEvent.srcElement.naturalHeight
                      });
                    }}
                  />
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      src={preview}
                      poster={videoPoster}
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
                    >
                      Your browser does not support HTML5 video preview.
                    </video>
                  </>
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
