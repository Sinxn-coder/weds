import React, { useRef, useState, useEffect } from 'react';
import './DressCode.css';
import imgCouple from './assets/couple/couple.webp';
import imgFrameFlower from './assets/couple/frameflower.webp';
import imgTopFlower from './assets/couple/topflower.webp';

const DressCode = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <section className="dresscode-section" ref={sectionRef}>
      <div className={`dresscode-container ${isVisible ? 'is-visible' : ''}`}>
        
        {/* Left Column: Image & Frame */}
        <div className="dresscode-left">
          <div className="dresscode-image-wrapper">
            <img src={imgCouple} alt="Couple in formal attire" className="dresscode-couple-img" />
            <img src={imgFrameFlower} alt="Decorative flower on frame" className="dresscode-frame-flower" />
          </div>
        </div>

        {/* Right Column: Content */}
        <div className="dresscode-right">
          <div className="dresscode-top-flower-wrapper">
            <img src={imgTopFlower} alt="Top floral decoration" className="dresscode-top-flower" />
          </div>
          
          <h2 className="dresscode-title">Dress Code</h2>
          <h3 className="dresscode-subtitle">WHAT TO WEAR</h3>
          
          <div className="dresscode-divider">
            <span className="dresscode-divider-line"></span>
            <span className="dresscode-divider-dot"></span>
            <span className="dresscode-divider-line"></span>
          </div>

          <p className="dresscode-text">
            We kindly invite you to dress in<br/>
            elegant formal attire for our celebration.
          </p>

          <div className="dresscode-warning-box-wrapper">
            <div className="dresscode-emblem">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <circle cx="12" cy="12" r="11" fill="#cda858" />
                <path d="M12 4 C15 8 18 10 18 12 C18 15 12 20 12 20 C12 20 6 15 6 12 C6 10 9 8 12 4 Z" fill="#fff" opacity="0.6"/>
              </svg>
            </div>
            
            <div className="dresscode-warning-box">
              <div className="dresscode-prohibited-icon">
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <circle cx="12" cy="12" r="11" fill="#581c22" />
                  <line x1="7" y1="17" x2="17" y2="7" stroke="#fff" strokeWidth="1.5" />
                </svg>
              </div>
              <span className="dresscode-warning-text">KINDLY AVOID WEARING PLUM.</span>
            </div>
            
            <div className="dresscode-bottom-ornament">
              <svg viewBox="0 0 40 10" width="40" height="10">
                <circle cx="20" cy="5" r="3" fill="#cda858" />
                <circle cx="10" cy="5" r="2" fill="#cda858" opacity="0.6" />
                <circle cx="30" cy="5" r="2" fill="#cda858" opacity="0.6" />
              </svg>
            </div>
          </div>

          <p className="dresscode-text-footer">
            Thank you for helping us keep our<br/>
            wedding palette harmonious.
          </p>
          <p className="dresscode-text-footer" style={{ marginTop: '1.5rem', fontStyle: 'italic', opacity: 0.8 }}>
            Guests are welcome to bring comfortable shoes for later in the evening. A cloakroom will be available for shoe storage.
          </p>
        </div>

      </div>
    </section>
  );
};

export default DressCode;
