import React, { useRef, useState, useEffect } from 'react';
import './Reception.css';
import bgvideo from './assets/bgvideo.mp4';

const Reception = () => {
  const video1Ref = useRef(null);
  const video2Ref = useRef(null);
  const sectionRef = useRef(null);
  const [activeVideo, setActiveVideo] = useState(1);

  // Slow down video playback
  useEffect(() => {
    if (video1Ref.current) video1Ref.current.playbackRate = 0.6;
    if (video2Ref.current) video2Ref.current.playbackRate = 0.6;
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Force play when section comes into view
          const currentVideo = activeVideo === 1 ? video1Ref.current : video2Ref.current;
          if (currentVideo) {
            currentVideo.play().catch(e => console.log("Autoplay prevented:", e));
          }
        } else {
          // Pause when out of view to save battery/resources
          if (video1Ref.current) video1Ref.current.pause();
          if (video2Ref.current) video2Ref.current.pause();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, [activeVideo]);

  const handleTimeUpdate = (e, videoNumber) => {
    const video = e.target;
    if (!video.duration) return;
    
    const timeLeft = video.duration - video.currentTime;
    
    // Crossfade 1.5 seconds before the video ends to hide the jump cut
    if (timeLeft <= 1.5) {
      if (videoNumber === 1 && activeVideo === 1) {
        if (video2Ref.current) {
          video2Ref.current.currentTime = 0;
          video2Ref.current.play().catch(e => console.log(e));
        }
        setActiveVideo(2);
      } else if (videoNumber === 2 && activeVideo === 2) {
        if (video1Ref.current) {
          video1Ref.current.currentTime = 0;
          video1Ref.current.play().catch(e => console.log(e));
        }
        setActiveVideo(1);
      }
    }
  };

  const [isVisible, setIsVisible] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (textRef.current) {
      observer.observe(textRef.current);
    }

    return () => {
      if (textRef.current) observer.unobserve(textRef.current);
    };
  }, []);

  return (
    <section className="reception-section" ref={sectionRef}>
      <video 
        ref={video1Ref}
        className={`reception-video ${activeVideo === 1 ? 'active' : ''}`} 
        autoPlay muted playsInline disablePictureInPicture controls={false}
        onTimeUpdate={(e) => handleTimeUpdate(e, 1)}
      >
        <source src={bgvideo} type="video/mp4" />
      </video>
      
      <video 
        ref={video2Ref}
        className={`reception-video ${activeVideo === 2 ? 'active' : ''}`} 
        muted playsInline disablePictureInPicture controls={false}
        onTimeUpdate={(e) => handleTimeUpdate(e, 2)}
      >
        <source src={bgvideo} type="video/mp4" />
      </video>

      <div className="reception-overlay"></div>
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
