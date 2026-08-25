import React, { useRef, useState, useEffect } from 'react';
import './Gift.css';
import bgImage from './assets/image.JPG';
import envelopeImg from './assets/Screenshot 2026-07-13 194349.webp';

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
            YOUR PRESENCE ON OUR SPECIAL DAY<br className="mobile-break" />
            IS THE GREATEST GIFT OF ALL.<br className="desktop-break" /><br className="mobile-break" />
            SHOULD YOU WISH TO<br className="desktop-break" /><br className="mobile-break" />
            HONOUR US WITH A GIFT, A<br className="mobile-break" />
            CONTRIBUTION TOWARDS OUR FUTURE<br className="desktop-break" /><br className="mobile-break" />
            TOGETHER WOULD BE DEEPLY<br className="mobile-break" />
            APPRECIATED.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Gift;
