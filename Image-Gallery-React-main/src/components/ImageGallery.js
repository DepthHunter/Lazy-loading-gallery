import React, { useState, useEffect, useRef } from 'react';
import './style.css';

function LazyImage({ src, alt, fullSrc, startTime }) {
  const [isVisible, setIsVisible] = useState(false);
  const [loadTime, setLoadTime] = useState(0);
  const imageRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      });
    });

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current);
      }
    };
  }, []);

  const handleLoad = () => {
    const endTime = performance.now();
    const imageLoadTime = endTime - startTime; 
    setLoadTime(imageLoadTime);
  };

  const handleClick = () => {
    window.open(fullSrc, '_blank');
  };

  return (
    <div style={{ position: 'relative' }}>
      <img
        ref={imageRef}
        src={isVisible ? src : ''}
        alt={alt}
        onClick={handleClick}
        onLoad={handleLoad}
        style={{ cursor: 'pointer' }}
      />
      <div style={{ position: 'absolute', bottom: 0, right: 0, background: 'rgba(255, 255, 255, 0.8)', padding: '2px 5px' }}>
        {loadTime > 0 && `Load Time: ${loadTime.toFixed(2)} ms`}
      </div>
    </div>
  );
}

function App() {
  const [images, setImages] = useState([]);
  const [pageLoadTime, setPageLoadTime] = useState(0);
  const [resourceTimings, setResourceTimings] = useState([]);

  useEffect(() => {
    fetchImages();
    trackPageLoadTime();
    trackResourceTimings();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch('https://api.unsplash.com/photos/?client_id=awxnmpp6zt5vfYsGbZmiDxxcTEy1T5FSFvTjyKNc2v4&per_page=18');
      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const trackPageLoadTime = () => {
    const pageLoadStartTime = performance.timing.navigationStart;
    const pageLoadEndTime = performance.now();
    setPageLoadTime(pageLoadEndTime - pageLoadStartTime);
  };

  const trackResourceTimings = () => {
    const resources = performance.getEntriesByType('resource');
    setResourceTimings(resources);
  };

  return (
    <div className="App">
      <PerformanceAnalysis pageLoadTime={pageLoadTime} resourceTimings={resourceTimings} />
      <div className="image-gallery">
        {Array.isArray(images) && images.map(image => (
          <LazyImage
            key={image.id}
            src={image.urls.thumb}
            alt={image.alt_description}
            fullSrc={image.urls.full}
            startTime={performance.now()} 
          />
        ))}
      </div>
    </div>
  );
}

function PerformanceAnalysis({ pageLoadTime, resourceTimings }) {
  return (
    <div className="performance-analysis">
      <h3>Время загрузки ресурсов сайта</h3>
      <p>Время загрузки страницы: {pageLoadTime.toFixed(2)} ms</p>
      <ul>
        {resourceTimings.map((resource, index) => (
          <li key={index}>
            {resource.name} - Время загрузки: {resource.duration.toFixed(2)} ms
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
