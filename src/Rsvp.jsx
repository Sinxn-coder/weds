import React, { useState, useRef, useEffect } from 'react';
import './Rsvp.css';
import buttonImg from './assets/button.webp';
import calendarIcon from './assets/calendar-icon.svg';

const SliderButton = ({ defaultText, successText, onComplete, buttonImg, textColor, successColor, onResetTimeout }) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const containerRef = useRef(null);
  const thumbRef = useRef(null);

  const handleDragStart = (e) => {
    if (isUnlocked) return;
    setIsDragging(true);
  };

  const handleDragMove = (e) => {
    if (!isDragging || isUnlocked) return;
    
    // Support both mouse and touch events
    const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    
    if (containerRef.current && thumbRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const thumbWidth = thumbRef.current.getBoundingClientRect().width;
      
      const maxSlide = containerRect.width - thumbWidth;
      let newPosition = clientX - containerRect.left - (thumbWidth / 2);
      
      // Constrain movement
      newPosition = Math.max(0, Math.min(newPosition, maxSlide));
      setSliderPosition(newPosition);
      
      // If reached the end
      if (newPosition >= maxSlide * 0.95) { 
        setIsUnlocked(true);
        setSliderPosition(maxSlide);
        setIsDragging(false);
        
        setTimeout(() => {
          onComplete();
          if (onResetTimeout) {
            setTimeout(() => {
              setIsUnlocked(false);
              setSliderPosition(0);
            }, onResetTimeout);
          }
        }, 500);
      }
    }
  };

  const handleDragEnd = () => {
    if (isUnlocked) return;
    setIsDragging(false);
    // Snap back if not fully slid
    setSliderPosition(0);
  };

  useEffect(() => {
    // Add passive: false to touchmove to prevent screen scrolling while sliding
    const handleTouchMove = (e) => {
      if (isDragging) e.preventDefault();
      handleDragMove(e);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleDragEnd);
    } else {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleDragEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging, isUnlocked]); // Need dependencies to ensure latest state

  return (
    <div className="rsvp-slider-container" ref={containerRef}>
      <div 
        className="rsvp-slider-fill" 
        style={{ 
          width: sliderPosition > 0 ? `${sliderPosition + 40}px` : '0px',
          transition: isDragging ? 'none' : 'width 0.3s ease'
        }} 
      />
      <div 
        className="rsvp-slider-text"
        style={{
          position: 'absolute',
          right: !isUnlocked ? '30px' : 'auto',
          left: isUnlocked ? '25px' : 'auto',
          color: !isUnlocked ? textColor : successColor
        }}
      >
        {isUnlocked ? successText : defaultText}
      </div>
      <img 
        ref={thumbRef}
        src={buttonImg} 
        alt="Slider Thumb"
        className="rsvp-slider-thumb"
        style={{ 
          transform: `translateX(${sliderPosition}px)`, 
          transition: isDragging ? 'none' : 'transform 0.3s ease' 
        }}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
        draggable={false}
      />
    </div>
  );
};

const Rsvp = () => {
  const [isTextVisible, setIsTextVisible] = useState(false);
  const textContainerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsTextVisible(true);
        }
      },
      { threshold: 0.3 }
    );
    if (textContainerRef.current) observer.observe(textContainerRef.current);
    return () => {
      if (textContainerRef.current) observer.unobserve(textContainerRef.current);
    };
  }, []);

  const handleDownloadICS = (e) => {
    if (e) e.preventDefault();
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Jessica and David Wedding//EN
BEGIN:VEVENT
UID:${new Date().getTime()}@jessicaanddavid.com
DTSTAMP:20261011T103000Z
DTSTART:20261011T103000Z
DTEND:20261011T200000Z
SUMMARY:Jessica & David's Wedding
DESCRIPTION:We can't wait to celebrate with you!
LOCATION:KNISJA TAT-TWELID TAL-VERG'NI MARIJA, MTAĦLEB
END:VEVENT
END:VCALENDAR`;
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'jessica-david-wedding.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCalendarOpen = () => {
    const isApple = /iPad|iPhone|iPod|Macintosh|MacIntel|MacPPC|Mac68K/.test(navigator.userAgent);
    if (isApple) {
      handleDownloadICS();
    } else {
      window.open("https://calendar.google.com/calendar/render?action=TEMPLATE&text=Jessica+%26+David's+Wedding&dates=20261011T103000Z/20261011T200000Z&details=We+can't+wait+to+celebrate+with+you!&location=KNISJA+TAT-TWELID+TAL-VERG'NI+MARIJA,+MTAĦLEB", "_blank");
    }
  };

  return (
    <section className="rsvp-section">
      <div className={`rsvp-content ${isTextVisible ? 'is-visible' : ''}`} ref={textContainerRef}>
        <h2 className="rsvp-title">Kindly Rsvp</h2>
        <h3 className="rsvp-date">BY AUGUST 31, 2026</h3>
        <p className="rsvp-text">Please let us know if you'll be able to join us on our special day.</p>
        
        <div className="sliders-wrapper">
          <SliderButton 
            defaultText="Slide to RSVP" 
            successText="RSVP Confirmed!" 
            onComplete={() => window.location.href = 'https://forms.gle/ZiFMAbFkizhUk3xF9'} 
            buttonImg={buttonImg} 
            textColor="#d4af37" 
            successColor="#562124" 
          />
          
          <SliderButton 
            defaultText="Save to Calendar" 
            successText="Saved to Calendar!" 
            onComplete={handleCalendarOpen} 
            onResetTimeout={3000}
            buttonImg={calendarIcon} 
            textColor="#d4af37" 
            successColor="#562124" 
          />
        </div>

      </div>
    </section>
  );
};

export default Rsvp;
