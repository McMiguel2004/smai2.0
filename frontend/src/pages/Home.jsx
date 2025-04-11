import React, { useState } from 'react';
import "../styles/Home.css";
import HeroParallax from '../components/Home/HeroParallax';
import ServerTable from '../components/Home/ServerTable';
import FeaturesSection from '../components/Home/FeaturesSection';
import AdditionalContent from '../components/Home/AdditionalContent';

const Home = () => {
  const [isNightMode, setIsNightMode] = useState(false);

  const toggleTheme = () => {
    setIsNightMode(!isNightMode);
  };

  return (
    <div className="home-container">
      <HeroParallax isNightMode={isNightMode} toggleTheme={toggleTheme} />

      <section className="content-section white">
        <div className="content-wrapper">
          <h1 className="minecraft-font">
            Servidores de Minecraft.<br />
            Automatizados. Increíbles.
          </h1>
          <p className="margen-doble"></p>
          <ServerTable />
        </div>
      </section>

      <FeaturesSection />
      <AdditionalContent />
    </div>
  );
};

export default Home;
