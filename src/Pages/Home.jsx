import { useNavigate } from "react-router-dom";
import { ArrowRight, Zap, Search, BarChart3 } from "lucide-react";
import './Home.css';

export default function Home() {
  const navigate = useNavigate();
  
  return (
    <div className="home-page">
      
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </div>
        
        <div className="hero-content">
          <div className="hero-badge">
            <Zap size={16} />
            <span>Interactive Algorithm Visualization</span>
          </div>
          
          <h1 className="hero-title">
            Master Data Structures
            <span className="gradient-text"> & Algorithms</span>
          </h1>
          
          <p className="hero-description">
            Watch sorting and searching algorithms come to life. 
            Step through each operation and understand how they work at a fundamental level.
          </p>
          
          <div className="hero-buttons">
            <button 
              className="btn-primary"
              onClick={() => navigate("/sorting")}
            >
              <BarChart3 size={20} />
              <span>Explore Sorting</span>
              <ArrowRight size={18} />
            </button>
            
            <button 
              className="btn-secondary"
              onClick={() => navigate("/searching")}
            >
              <Search size={20} />
              <span>Explore Searching</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>
      
      {/* Features Grid */}
      <section className="features">
        <h2 className="features-title">Why Use DSA Visualizer?</h2>
        
        <div className="features-grid">
          
          <div className="feature-card">
            <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
              <BarChart3 size={24} />
            </div>
            <h3>Sorting Algorithms</h3>
            <p>Visualize Bubble, Selection, Insertion, Quick, and Merge Sort with step-by-step animations.</p>
            <button 
              className="feature-link"
              onClick={() => navigate("/sorting")}
            >
              Try it now <ArrowRight size={16} />
            </button>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
              <Search size={24} />
            </div>
            <h3>Searching Algorithms</h3>
            <p>Watch Linear, Binary, and Jump Search in action. See how each algorithm finds elements.</p>
            <button 
              className="feature-link"
              onClick={() => navigate("/searching")}
            >
              Try it now <ArrowRight size={16} />
            </button>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #a855f7, #9333ea)' }}>
              <Zap size={24} />
            </div>
            <h3>Interactive Controls</h3>
            <p>Control animation speed, step through algorithms, and generate custom arrays to test.</p>
            <button 
              className="feature-link disabled"
            >
              Coming soon <ArrowRight size={16} />
            </button>
          </div>
          
        </div>
      </section>
      
      {/* Algorithms Overview */}
      <section className="algorithms-overview">
        <div className="overview-content">
          <h2 className="overview-title">Available Algorithms</h2>
          
          <div className="algorithm-list">
            <div className="algorithm-category">
              <h3>Sorting Algorithms</h3>
              <div className="algorithm-tags">
                <span className="tag">Bubble Sort</span>
                <span className="tag">Selection Sort</span>
                <span className="tag">Insertion Sort</span>
                <span className="tag">Quick Sort</span>
                <span className="tag">Merge Sort</span>
              </div>
            </div>
            
            <div className="algorithm-category">
              <h3>Searching Algorithms</h3>
              <div className="algorithm-tags">
                <span className="tag">Linear Search</span>
                <span className="tag tag-disabled">Binary Search <small>(coming soon)</small></span>
                <span className="tag tag-disabled">Jump Search <small>(coming soon)</small></span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="cta">
        <div className="cta-content">
          <h2>Ready to Start Learning?</h2>
          <p>Choose an algorithm category and watch them come to life</p>
          <div className="cta-buttons">
            <button 
              className="btn-primary"
              onClick={() => navigate("/sorting")}
            >
              Start with Sorting
            </button>
            <button 
              className="btn-secondary"
              onClick={() => navigate("/searching")}
            >
              Start with Searching
            </button>
          </div>
        </div>
      </section>
      
    </div>
  );
}