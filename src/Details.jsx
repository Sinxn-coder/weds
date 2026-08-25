import React, { useEffect, useRef, useState } from 'react';
import './Details.css';
import frame2 from './assets/frame2.webp';
import frame2img from './assets/frame2img.webp';
import flower3 from './assets/flower3.webp';

const Details = () => {
  const [isVisible, setIsVisible] = useState(false);
  const detailsRightRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 } // Fire when 30% of the text container is visible
    );

    if (detailsRightRef.current) {
      observer.observe(detailsRightRef.current);
    }

    return () => {
      if (detailsRightRef.current) observer.unobserve(detailsRightRef.current);
    };
  }, []);

  return (
    <section className={`details-section ${isVisible ? 'is-visible' : ''}`}>
      <div className="details-left">
        <div className="details-frame-container">
          <img src={flower3} alt="Top Floral decoration" className="details-flower-top" />
          <img src={frame2img} alt="Church" className="details-church-img" />
          <img src={frame2} alt="Green Frame" className="details-green-frame" />
        </div>
      </div>
      
      <div ref={detailsRightRef} className="details-right">
        <img src={flower3} alt="Floral decoration" className="details-flower" />
        
        <h2 className="details-title">The Details</h2>
        <p className="details-subtitle">EVERYTHING YOU NEED TO KNOW</p>
        
        <div className="details-divider">
          <span className="divider-line"></span>
          <span className="divider-dot"></span>
          <span className="divider-line"></span>
        </div>
        
        <h3 className="details-event">Ceremony</h3>
        <p className="details-location">
          12:30PM AT KNISJA TAT-TWELID TAL-VERĠNI<br />
          MARIJA, MTAĦLEB
        </p>
      </div>
    </section>
  );
};

export default Details;
