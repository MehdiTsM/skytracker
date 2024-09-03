import React from 'react';
import { useTranslation } from 'react-i18next';

function WeatherCard({ city, temperature, description, icon, onDetailsClick }) {
  const { t } = useTranslation();

  return (
    <div
      className="bg-gradient-to-br from-customColor1 via-customColor2 to-customColor3 shadow-lg rounded-3xl p-6 m-4 w-64 transform transition-all hover:scale-105 hover:shadow-2xl cursor-pointer dark:bg-gradient-to-br dark:from-customColor3 dark:via-customColor4 dark:to-customColor1 animate-fadeIn"
      onClick={onDetailsClick}
    >
      <h2 className="text-xl font-semibold text-white mb-2 dark:text-customColor2">{city}</h2>
      <div className="bg-white rounded-full p-2 mb-4 shadow-md">
        <img
          src={`http://openweathermap.org/img/wn/${icon}@2x.png`}
          alt={description}
          className="w-16 h-16"
        />
      </div>
      <p className="text-3xl font-bold text-white mb-1 dark:text-customColor2">{temperature}°C</p>
      <p className="text-sm text-white italic capitalize dark:text-customColor2">{description}</p>
      <div className="mt-4 flex justify-center">
        <button className="dark:bg-slate-200 dark:hover:bg-slate-300 dark:text-customColor2 text-white bg-gray-800 hover:bg-gray-700 py-1 px-4 rounded-full transition-all duration-200 ease-in-out">
          {t('details')}
        </button>
      </div>
    </div>
  );
}

export default WeatherCard;
