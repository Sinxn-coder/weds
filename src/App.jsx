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

    const fps = isMobile ? 38 : 32;
    const frameDuration = 1000 / fps;
    let lastDrawTime = 0;
    let currentLogicalFrame = 0;
    let animationFrameId;

    const render = (time) => {
      if (currentLogicalFrame >= images.length) {
        setTimeout(() => setAnimationFinished(true), 1500);
        return;
      }

      if (time - lastDrawTime >= frameDuration) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const activeImage = images[currentLogicalFrame];
        
        if (activeImage) {
          let alpha = 1;
          // The user wants to start fading at ezgif-frame-054 (which is index 53) on mobile
          if (isMobile && currentLogicalFrame >= 53) {
            const fadeStartFrame = 53;
            const fadeFrames = images.length - 1 - fadeStartFrame;
            if (fadeFrames > 0) {
              alpha = 1 - (currentLogicalFrame - fadeStartFrame) / fadeFrames;
              if (alpha < 0) alpha = 0;
            }
          } else if (!isMobile && currentLogicalFrame >= 127) {
            // On desktop, user wants fading to start at ezgif-frame-128 (index 127)
            const fadeStartFrame = 127;
            const fadeFrames = images.length - 1 - fadeStartFrame;
            if (fadeFrames > 0) {
              alpha = 1 - (currentLogicalFrame - fadeStartFrame) / fadeFrames;
              if (alpha < 0) alpha = 0;
            }
          }
          ctx.globalAlpha = alpha;
          ctx.drawImage(activeImage, 0, 0, canvas.width, canvas.height);
          ctx.globalAlpha = 1; // reset alpha for next draw
        }

        currentLogicalFrame++;
        lastDrawTime = time;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isLoaded, images, isPlaying]);

  // On mobile: trigger polaroids after the canvas fades out
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
          <p>Unfolding our love story... {Math.round((loadedFrames / frames.length) * 100)}%</p>
        </div>
      )}

      <canvas
        ref={canvasRef}
        className="opening-canvas"
        style={{ 
          display: isLoaded ? 'block' : 'none',
          zIndex: 20,
          pointerEvents: 'none'
        }}
      />

      {isLoaded && !isPlaying && (
        <div className="play-button-overlay" onClick={() => {
          setIsPlaying(true);
          setIsFading(true);
        }}>
          <img src={buttonImg} alt="Play Button" className="play-button-img" />
        </div>
      )}

      {/* Content page expands via heart mask over the canvas */}
      <div className={`after-animation-screen ${isFading ? 'visible' : ''}`}>
        

        <div className="frame-container">
          <img src={img1} alt="Image 1" className="frame-inner-image" />
          <img
            ref={invitedRef}
            src={invited}
            alt="Invited"
            className={`invited-image ${invitedVisible ? 'invited-visible' : ''}`}
          />
          <img src={frameOne} alt="Frame One" className="frame-one-image" />
          <img src={buttonImg} alt="Wax Seal" className="frame-seal-image" />
          
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
