import React, { useEffect, useRef, useState } from 'react';
import './Timeline.css';

// Import icons in numerical order
import icon1 from './assets/timeline/1.webp';
import icon2 from './assets/timeline/2.webp';
import icon3 from './assets/timeline/3.webp';
import icon4 from './assets/timeline/4.webp';
import icon5 from './assets/timeline/5.webp';
import icon6 from './assets/timeline/6.webp';
import icon7 from './assets/timeline/7.webp';
import icon8 from './assets/timeline/8.webp';

import imgFlowertime from './assets/timeline/flowertime.webp';
import imgUnder from './assets/timeline/under.webp';
import imgDesktopBg from './assets/timeline/desktopbg.webp';
import imgMobileBg from './assets/timeline/mobilebg.webp';

import imgFrame1 from './assets/img4.webp';
import imgFrame2 from './assets/img5.webp';
import imgFrame3 from './assets/img6.webp';

const timelineEvents = [
  { time: '12:30 PM', title: 'CEREMONY / MASS', desc: '', icon: icon1 },
  { time: '1:30 PM', title: 'SIGNING / PHOTOS / CHAMPAGNE', desc: '', icon: icon2 },
  { time: '2:30 PM', title: 'VENUE ARRIVAL & CHAMPAGNE TOWER', desc: '', icon: icon3 },
  { time: '4:00 PM', title: 'BBQ STATION OPEN', desc: '', icon: icon4 },
  { time: '5:15 PM', title: 'FIRST DANCE', desc: '', icon: icon5 },
  { time: '7:30 PM', title: 'CUTTING OF CAKE', desc: '', icon: icon6 },
  { time: '7:45 PM', title: 'AFTER PARTY', desc: '', icon: icon7 },
  { time: '9:30 PM', title: 'GOING AWAY', desc: '', icon: icon8 },
];

const TimelineRow = ({ leftItem, rightItem, isVisible, index }) => {
  const rowRef = useRef(null);

  return (
    <div
      className={`timeline-row ${isVisible ? 'is-visible' : ''}`}
      ref={rowRef}
      style={{ transitionDelay: `${index * 0.25}s` }}
    >
      <div className="timeline-side left-side">
        {leftItem && (
          <div className="timeline-content">
            <div className="timeline-icon">
              <img src={leftItem.icon} alt="event icon" style={leftItem.iconSize ? { width: leftItem.iconSize, height: leftItem.iconSize } : {}} />
            </div>
            <div className="timeline-text">
              <div className="timeline-time">{leftItem.time}</div>
              <div className="timeline-title">{leftItem.title}</div>
              {leftItem.desc && <div className="timeline-desc">{leftItem.desc}</div>}
            </div>
          </div>
        )}
      </div>
      
      <div className="timeline-dot"></div>

      <div className="timeline-side right-side">
        {rightItem && (
          <div className="timeline-content">
            <div className="timeline-icon">
              <img src={rightItem.icon} alt="event icon" style={rightItem.iconSize ? { width: rightItem.iconSize, height: rightItem.iconSize } : {}} />
            </div>
            <div className="timeline-text">
              <div className="timeline-time">{rightItem.time}</div>
              <div className="timeline-title">{rightItem.title}</div>
              {rightItem.desc && <div className="timeline-desc">{rightItem.desc}</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Timeline = () => {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const lineRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const [lineTop, setLineTop] = useState(0);
  const [lineHeight, setLineHeight] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Measure first and last dot positions relative to the track
  useEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      const rows = trackRef.current.querySelectorAll('.timeline-row');
      if (rows.length < 2) return;
      
      // .timeline-dot is 23px from top + 3px half-height = 26px
      const firstRow = rows[0];
      const firstCenter = firstRow.offsetTop + 26;
      
      const lastRow = rows[rows.length - 1];
      const lastCenter = lastRow.offsetTop + 26;
      
      setLineTop(firstCenter);
      setLineHeight(lastCenter - firstCenter);
    };

    const resizeObserver = new ResizeObserver(() => measure());
    if (trackRef.current) {
      resizeObserver.observe(trackRef.current);
    }
    
    measure(); // Initial measurement

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <section
      className="timeline-section"
      ref={sectionRef}
      style={{
        '--desktop-bg': `url(${imgDesktopBg})`,
        '--mobile-bg': `url(${imgMobileBg})`
      }}
    >
      
      {/* Background scenery replacement (color gradient) */}
      <div className="timeline-bg"></div>

      {/* Decorative Envelope under the card */}
      <img src={imgUnder} alt="under envelope" className="timeline-under-flower" />

      {/* Frames on the right side */}
      <div className="timeline-frames-right">
        <img src={imgFrame1} alt="frame 1" className="timeline-frame timeline-frame-1" />
        <img src={imgFrame2} alt="frame 2" className="timeline-frame timeline-frame-2" />
        <img src={imgFrame3} alt="frame 3" className="timeline-frame timeline-frame-3" />
      </div>

      {/* Main Content Card */}
      <div className={`timeline-card ${isVisible ? 'is-visible' : ''}`}>
        <div className="timeline-header">
          <span className="timeline-our">our</span>
          <h2 className="timeline-main-title">timeline</h2>
          <div className="timeline-divider">
            <span className="timeline-heart">♡</span>
          </div>
          <p className="timeline-subtitle">
            Here's how our day will unfold.<br />
            We can't wait to celebrate with you!
          </p>
        </div>

        <div className="timeline-track" ref={trackRef}>
          <div
            className={`timeline-line ${isVisible ? 'is-visible' : ''}`}
            ref={lineRef}
            style={{ top: `${lineTop}px`, '--line-height': `${lineHeight}px` }}
          ></div>
          {timelineEvents.map((event, index) => (
            <TimelineRow 
              key={index} 
              leftItem={index % 2 === 0 ? event : null} 
              rightItem={index % 2 !== 0 ? event : null} 
              isVisible={isVisible} 
              index={index} 
            />
          ))}
        </div>

        <div className="timeline-footer">
          <span className="timeline-heart-small">♡</span> CAN'T WAIT TO CELEBRATE WITH YOU!
        </div>

        {/* Decorative Flower on the side */}
        <img src={imgFlowertime} alt="decorative flower" className="timeline-flower-side" />
      </div>
    </section>
  );
};

export default Timeline;
