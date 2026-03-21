import React from "react";
import Navbar from "../Components/Navbar.js";
import {
  FaShieldAlt,
  FaBrain,
  FaRocket,
  FaUpload,
  FaFilePdf,
  FaChartBar,
  FaCheckCircle
} from "react-icons/fa";
import "./About.css";

function About() {

  const features = [
    {
      icon: <FaBrain />,
      title: "AI-Powered Detection",
      description:
        "Utilizes deep learning models including ResNet18, EfficientNet, and MobileNet for robust deepfake detection."
    },
    {
      icon: <FaChartBar />,
      title: "Model Comparison",
      description:
        "Compare multiple architectures to analyze performance using accuracy, F1 score, and confusion matrices."
    },
    {
      icon: <FaFilePdf />,
      title: "Detailed Reports",
      description:
        "Generate professional reports including Grad-CAM, FFT analysis, and confidence metrics."
    },
    {
      icon: <FaShieldAlt />,
      title: "High Reliability",
      description:
        "Designed to detect manipulated media with high precision and minimal false positives."
    },
    {
      icon: <FaRocket />,
      title: "Fast Processing",
      description:
        "Optimized inference pipeline ensures real-time predictions with minimal delay."
    }
  ];

  return (
    <div className="about-page">
      <Navbar />

      <div className="about-container">

        {/* HERO */}
        <section className="about-hero">
          <h1 className="about-title">About DeepDetect</h1>
          <p className="about-subtitle">
            An AI-powered deepfake detection platform designed to identify manipulated images 
            using advanced deep learning models and provide explainable results.
          </p>
        </section>

        {/* PROJECT STORY */}
        <section className="about-story">
          <h2 className="section-title">Why DeepDetect?</h2>
          <p className="about-text">
            With the rapid growth of AI-generated content, distinguishing between real and fake 
            media has become increasingly challenging. DeepDetect was developed to address this 
            problem by leveraging state-of-the-art convolutional neural networks.
          </p>

          <p className="about-text">
            The system evaluates images using multiple architectures — ResNet18, EfficientNet, 
            and MobileNet — and compares their performance to ensure reliability and transparency.
          </p>
        </section>

        {/* FEATURES */}
        <section className="features-section">
          <h2 className="section-title">Key Features</h2>
          <div className="features-grid">
            {features.map((feature, idx) => (
              <div key={idx} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="workflow-section">
          <h2 className="section-title">How It Works</h2>

          <div className="workflow-steps">
            <div className="step">
              <FaUpload />
              <p>Upload Image</p>
            </div>

            <div className="step">
              <FaBrain />
              <p>Model Analysis</p>
            </div>

            <div className="step">
              <FaCheckCircle />
              <p>Prediction & Confidence</p>
            </div>

            <div className="step">
              <FaFilePdf />
              <p>Generate Report</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section">
          <h2 className="cta-title">Start Detecting Deepfakes</h2>
          <p className="cta-description">
            Upload an image and get instant AI-powered analysis with detailed insights.
          </p>

          <div className="cta-buttons">
            <a href="/upload" className="cta-btn cta-primary">
              <FaUpload /> Start Detection
            </a>

            <a href="/comparisons" className="cta-btn cta-secondary">
              <FaChartBar /> View Model Comparison
            </a>
          </div>
        </section>

      </div>
    </div>
  );
}

export default About;