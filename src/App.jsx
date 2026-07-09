import React, { useState, useEffect, useRef } from 'react';
import frameOne from './assets/frame1.webp';
import mainFlower from './assets/mainflower.webp';
import img1 from './assets/img1.webp';
import invited from './assets/invited.webp';
import img2 from './assets/img2.webp';
import img3 from './assets/img3.webp';
import buttonImg from './assets/button.webp'; // Added button image
import Countdown from './Countdown';
import Details from './Details';
import Reception from './Reception';
import Gift from './Gift';
import Rsvp from './Rsvp';
import './App.css';

// Pre-import both desktop and mobile frame sets
const desktopModules = import.meta.glob('./assets/opening/*.webp', { eager: true });
const mobileModules = import.meta.glob('./assets/openingmobile/*.webp', { eager: true });

const desktopFrames = Object.keys(desktopModules).sort().map((key) => desktopModules[key].default);
const mobileFrames = Object.keys(mobileModules).sort().map((key) => mobileModules[key].default);

// Detect mobile once at module level — avoids re-renders changing the frame set mid-load
const isMobile = window.matchMedia('(max-width: 768px)').matches;

const HangingLantern = ({ className, length = 200, delay = "0s", duration = "4s" }) => (
  <svg className={className} style={{ animationDelay: delay, animationDuration: duration }} width="80" height={length} viewBox={`0 0 80 ${length}`} fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="40" y1="0" x2="40" y2={length - 80} stroke="#d4af37" strokeWidth="1.5" />
    <circle cx="40" cy={length - 170 > 0 ? length - 170 : 0} r="2" fill="#d4af37" />
    <circle cx="40" cy={length - 140 > 0 ? length - 140 : 0} r="2" fill="#d4af37" />
    <circle cx="40" cy={length - 110 > 0 ? length - 110 : 0} r="2" fill="#d4af37" />
    
    <path d={`M25 ${length - 80} Q40 ${length - 95} 55 ${length - 80}`} stroke="#d4af37" strokeWidth="2" fill="none" />
    <path d={`M30 ${length - 80} L50 ${length - 80} L45 ${length - 75} L35 ${length - 75} Z`} fill="#d4af37" />
    
    <path d={`M40 ${length - 72} C55 ${length - 60}, 65 ${length - 30}, 40 ${length - 10} C15 ${length - 30}, 25 ${length - 60}, 40 ${length - 72} Z`} stroke="#d4af37" strokeWidth="2" fill="transparent" />
    <path d={`M40 ${length - 60} L48 ${length - 40} L40 ${length - 20} L32 ${length - 40} Z`} fill="#d4af37" />
    <circle cx="40" cy={length - 40} r="3" fill="#f6ebdf" />
    
    <line x1="40" y1={length - 8} x2="40" y2={length} stroke="#d4af37" strokeWidth="1.5" />
    <circle cx="40" cy={length} r="1.5" fill="#d4af37" />
  </svg>
);

const HangingDiamond = ({ className, length = 150, delay = "0s", duration = "3.5s" }) => (
  <svg className={className} style={{ animationDelay: delay, animationDuration: duration }} width="60" height={length} viewBox={`0 0 60 ${length}`} fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="30" y1="0" x2="30" y2={length - 60} stroke="#d4af37" strokeWidth="1" strokeDasharray="4 4" />
    <path d={`M30 ${length - 60} L45 ${length - 30} L30 ${length} L15 ${length - 30} Z`} stroke="#d4af37" strokeWidth="1.5" fill="none" />
    <path d={`M30 ${length - 50} L40 ${length - 30} L30 ${length - 10} L20 ${length - 30} Z`} fill="#d4af37" />
  </svg>
);

const HangingSparkle = ({ className, length = 120, delay = "0s", duration = "3s" }) => (
  <svg className={className} style={{ animationDelay: delay, animationDuration: duration }} width="40" height={length} viewBox={`0 0 40 ${length}`} fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="20" y1="0" x2="20" y2={length - 20} stroke="#d4af37" strokeWidth="1" />
    <path d={`M20 ${length - 20} Q20 ${length - 10} 30 ${length - 10} Q20 ${length - 10} 20 ${length} Q20 ${length - 10} 10 ${length - 10} Q20 ${length - 10} 20 ${length - 20}`} fill="#d4af37" />
  </svg>
);

