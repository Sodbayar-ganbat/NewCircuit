import React, { useState, useRef, useEffect } from "react";
import SearchBar from "./SearchBar";
import Map from "./Map";
import styles from './MapPage.module.css';
import MapHeroSection from "./MapHeroSection";
import SlidingBar from '../SlidingBar';

const cities = [
  { name: "Atlanta", state: "Georgia", position: [33.749, -84.388] },
  { name: "Chicago", state: "Illinois", position: [41.8781, -87.6298] },
  { name: "Dallas", state: "Texas", position: [32.7767, -96.797] },
  { name: "Houston", state: "Texas", position: [29.7604, -95.3698] },
  { name: "Los Angeles", state: "California", position: [34.0522, -118.2437] },
  { name: "Miami", state: "Florida", position: [25.7617, -80.1918] },
  { name: "New York City", state: "New York", position: [40.7128, -74.006] },
  {
    name: "San Francisco",
    state: "California",
    position: [37.7749, -122.4194],
  },
  { name: "Seattle", state: "Washington", position: [47.6062, -122.3321] },
  {
    name: "Washington D.C.",
    state: "District of Columbia",
    position: [38.9072, -77.0369],
  },
];

const MapPage = () => {
  const [filter, setFilter] = useState("");
  const marqueeContainerRef = useRef(null);
  const marqueeContentRef = useRef(null);
  const [repeatCount, setRepeatCount] = useState(2);

  const handleSearch = (query) => {
    setFilter(query);
  };

  // Dynamically calculate how many times to repeat the content
  useEffect(() => {
    function updateRepeatCount() {
      if (!marqueeContainerRef.current || !marqueeContentRef.current) return;
      const containerWidth = marqueeContainerRef.current.offsetWidth;
      const contentWidth = marqueeContentRef.current.offsetWidth;
      if (contentWidth === 0) return;
      // Ensure at least 2x container width for seamless looping
      const minWidth = containerWidth * 2;
      const count = Math.ceil(minWidth / contentWidth) + 1;
      setRepeatCount(count);
    }
    updateRepeatCount();
    window.addEventListener('resize', updateRepeatCount);
    return () => window.removeEventListener('resize', updateRepeatCount);
  }, []);

  const marqueePhrase = (
    <span className={styles.mapBarText}>
      Pick your city and get started <span role="img" aria-label="location pin">📍</span>
    </span>
  );

  // Render the phrase once for measurement, then repeat as needed
  return (
    <div className={styles.mapBackground}>
      <MapHeroSection />
      <SlidingBar 
        phrase={
          <span className={styles.mapBarText}>
            Pick your city and get started <span role="img" aria-label="location pin">📍</span>
          </span>
        }
        background="#1C50D8"
        textColor="#FAFFE7"
        heartColor="#FAFFE7"
      />
      <div style={{ position: "relative", width: "100%" }}>
      <Map cities={cities} filter={filter} />
      <div
        style={{
          position: "absolute",
            top: "0px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
        }}
      >
        <SearchBar cities={cities} onSearch={handleSearch} />
        </div>
      </div>
    </div>
  );
};

export default MapPage;
