import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WeatherCard from '../components/WeatherCard';
import DetailsPopup from '../components/DetailsPopup'; // Adjust path if needed
import SearchBar from '../components/SearchBar'; // Adjust path if needed
import { useTranslation } from 'react-i18next';

const API_KEY = 'df1f4649ac868b38b6c825be463dcc44';

const bigCities = [
  'New York', 'London', 'Tokyo', 'Paris', 'Moscow', 'Los Angeles'
];

function Home() {
  const { t } = useTranslation(); // Use the useTranslation hook

  const [weatherData, setWeatherData] = useState([]);
  const [currentLocationWeather, setCurrentLocationWeather] = useState(null);
  const [popupData, setPopupData] = useState(null);
  const [selectedCity, setSelectedCity] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWeatherData = async (city) => {
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
      return response.data;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  };

  const fetchForecastData = async (city) => {
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`);
      return response.data;
    } catch (error) {
      console.error('Error fetching forecast data:', error);
      throw error;
    }
  };

  const filterDailyForecast = (forecastData) => {
    const forecastList = forecastData.list;
    const dailyForecast = [];
    const seenDates = new Set();

    forecastList.forEach((entry) => {
      const date = new Date(entry.dt * 1000).toLocaleDateString();
      if (!seenDates.has(date)) {
        seenDates.add(date);
        dailyForecast.push(entry);
      }
    });

    return dailyForecast;
  };

  const fetchAllWeatherData = async () => {
    setLoading(true);
    setError(null);
    try {
      const weatherPromises = bigCities.map(fetchWeatherData);
      const weatherResults = await Promise.all(weatherPromises);
      setWeatherData(weatherResults);
    } catch (err) {
      setError(t('ErrorFetchingData')); // Use translation
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentLocationWeather = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
          setCurrentLocationWeather(response.data);
        } catch (error) {
          console.error('Error fetching current location weather:', error);
          setError(t('ErrorFetchingData')); // Use translation
        }
      }, (error) => {
        setError(t('Failed to get current location. Please check your location settings.'));
      });
    } else {
      setError('Geolocation is not supported by this browser.'); // This could also be translated if desired
    }
  };

  const handleSearch = async (query) => {
    // Optional: Handle search query change if needed
  };

  const handleSelectCity = async (city) => {
    setLoading(true);
    setError(null);
    try {
      // Fetch data for the selected city
      const data = await fetchWeatherData(city);
      if (data) {
        setSelectedCity(city);
        const forecastData = await fetchForecastData(city);
        const dailyForecast = filterDailyForecast(forecastData);
        setPopupData(dailyForecast);
      }
    } catch (err) {
      setError(t('ErrorFetchingData')); // Use translation
    } finally {
      setLoading(false);
    }
  };

  const handleDetailsClick = async (city) => {
    setLoading(true);
    setError(null);
    try {
      const forecastData = await fetchForecastData(city);
      const dailyForecast = filterDailyForecast(forecastData);
      setPopupData(dailyForecast);
      setSelectedCity(city);
    } catch (err) {
      setError(t('ErrorFetchingData')); // Use translation
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllWeatherData();
    fetchCurrentLocationWeather();
  }, []);

  return (
    <div className='animate-fadeIn'>
      <div className="relative bg-gray-700 min-h-screen dark:bg-gradient-to-r dark:from-customColor4 dark:via-gray-400 dark:to-customColor4">
        <div className=" absolute inset-0 bg-gradient-to-r from-customColor2 via-gray-700 to-customColor2 min-h-screen dark:bg-gradient-to-r dark:from-customColor4 dark:via-gray-400 dark:to-customColor4" />
        <div className="relative container mx-auto max-w-screen-lg p-4 bg-gray-700 min-h-screen shadow-lg z-10 border-l-4 border-r-4 border-gray-700 border-opacity-75 shadow-2xl dark:bg-customColor4 dark:border-customColor4">
          <SearchBar onSearch={handleSearch} onSelectCity={handleSelectCity} />

          {error && <p className="text-red-500">{error}</p>}

          <h1 className='text-customColor4 text-3xl font-bold p-4 dark:text-customColor2'>
            {t('CurrentLocationWeather')} {/* Translate header */}
          </h1>
          {currentLocationWeather ? (
            <div className="flex flex-wrap mt-4 items-center justify-center space-x-4">
              <WeatherCard
                city={currentLocationWeather.name}
                temperature={Math.round(currentLocationWeather.main.temp)}
                description={currentLocationWeather.weather[0].description}
                icon={currentLocationWeather.weather[0].icon}
                onDetailsClick={() => handleDetailsClick(currentLocationWeather.name)}
              />
            </div>
          ) : (
            <p className="text-gray-300">{t('NoCurrentLocationWeather')}</p> 
          )}

          <h1 className='text-customColor4 text-3xl font-bold p-4 mb-4 mt-4 dark:text-customColor2'>
            {t('FewLocationsAroundWorld')}
          </h1>
          <div className="flex flex-wrap mt-4 items-center justify-center space-x-4">
            {weatherData.length > 0 ? (
              weatherData.map((data) => (
                <WeatherCard
                  key={data.id}
                  city={data.name}
                  temperature={Math.round(data.main.temp)}
                  description={data.weather[0].description}
                  icon={data.weather[0].icon}
                  onDetailsClick={() => handleDetailsClick(data.name)}
                />
              ))
            ) : (
              <p className="text-gray-300">{t('NoWeatherDataAvailable')}</p>
            )}
          </div>
        </div>
      </div>

      {/* Details Popup */}
      {popupData && Array.isArray(popupData) && popupData.length > 0 && (
        <DetailsPopup 
          city={selectedCity}
          data={popupData}
          onClose={() => setPopupData(null)}
        />
      )}
    </div>
  );
}

export default Home;
