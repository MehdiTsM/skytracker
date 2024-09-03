import React from 'react';
import CloseIcon from '@mui/icons-material/Close';

function DetailsPopup({ city, data, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 animate-fadeIn">
      <div className="relative bg-gradient-to-br from-customColor3 via-customColor2 to-customColor1 p-6 rounded-2xl shadow-lg w-11/12 md:w-1/2 lg:w-1/3 dark:bg-gradient-to-br dark:from-customColor1 dark:via-customColor4 dark:to-customColor3">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white dark:text-customColor2">{city}</h2>
          <div className='text-customColor4 hover:text-customColor5 transition duration-300 ease-in'>
            <CloseIcon
                onClick={onClose}
                className="cursor-pointer transition duration-300 ease-in-out hover:text-customColor5 dark:text-customColor2 dark:hover:text-customColor5"
                style={{ fontSize: 30 }}
            />
          </div>
        </div>
        <div className="space-y-4 flex flex-col">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between bg-customColor4 bg-opacity-20 rounded-3xl dark:bg-cyan-900 dark:bg-opacity-25 p-2 rounded-lg shadow-md">
              <div className="flex items-center">
                <img
                  src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                  alt={item.weather[0].description}
                  className="w-12 h-12"
                />
                <p className="text-customColor1 dark:text-customColor2 font-semibold ml-4">
                  {new Date(item.dt * 1000).toLocaleDateString()}: <strong className='text-customColor4 dark:text-customColor2'>{item.weather[0].description}</strong>
                </p>
              </div>
              <p className="font-bold text-customColor3 dark:text-customColor2">{Math.round(item.main.temp)}°C</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DetailsPopup;