export default function App() {
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);
  const [loadedFrames, setLoadedFrames] = useState(0);
  const [animationFinished, setAnimationFinished] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [polaroidsVisible, setPolaroidsVisible] = useState(false);
  const [invitedVisible, setInvitedVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const invitedRef = useRef(null);

  // Pick the right frame set based on the device
  const frames = isMobile ? mobileFrames : desktopFrames;

  // Preload all frames as Image objects for instant canvas rendering
  useEffect(() => {
    if (frames.length === 0) return;

    let loaded = 0;
    const preloadedImages = new Array(frames.length);

    frames.forEach((src, index) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loaded++;
        setLoadedFrames(loaded);
      };
      img.onerror = () => {
        loaded++;
        setLoadedFrames(loaded);
      };
      preloadedImages[index] = img;
    });

    setImages(preloadedImages);
  }, []);

  const isLoaded = frames.length > 0 && loadedFrames === frames.length;

  // Canvas-based requestAnimationFrame player for maximum smoothness
  useEffect(() => {
    if (!isLoaded || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (images[0]) {
      canvas.width = images[0].naturalWidth || (isMobile ? 720 : 1920);
      canvas.height = images[0].naturalHeight || (isMobile ? 1280 : 1080);
    }

    if (!isPlaying) {
      // Draw first frame and wait for user to click a play button
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (images[0]) {
        ctx.drawImage(images[0], 0, 0, canvas.width, canvas.height);
      }
      return;
    }

    let startTime = null;
    const fps = isMobile ? 38 : 32;
    const frameDuration = 1000 / fps;
    let animationFrameId;

    const render = (time) => {
      if (!startTime) startTime = time;

      const elapsed = time - startTime;
      const currentLogicalFrame = Math.floor(elapsed / frameDuration);

      if (currentLogicalFrame >= images.length) {
        // Start fade-out first, then reveal content after transition completes
        setIsFading(true);
        setTimeout(() => setAnimationFinished(true), 1500);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const activeImage = images[currentLogicalFrame];
      if (activeImage) {
        ctx.drawImage(activeImage, 0, 0, canvas.width, canvas.height);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isLoaded, images, isPlaying]);

  // On mobile: trigger polaroids after the frame slides in (1.75s)
  // On desktop: handled by IntersectionObserver below
  useEffect(() => {
    if (!isFading) return;
    if (isMobile) {
      // Wait for the heart wipe (1.5s) + frame slide (0.75s delay + 1s) = ~1.75s after fading starts
      const timer = setTimeout(() => setPolaroidsVisible(true), 1750);
      return () => clearTimeout(timer);
    }
  }, [isFading]);

  // Desktop only: IntersectionObserver for the invited image scroll animation
  useEffect(() => {
    if (isMobile) return; // Skip on mobile — CSS handles it
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInvitedVisible(true);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.15 
      }
    );
    if (invitedRef.current) observer.observe(invitedRef.current);
    return () => observer.disconnect();
  }, []);

  // Desktop only: IntersectionObserver for the polaroids scroll animation
  const polaroidsRef = useRef(null);
  useEffect(() => {
    if (isMobile) return; // Skip on mobile — handled by timer above
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPolaroidsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (polaroidsRef.current) observer.observe(polaroidsRef.current);
    return () => observer.disconnect();
  }, []);

  if (frames.length === 0) {
    return <div className="loading-screen">No frames found.</div>;
  }

  return (
    <div className="wrapper">
      {!isLoaded && (
        <div className="loading-screen">
          <div className="loader"></div>
          <p>Preparing Assets... {Math.round((loadedFrames / frames.length) * 100)}%</p>
        </div>
      )}

      <canvas
        ref={canvasRef}
        className="opening-canvas"
        style={{ display: isLoaded ? 'block' : 'none' }}
      />

      {isLoaded && !isPlaying && (
        <div className="play-button-overlay" onClick={() => setIsPlaying(true)}>
          <img src={buttonImg} alt="Play Button" className="play-button-img" />
          <p className="play-button-text">Open Invitation</p>
        </div>
      )}

      {/* Content page expands via heart mask over the canvas */}
      <div className={`after-animation-screen ${isFading ? 'visible' : ''}`}>
        
        {/* Rich Array of Animated Hanging Decor */}
        <HangingLantern className="hanging-decor hanging-pos-1" length={220} delay="0s" duration="4.5s" />
        <HangingSparkle className="hanging-decor hanging-pos-2" length={140} delay="-1s" duration="3.2s" />
        <HangingDiamond className="hanging-decor hanging-pos-3" length={170} delay="-2.5s" duration="3.8s" />
        
        {/* Shorter sparkles near the center arch */}
        <HangingSparkle className="hanging-decor hanging-pos-4" length={90} delay="-0.5s" duration="2.9s" />
        <HangingSparkle className="hanging-decor hanging-pos-5" length={100} delay="-1.5s" duration="3.1s" />

        <HangingDiamond className="hanging-decor hanging-pos-6" length={180} delay="-1.2s" duration="4.1s" />
        <HangingSparkle className="hanging-decor hanging-pos-7" length={130} delay="-0.8s" duration="3.4s" />
        <HangingLantern className="hanging-decor hanging-pos-8" length={240} delay="-2s" duration="4.8s" />

        <div className="frame-container">
          <img src={img1} alt="Image 1" className="frame-inner-image" />
          <img
            ref={invitedRef}
            src={invited}
            alt="Invited"
            className={`invited-image ${invitedVisible ? 'invited-visible' : ''}`}
          />
          <img src={frameOne} alt="Frame One" className="frame-one-image" />
          
          <div ref={polaroidsRef} className={`side-photos-container ${polaroidsVisible ? 'is-visible' : ''}`}>
            <div className="polaroid polaroid-1">
              <img src={img2} alt="Couple Photo 1" />
            </div>
            <div className="polaroid polaroid-2">
              <img src={img3} alt="Couple Photo 2" />
            </div>
          </div>

          <img src={mainFlower} alt="Main Flower" className="main-flower-image" />
        </div>
        
        {/* Countdown Section */}
        <Countdown targetDate="2026-10-11T12:30:00" />
      
        {/* Details Section */}
        <Details />

        {/* Reception Video Section */}
        <Reception />

        {/* RSVP Section */}
        <Rsvp />

        {/* Gift / Contribution Section */}
        <Gift />

      </div>
    </div>
  );
}
