import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-page">
      <div className="hero">
        <h1>Recycle E-Waste, Save the Planet</h1>
        <p>Find nearest drop-off bins in seconds</p>
        <Link to="/locator" className="cta-btn">FIND BIN NOW</Link>
      </div>
    </div>
  );
};

export default Home;