import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loading from '../components/Loading';
import { useTranslation } from 'react-i18next'; // Import the useTranslation hook

function AirQuality() {
  const { t } = useTranslation(); // Initialize the translation hook
  const [airQuality, setAirQuality] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);

  const API_KEY = 'df1f4649ac868b38b6c825be463dcc44';

  useEffect(() => {
    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLat(position.coords.latitude);
            setLon(position.coords.longitude);
          },
          (error) => {
            console.error('Error getting location:', error);
            setError(t('Error getting location')); // Use translation
          }
        );
      } else {
        setError(t('Geolocation is not supported by this browser.')); // Use translation
      }
    };

    getCurrentLocation();
  }, [t]);

  useEffect(() => {
    if (lat && lon) {
      const fetchWeatherAndAirQuality = async () => {
        try {
          // Fetch weather data
          const weatherResponse = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          );

          // Fetch air quality data
          const airQualityResponse = await axios.get(
            `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
          );

          setWeather(weatherResponse.data);
          setAirQuality(airQualityResponse.data);
        } catch (err) {
          console.error('Error fetching data:', err);
          setError(t('Error fetching data')); // Use translation
        } finally {
          setLoading(false);
        }
      };

      fetchWeatherAndAirQuality();
    }
  }, [lat, lon, t]);

  if (loading) return <Loading />;
  if (error) return <p className="text-red-500 text-center mt-4">{error}</p>;

  const airQualityInfo = airQuality && airQuality.list[0];
  const weatherInfo = weather;
  const { main: airQualityMain, components, dt } = airQualityInfo || {};
  const { main: weatherMain, sys: weatherSys, name: cityName } = weatherInfo || {};

  // Get the country and city names
  const country = weatherSys?.country || 'Unknown';
  const city = cityName || 'Unknown';

  // Format the location string
  const locationString = `${city}, ${country}`;

  return (
    <div className="relative min-h-screen animate-fadeIn">
      <div className="absolute inset-0 min-h-screen bg-gradient-to-r from-customColor2 via-gray-700 to-customColor2 dark:bg-gradient-to-r dark:from-customColor4 dark:via-gray-400 dark:to-customColor4" />
      <div className="relative container mx-auto max-w-screen-lg p-6 min-h-screen shadow-lg z-10 bg-gray-700 border-opacity-75 text-center items-center dark:bg-customColor4 dark:border-customColor4">
        <div className=''>
          <h1 className='text-customColor4 text-3xl font-bold p-4 text-center mb-6 dark:text-customColor2'>
            {t('Air Quality Data')} {/* Use translation */}
          </h1>
        </div>
        {airQualityInfo && weatherInfo ? (
          <div className="text-white space-y-4">
            <div className="dark:text-customColor2 bg-customColor2 p-6 rounded-3xl shadow-lg bg-gradient-to-br from-customColor2 via-gray-700 to-cyan-600 dark:bg-gradient-to-br dark:from-customColor1 dark:via-gray-200 dark:to-gray-300">
              <p className="dark:bg-cyan-900 dark:bg-opacity-25 text-lg mb-4 p-4 bg-customColor4 bg-opacity-20 rounded-3xl">
                <strong>{t('Location')}:</strong> {locationString}
              </p>
              <p className="dark:bg-cyan-900 dark:bg-opacity-25 text-lg mb-4 p-4 bg-customColor4 bg-opacity-20 rounded-3xl">
                <strong>{t('Timestamp')}:</strong> {new Date(dt * 1000).toLocaleString()}
              </p>
              <p className="dark:bg-cyan-900 dark:bg-opacity-25 text-lg mb-4 p-4 bg-customColor4 bg-opacity-20 rounded-3xl">
                <strong>{t('AQI (Air Quality Index)')}:</strong> {airQualityMain?.aqi}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <p className="dark:bg-cyan-900 dark:bg-opacity-25 text-lg mb-4 p-4 bg-customColor4 bg-opacity-20 rounded-3xl">
                  <strong>{t('CO (Carbon Monoxide)')}:</strong> {components?.co} µg/m³
                </p>
                <p className="dark:bg-cyan-900 dark:bg-opacity-25 text-lg mb-4 p-4 bg-customColor4 bg-opacity-20 rounded-3xl">
                  <strong>{t('NO2 (Nitrogen Dioxide)')}:</strong> {components?.no2} µg/m³
                </p>
                <p className="dark:bg-cyan-900 dark:bg-opacity-25 text-lg mb-4 p-4 bg-customColor4 bg-opacity-20 rounded-3xl">
                  <strong>{t('O3 (Ozone)')}:</strong> {components?.o3} µg/m³
                </p>
                <p className="dark:bg-cyan-900 dark:bg-opacity-25 text-lg mb-4 p-4 bg-customColor4 bg-opacity-20 rounded-3xl">
                  <strong>{t('SO2 (Sulfur Dioxide)')}:</strong> {components?.so2} µg/m³
                </p>
                <p className="dark:bg-cyan-900 dark:bg-opacity-25 text-lg mb-4 p-4 bg-customColor4 bg-opacity-20 rounded-3xl">
                  <strong>{t('PM2.5 (Particulate Matter < 2.5µm)')}:</strong> {components?.pm2_5} µg/m³
                </p>
                <p className="dark:bg-cyan-900 dark:bg-opacity-25 text-lg mb-4 p-4 bg-customColor4 bg-opacity-20 rounded-3xl">
                  <strong>{t('PM10 (Particulate Matter < 10µm)')}:</strong> {components?.pm10} µg/m³
                </p>
              </div>
              <p className="dark:bg-cyan-900 dark:bg-opacity-25 text-lg mb-4 p-4 bg-customColor4 bg-opacity-20 rounded-3xl mt-4">
                <strong>{t('Humidity')}:</strong> {weatherMain?.humidity || 'N/A'} %
              </p>
              <p className="dark:bg-cyan-900 dark:bg-opacity-25 text-lg mb-4 p-4 bg-customColor4 bg-opacity-20 rounded-3xl">
                <strong>{t('Temperature')}:</strong> {weatherMain?.temp ? (weatherMain.temp).toFixed(2) : 'N/A'} °C
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-300">{t('No air quality or weather data available')}</p>
        )}
      </div>
    </div>
  );
}

export default AirQuality;
