import React, { useEffect, useRef, useState } from 'react';
import './Timeline.css';

// Import icons (assuming 1 to 12 map to these, we will adjust if they are mixed up)
import iconChurch from './assets/timeline/1.png';
import iconChampagne from './assets/timeline/2.png';
import iconCamera from './assets/timeline/3.png';
import iconCar from './assets/timeline/4.png';
import iconVenue from './assets/timeline/5.png';
import iconCoffee from './assets/timeline/6.png';
import iconPeople from './assets/timeline/7.png';
import iconPizza from './assets/timeline/8.png';
import iconCloche from './assets/timeline/9.png';
import iconCake from './assets/timeline/10.png';
import iconMusic from './assets/timeline/11.png';
import iconDisco from './assets/timeline/12.png';

const timelineEvents = [
  { time: '12:30 PM', title: 'CEREMONY / MASS', desc: 'Villa Maria,\nSt. Francis Church, Mosta', icon: iconChurch },
  { time: '1:30 PM', title: 'SIGNING / PHOTOS / CHAMPAGNE', desc: '', icon: iconChampagne },
  { time: '1:30 PM', title: 'PHOTOSESSION', desc: 'After Mass Travelling', icon: iconCamera },
  { time: '2:00 PM', title: 'TRAVELLING TO VENUE', desc: '', icon: iconCar },
  { time: '2:35 PM', title: 'VENUE ARRIVAL', desc: 'Villa Maria', icon: iconVenue },
  { time: '2:35 PM', title: 'WELCOME DRINK\n+ FAMILY PHOTOS', desc: '', icon: iconChampagne },
  { time: '3:00 PM', title: 'COUPLE PHOTOS', desc: '', icon: iconCamera },
  { time: '3:10 PM', title: 'COUPLE BREAK', desc: '', icon: iconCoffee },
  { time: '3:10 PM', title: 'COUPLE GREETING GUESTS', desc: '', icon: iconPeople },
  { time: '4:30 PM', title: 'BUFFET STATIONS\nPIZZA', desc: '', icon: iconPizza },
  { time: '5:15 PM', title: 'SPEECHES', desc: '', icon: iconCloche },
  { time: '7:30 PM', title: 'CUTTING OF CAKE', desc: '', icon: iconCake },
  { time: '7:30 PM', title: 'FIRST DANCE', desc: '', icon: iconMusic },
  { time: '9:30 PM', title: 'AFTER PARTY', desc: '', icon: iconDisco },
  { time: '9:30 PM', title: 'GOING AWAY', desc: '', icon: iconCar },
];

const TimelineItem = ({ item, index }) => {
  const isLeft = index % 2 === 0;
  const itemRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );
    if (itemRef.current) observer.observe(itemRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`timeline-item ${isLeft ? 'left' : 'right'} ${isVisible ? 'is-visible' : ''}`} ref={itemRef}>
      <div className="timeline-content">
        <div className="timeline-icon">
          <img src={item.icon} alt="event icon" />
        </div>
        <div className="timeline-text">
          <div className="timeline-time">{item.time}</div>
          <div className="timeline-title">{item.title}</div>
          {item.desc && <div className="timeline-desc">{item.desc}</div>}
        </div>
      </div>
      <div className="timeline-dot"></div>
    </div>
  );
};

const Timeline = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

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

  return (
    <section className="timeline-section" ref={sectionRef}>
      
      {/* Background scenery replacement (color gradient) */}
      <div className="timeline-bg"></div>

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

        <div className="timeline-track">
          {timelineEvents.map((item, index) => (
            <TimelineItem key={index} item={item} index={index} />
          ))}
        </div>

        <div className="timeline-footer">
          <span className="timeline-heart-small">♡</span> CAN'T WAIT TO CELEBRATE WITH YOU!
        </div>
      </div>
    </section>
  );
};

export default Timeline;
