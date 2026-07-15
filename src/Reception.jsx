import React, { useRef, useState, useEffect } from 'react';
import './Reception.css';
import bgvideo from './assets/bgvideo.mp4';
import mobilebgvideo from './assets/mobilebgvideo.mp4';

const Reception = () => {
  const videoRef = useRef(null);
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const textRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Force play with retries — needed for iOS which can block autoplay
  const forcePlay = (video) => {
    if (!video) return;
    video.muted = true;
    video.playbackRate = 1.2;
    const p = video.play();
    if (p !== undefined) {
      p.catch(() => {
        // Retry once after a short delay (iOS sometimes needs a nudge)
        setTimeout(() => {
          video.play().catch(() => {});
        }, 300);
      });
    }
  };

  // Play/pause based on visibility to save battery
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const video = videoRef.current;
        if (entries[0].isIntersecting) {
          forcePlay(video);
        } else {
          if (video) video.pause();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Also try to play on first user interaction (iOS unlock)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.playbackRate = 1.2;
    const handleInteraction = () => {
      forcePlay(video);
    };
    document.addEventListener('touchstart', handleInteraction, { once: true });
    document.addEventListener('click', handleInteraction, { once: true });
    return () => {
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('click', handleInteraction);
    };
  }, []);

  // Fade in text on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setIsVisible(true);
      },
      { threshold: 0.3 }
    );
    if (textRef.current) observer.observe(textRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="reception-section" ref={sectionRef}>
      <video
        ref={videoRef}
        className="reception-video"
        autoPlay
        muted
        loop
        playsInline
        disablePictureInPicture
        disableRemotePlayback
        preload="auto"
        onCanPlay={() => forcePlay(videoRef.current)}
      >
        <source src={isMobile ? mobilebgvideo : bgvideo} type="video/mp4" />
      </video>

      <div className="reception-content" ref={textRef}>
        <h2 className={`reception-title ${isVisible ? 'is-visible' : ''}`}>
          Reception: Villa Mdina,<br />
          Naxxar
        </h2>
      </div>
    </section>
  );
};

export default Reception;
