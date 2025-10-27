import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar.js";
import {
  FaShieldAlt,
  FaBrain,
  FaRocket,
  FaUpload,
  FaFilePdf,
  FaPython,
  FaReact,
  FaDatabase,
  FaGitAlt,
  FaAws,
  FaCheckCircle,
} from "react-icons/fa";
import "./About.css";

function About() {
  const navigate = useNavigate();

  const teamMembers = [
    {
      id: 1,
      name: "Dr. Sarah Chen",
      role: "AI Research Lead",
      bio: "PhD in Computer Vision, ResNet & deepfake detection expert.",
      initials: "SC",
    },
    {
      id: 2,
      name: "Marcus Rodriguez",
      role: "Lead Developer",
      bio: "Full-stack developer building React frontend & Python backend.",
      initials: "MR",
    },
    {
      id: 3,
      name: "Dr. Emily Watson",
      role: "Security Analyst",
      bio: "Cybersecurity and digital media authentication expert.",
      initials: "EW",
    },
    {
      id: 4,
      name: "Alex Thompson",
      role: "Product Manager",
      bio: "Responsible AI and product strategy specialist.",
      initials: "AT",
    },
  ];

  const features = [
    {
      icon: <FaBrain />,
      title: "Real-Time Detection",
      description:
        "Upload images and instantly detect AI-generated deepfakes using ResNet-based ML models.",
    },
    {
      icon: <FaFilePdf />,
      title: "PDF Reports",
      description:
        "Generate detailed reports of each analysis for documentation and sharing.",
    },
    {
      icon: <FaShieldAlt />,
      title: "High Accuracy",
      description:
        "State-of-the-art ResNet models ensure reliable deepfake detection.",
    },
    {
      icon: <FaRocket />,
      title: "Fast & Efficient",
      description:
        "Optimized processing ensures quick analysis without sacrificing accuracy.",
    },
  ];

  const techStack = [
    {
      icon: <FaPython />,
      name: "Python",
      description: "Backend API & Machine Learning Models (ResNet)",
    },
    {
      icon: <FaReact />,
      name: "React.js",
      description: "Frontend User Interface",
    },
    {
      icon: <FaDatabase />,
      name: "MySQL",
      description: "Store report history and user data",
    },
    {
      icon: <FaGitAlt />,
      name: "Git",
      description: "Version control & model code management",
    },
    { icon: <FaAws />, name: "AWS", description: "Cloud deployment & hosting" },
    {
      icon: <FaShieldAlt />,
      name: "CSS",
      description: "Styling and responsive design",
    },
  ];

  return (
    <div className="about-page">
      <Navbar />

      <div className="about-container">
        {/* Hero Section */}
        <section className="about-hero">
          <h1 className="about-title">About DeepDetect</h1>
          <p className="about-subtitle">
            Detect AI-generated deepfakes with high accuracy and generate
            comprehensive reports for analysis.
          </p>
        </section>

        {/* Features Section */}
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

        {/* Technology Stack */}
        <section className="tech-section">
          <h2 className="section-title">Our Technology Stack</h2>
          <div className="tech-grid">
            {techStack.map((tech, idx) => (
              <div key={idx} className="tech-item">
                <div className="tech-icon">{tech.icon}</div>
                <h4 className="tech-name">{tech.name}</h4>
                <p className="tech-description">{tech.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team Section 
        <section className="team-section">
          <h2 className="section-title">Meet the Team</h2>
          <div className="team-grid">
            {teamMembers.map((member) => (
              <div key={member.id} className="team-card">
                <div className="team-avatar">{member.initials}</div>
                <h3 className="team-name">{member.name}</h3>
                <div className="team-role">{member.role}</div>
                <p className="team-bio">{member.bio}</p>
              </div>
            ))}
          </div>
        </section> */}

        {/* CTA Section */}
        <section className="cta-section">
          <h2 className="cta-title">Get Started with DeepDetect</h2>
          <p className="cta-description">
            Upload images, detect deepfakes instantly, and generate detailed PDF
            reports.
          </p>
          <div className="cta-buttons">
            <a href="/upload" className="cta-btn cta-primary">
              <FaUpload /> Start Detection
            </a>
            <a href="/reports" className="cta-btn cta-secondary">
              <FaFilePdf /> View Reports
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}

export default About;
