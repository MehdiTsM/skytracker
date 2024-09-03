// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import 'animate.css';
import { ThemeProvider, useTheme } from './ThemeContext';
import Home from './pages/Home';
import Map from './pages/Map'; // Make sure this path is correct
import Settings from './pages/Settings'; // Make sure this path is correct
import Header from './components/Header';
import Loading from './components/Loading'; // Import the Loading component
import AirQuality from './pages/AirQuality';

function App() {
  const [loading, setLoading] = useState(false);

  return (
    <ThemeProvider>
      <Router>
        <RoutesWrapper setLoading={setLoading} />
        <ThemeWrapper>
          <div className="min-h-screen flex flex-col">
            {loading && <Loading />}
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/map" element={<Map />} />
                <Route path="/air-quality" element={<AirQuality />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </main>
          </div>
        </ThemeWrapper>
      </Router>
    </ThemeProvider>
  );
}

// Component to manage location changes
function RoutesWrapper({ setLoading }) {
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [location]);

  return null;
}

// Wrapper to apply theme class based on current theme
function ThemeWrapper({ children }) {
  const { theme } = useTheme();
  const themeClass = theme === 'Dark' ? 'bg-gradient-to-r from-customColor2 via-gray-700 to-customColor2 text-customColor4' : 'bg-gradient-to-r from-customLightBackground via-customLightAccent to-customLightBackground text-customLightText';

  return <div className={themeClass}>{children}</div>;
}

export default App;
