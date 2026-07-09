import React, { useState, useEffect, useRef } from 'react';
import flower2 from './assets/flower2.webp';
import './Countdown.css';

/* Drum/cylinder counter — defined outside so state persists across ticks */
const RollingDigit = ({ digit }) => {
  const [current, setCurrent] = useState(digit);
  const [next, setNext] = useState(digit);
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    if (digit !== current && !spinning) {
      setNext(digit);
      setSpinning(true);
      const timer = setTimeout(() => {
        setCurrent(digit);
        setSpinning(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [digit]);

  return (
    <div className="drum-digit">
      {/* Current number rotating out (top of drum going away) */}
      <span className={`drum-face drum-top ${spinning ? 'spin-out' : ''}`}>
        {current}
      </span>
      {/* Next number rotating in (bottom of drum coming forward) */}
      {spinning && (
        <span className="drum-face drum-bottom spin-in">
          {next}
        </span>
      )}
    </div>
  );
};

const RollingNumber = ({ value }) => {
  const str = value.toString().padStart(2, '0');
  return (
    <div className="rolling-number">
      <RollingDigit digit={str[0]} />
      <RollingDigit digit={str[1]} />
    </div>
  );
};

const Countdown = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    if (difference > 0) {
      return {
        days:    Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours:   Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  };

  const topFlowerRef = useRef(null);
  const bottomFlowerRef = useRef(null);
  const monogramRef = useRef(null);
  
  const [isTopVisible, setIsTopVisible] = useState(false);
  const [isBottomVisible, setIsBottomVisible] = useState(false);
  const [isMonogramVisible, setIsMonogramVisible] = useState(false);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (entry.target.classList.contains('countdown-flower-right')) {
              setIsTopVisible(true);
            }
            if (entry.target.classList.contains('countdown-flower-left')) {
              setIsBottomVisible(true);
            }
            if (entry.target.classList.contains('monogram')) {
              setIsMonogramVisible(true);
            }
          }
        });
      },
      { threshold: 0 } // Fire as soon as any part of the layout box is in view
    );

    if (topFlowerRef.current) observer.observe(topFlowerRef.current);
    if (bottomFlowerRef.current) observer.observe(bottomFlowerRef.current);
    if (monogramRef.current) observer.observe(monogramRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="countdown-section">
      <img 
        ref={topFlowerRef}
        src={flower2} 
        alt="Flower decoration" 
        className={`countdown-flower-right ${isTopVisible ? 'is-visible' : ''}`} 
      />
      <img 
        ref={bottomFlowerRef}
        src={flower2} 
        alt="Flower decoration" 
        className={`countdown-flower-left ${isBottomVisible ? 'is-visible' : ''}`} 
      />
      <div ref={monogramRef} className={`monogram ${isMonogramVisible ? 'is-visible' : ''}`}>
        <span className="monogram-letter monogram-letter-j">J</span>
        <span className="monogram-ampersand">&</span>
        <span className="monogram-letter monogram-letter-a">A</span>
      </div>

      <div className="countdown-timer">
        <div className="countdown-item">
          <RollingNumber value={timeLeft.days} />
          <span className="countdown-label">Days</span>
        </div>
        <span className="countdown-separator">:</span>

        <div className="countdown-item">
          <RollingNumber value={timeLeft.hours} />
          <span className="countdown-label">Hours</span>
        </div>
        <span className="countdown-separator">:</span>

        <div className="countdown-item">
          <RollingNumber value={timeLeft.minutes} />
          <span className="countdown-label">Mins</span>
        </div>
        <span className="countdown-separator">:</span>

        <div className="countdown-item">
          <RollingNumber value={timeLeft.seconds} />
          <span className="countdown-label">Secs</span>
        </div>
      </div>
    </div>
  );
};

export default Countdown;
