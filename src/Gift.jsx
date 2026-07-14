import React, { useRef, useState, useEffect } from 'react';
import './Gift.css';
import bgImage from './assets/image.webp';
import envelopeImg from './assets/Screenshot 2026-07-13 194349.png';

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
      <div className={`gift-container ${isVisible ? 'is-visible' : ''}`}>
        <div className="gift-envelope-wrap">
          <img src={envelopeImg} alt="Envelope" className="gift-envelope-img" />
        </div>
        <div className="gift-card-fg">
          <h2 className="gift-title">Your Presence</h2>
          <h3 className="gift-subtitle">IS ALL WE ASK FOR</h3>
          <p className="gift-text-main">
            YOUR PRESENCE ON OUR SPECIAL DAY IS THE GREATEST GIFT OF ALL.
          </p>
          <div className="gift-text-secondary">
            <p>SHOULD YOU WISH TO</p>
            <p>HONOUR US WITH A GIFT, A CONTRIBUTION TOWARDS OUR FUTURE</p>
            <p>TOGETHER WOULD BE DEEPLY APPRECIATED.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gift;
