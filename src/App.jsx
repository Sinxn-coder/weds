import React, { useState, useEffect, useRef } from 'react';
import openingVideo from './assets/opening/vid.mp4';
import openingVideoMobile from './assets/openingmobile/Create_a_second_×_1.mp4';
import posterImg from './assets/openingmobile/img.webp';
import posterImgDesktop from './assets/opening/img.webp';
import frameOne from './assets/frame1.webp';
import mainFlower from './assets/mainflower.webp';
import img1 from './assets/img1.webp';
import imgLoading from './assets/loading.gif';
import invited from './assets/invited.webp';
import img2 from './assets/img2.webp';
import img3 from './assets/img3.webp';
import buttonImg from './assets/button.webp'; 
import Countdown from './Countdown';
import Details from './Details';
import Reception from './Reception';
import Gift from './Gift';
import Rsvp from './Rsvp';
import Timeline from './Timeline';
import DressCode from './DressCode';
import './App.css';

const isMobile = window.matchMedia('(max-width: 768px)').matches;

export default function App() {
  const videoRef = useRef(null);
  const [animationFinished, setAnimationFinished] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [polaroidsVisible, setPolaroidsVisible] = useState(false);
  const [invitedVisible, setInvitedVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const invitedRef = useRef(null);

  // On mobile: trigger polaroids after the video starts fading
  useEffect(() => {
    if (!isFading) return;
    if (isMobile) {
      const timer = setTimeout(() => setPolaroidsVisible(true), 1750);
      return () => clearTimeout(timer);
    }
  }, [isFading]);

  // Desktop only: IntersectionObserver for the invited image
  useEffect(() => {
    if (isMobile) return; 
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInvitedVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (invitedRef.current) observer.observe(invitedRef.current);
    return () => observer.disconnect();
  }, []);

  // Desktop only: IntersectionObserver for the polaroids
  const polaroidsRef = useRef(null);
  useEffect(() => {
    if (isMobile) return; 
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

  // Lock scroll while the opening animation is active
  useEffect(() => {
    if (!animationFinished) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [animationFinished]);

  return (
    <div className="wrapper">
      
      {/* Opening Video */}
      <video
        ref={videoRef}
        src={isMobile ? openingVideoMobile : openingVideo}
        className="opening-canvas" 
        playsInline
        muted
        style={{ 
          display: animationFinished ? 'none' : 'block',
          backgroundColor: '#562124',
          objectFit: 'cover',
          width: '100vw',
          height: '100dvh',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 20,
          pointerEvents: isPlaying ? 'none' : 'auto',
          cursor: isPlaying ? 'default' : 'pointer',
          opacity: isFading ? 0 : 1,
          transition: 'opacity 1.5s ease-in-out'
        }}
        onClick={() => {
          if (!isPlaying) {
            setIsPlaying(true);
            if (videoRef.current) {
              videoRef.current.play();
            }
          }
        }}
        onEnded={() => setAnimationFinished(true)}
        onTimeUpdate={(e) => {
          const duration = e.target.duration;
          const currentTime = e.target.currentTime;
          
          if (duration && !isFading) {
            if (isMobile) {
              // Start the content fade-in 1.5 seconds before the video ends
              if (duration - currentTime < 1.5) {
                setIsFading(true);
              }
            } else {
              // Desktop: start fade out from the halfway mark of the video
              if (currentTime >= duration / 2) {
                setIsFading(true);
              }
            }
          }
        }}
      />

      {/* Manual Poster Overlay for smooth transition (mobile only) */}
      {isMobile && !animationFinished && (
        <img 
          src={isMobile ? posterImg : posterImgDesktop} 
          alt="Opening" 
          style={{
            position: 'fixed',
            top: 0, 
            left: 0,
            width: '100vw', 
            height: '100dvh',
            objectFit: 'cover',
            zIndex: 30, /* Increased to catch clicks over the video */
            opacity: isPlaying ? 0 : 1,
            transition: 'opacity 0.5s ease-out',
            pointerEvents: isPlaying ? 'none' : 'auto',
            cursor: isPlaying ? 'default' : 'pointer'
          }}
          onClick={() => {
            if (!isPlaying) {
              setIsPlaying(true);
              if (videoRef.current) {
                videoRef.current.play();
              }
            }
          }}
        />
      )}



      {/* Content page expands via heart mask */}
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
        
        <Countdown targetDate="2026-10-11T12:30:00" />
        <Details />
        <Reception />
        <Rsvp />
        <Timeline />
        <DressCode />
        <Gift />

      </div>
    </div>
  );
}
