import React from 'react';
import { NavLink } from 'react-router-dom';
import PublicIcon from '@mui/icons-material/Public';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import ErrorIcon from '@mui/icons-material/Error';
import SKY from '../images/SKY.png';
import { useTranslation } from 'react-i18next'; // Import the useTranslation hook

function Header() {
  const { t } = useTranslation(); // Initialize the translation hook

  return (
    <header className='bg-gradient-to-r from-customColor2 via-gray-700 to-customColor2 dark:from-customColor4 dark:via-gray-400 dark:to-customColor4 animate-fadeIn'>
      <div className='dark:bg-customColor4 bg-gray-700 relative container mx-auto max-w-screen-lg border-r-4 border-l-4 border-gray-700 border-opacity-75 shadow-xl dark:bg-customColor4 dark:border-customColor4'>
        <img src={SKY} className='w-[375px] items-center flex mx-auto' alt={t('Sky Logo')} />
      </div>
      <div className='relative border-t-2 border-b-2 border-customColor1 bg-customColor2 w-full flex flex-row justify-evenly text-customColor4 p-3 font-semibold dark:text-customColor2 dark:bg-slate-100'>
        <div className='max-w-[950px] flex flex-grow justify-between'>
          <NavLink
            to="/"
            className={({ isActive }) => 
              `flex flex-col items-center transition-colors duration-200 ${isActive ? 'text-customColor1' : 'hover:text-customColor1'}`
            }
          >
            <HomeIcon fontSize="medium" />
            <h1 className='text-lg mt-1'>{t('Home')}</h1> {/* Translated text */}
          </NavLink>
          <NavLink
            to="/map"
            className={({ isActive }) => 
              `flex flex-col items-center transition-colors duration-200 ${isActive ? 'text-customColor1' : 'hover:text-customColor1'}`
            }
          >
            <PublicIcon fontSize="medium" />
            <h1 className='text-lg mt-1'>{t('Map')}</h1> {/* Translated text */}
          </NavLink>
          <NavLink
            to="/air-quality"
            className={({ isActive }) => 
              `flex flex-col items-center transition-colors duration-200 ${isActive ? 'text-customColor1' : 'hover:text-customColor1'}`
            }
          >
            <ErrorIcon fontSize="medium" />
            <h1 className='text-lg mt-1'>{t('Air Quality')}</h1> {/* Translated text */}
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) => 
              `flex flex-col items-center transition-colors duration-200 ${isActive ? 'text-customColor1' : 'hover:text-customColor1'}`
            }
          >
            <SettingsIcon fontSize="medium" />
            <h1 className='text-lg mt-1'>{t('Settings')}</h1> {/* Translated text */}
          </NavLink>
        </div>
      </div>
    </header>
  );
}

export default Header;
