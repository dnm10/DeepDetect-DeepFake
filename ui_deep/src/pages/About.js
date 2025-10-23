import React from "react";
import Navbar from "../Components/Navbar.js";
import { 
  FaShieldAlt, 
  FaBrain, 
  FaRocket, 
  FaUsers,
  FaPython,
  FaReact,
  FaNodeJs,
  FaDatabase,
  FaGitAlt,
  FaAws,
  FaUpload,
  FaHistory,
  FaFileAlt,
  FaChartLine
} from "react-icons/fa";
import "./About.css";

function About() {
  const teamMembers = [
    {
      id: 1,
      name: "Dr. Sarah Chen",
      role: "AI Research Lead",
      bio: "PhD in Computer Vision with 8+ years experience in deepfake detection research.",
      initials: "SC"
    },
    {
      id: 2,
      name: "Marcus Rodriguez",
      role: "Lead Developer",
      bio: "Full-stack developer specializing in machine learning deployment and web applications.",
      initials: "MR"
    },
    {
      id: 3,
      name: "Dr. Emily Watson",
      role: "Security Analyst",
      bio: "Cybersecurity expert focusing on digital media authentication and forensic analysis.",
      initials: "EW"
    },
    {
      id: 4,
      name: "Alex Thompson",
      role: "Product Manager",
      bio: "Product strategist with background in AI ethics and responsible technology development.",
      initials: "AT"
    }
  ];

  const features = [
    {
      icon: <FaShieldAlt />,
      title: "Advanced Detection",
      description: "State-of-the-art neural networks trained on millions of images to identify even the most sophisticated deepfakes with high accuracy."
    },
    {
      icon: <FaBrain />,
      title: "AI-Powered Analysis",
      description: "Leveraging cutting-edge machine learning algorithms to analyze digital artifacts and detect manipulation patterns."
    },
    {
      icon: <FaRocket />,
      title: "Lightning Fast",
      description: "Get results in seconds with our optimized detection pipeline that processes images efficiently without compromising accuracy."
    },
    {
      icon: <FaUsers />,
      title: "User-Friendly",
      description: "Intuitive interface designed for both technical experts and casual users to easily verify media authenticity."
    }
  ];

  const techStack = [
    { icon: <FaPython />, name: "Python", description: "Machine Learning" },
    { icon: <FaReact />, name: "React", description: "Frontend Framework" },
    { icon: <FaNodeJs />, name: "Node.js", description: "Backend Runtime" },
    { icon: <FaDatabase />, name: "MongoDB", description: "Database" },
    { icon: <FaGitAlt />, name: "TensorFlow", description: "AI Framework" },
    { icon: <FaAws />, name: "AWS", description: "Cloud Infrastructure" }
  ];

  return (
    <div className="about-page">
      <Navbar />
      
      <div className="about-container">
        {/* Hero Section */}
        <section className="about-hero">
          <h1 className="about-title">About DeepDetect</h1>
          <p className="about-subtitle">
            Pioneering the fight against AI-generated misinformation with advanced 
            deepfake detection technology that's accessible to everyone.
          </p>
        </section>

        {/* Mission Section */}
        <section className="mission-section">
          <div className="mission-header">
            <h2 className="mission-title">Our Mission</h2>
            <p className="mission-text">
              To empower individuals and organizations with reliable, accessible tools 
              for detecting AI-generated media and combating digital misinformation.
            </p>
          </div>
          
          <div className="mission-content">
            <div className="mission-text">
              <p>
                In an era where AI-generated content is becoming increasingly sophisticated, 
                the ability to distinguish between real and synthetic media has never been 
                more critical. DeepDetect was born from the need to provide trustworthy, 
                easy-to-use solutions for verifying digital content authenticity.
              </p>
              <p>
                Our platform combines state-of-the-art machine learning models with 
                user-friendly interfaces, making advanced deepfake detection accessible 
                to journalists, content creators, security professionals, and everyday users.
              </p>
            </div>
            
            <div className="mission-stats">
              <div className="stat-item">
                <div className="stat-number">99.2%</div>
                <div className="stat-label">Detection Accuracy</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">50K+</div>
                <div className="stat-label">Images Analyzed</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">2.8s</div>
                <div className="stat-label">Average Analysis Time</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Service Availability</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <h2 className="section-title">Why Choose DeepDetect?</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  {feature.icon}
                </div>
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
            {techStack.map((tech, index) => (
              <div key={index} className="tech-item">
                <div className="tech-icon">
                  {tech.icon}
                </div>
                <h4 className="tech-name">{tech.name}</h4>
                <p className="tech-description">{tech.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="team-section">
          <h2 className="section-title">Meet Our Team</h2>
          <div className="team-grid">
            {teamMembers.map((member) => (
              <div key={member.id} className="team-card">
                <div className="team-avatar">
                  {member.initials}
                </div>
                <h3 className="team-name">{member.name}</h3>
                <div className="team-role">{member.role}</div>
                <p className="team-bio">{member.bio}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <h2 className="cta-title">Ready to Detect Deepfakes?</h2>
          <p className="cta-description">
            Join thousands of users who trust DeepDetect to verify media authenticity. 
            Get started today and protect yourself from AI-generated misinformation.
          </p>
          <div className="cta-buttons">
            <button className="cta-btn cta-primary">
              <FaUpload />
              Start Detection
            </button>
            <button className="cta-btn cta-secondary">
              <FaChartLine />
              View Demo
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default About;