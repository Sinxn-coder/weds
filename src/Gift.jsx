import React, { useRef, useState, useEffect } from 'react';
import './Gift.css';
import flowerImg from './assets/flower3.webp'; // Using a floral asset

const Gift = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <section className="gift-section" ref={sectionRef}>
      <div className={`gift-content-split ${isVisible ? 'is-visible' : ''}`}>
        {/* Left Side: Title & Subtitle */}
        <div className="gift-left">
          <h2 className="gift-title">Your Presence</h2>
          <h3 className="gift-subtitle">IS ALL WE ASK FOR</h3>
        </div>
        
        {/* Right Side: Envelope & Card */}
        <div className="gift-right">
          <div className="gift-envelope">
            {/* The back of the envelope */}
            <div className="gift-envelope-back"></div>
            
            {/* The letter card sliding out */}
            <div className="gift-card">
              <div className="gift-text">
                <p className="gift-text-spaced">
                  YOUR PRESENCE ON OUR SPECIAL<br />
                  DAY IS THE GREATEST GIFT OF<br />
                  ALL.
                </p>
                
                <div className="gift-text-group">
                  <p>SHOULD YOU WISH TO</p>
                  <p>HONOUR US WITH A GIFT, A</p>
                  <p>CONTRIBUTION TOWARDS OUR</p>
                  <p>FUTURE TOGETHER WOULD BE</p>
                  <p>DEEPLY APPRECIATED.</p>
                </div>
              </div>
            </div>

            {/* The front flaps of the envelope */}
            <div className="gift-envelope-flap-left"></div>
            <div className="gift-envelope-flap-bottom"></div>

            {/* Floral decoration on the right of the envelope */}
            {!window.matchMedia('(max-width: 768px)').matches && (
              <img src={flowerImg} alt="Flower Decoration" className="gift-flower" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gift;
