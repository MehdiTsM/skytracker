import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ThemeContext from '../ThemeContext'; // Import the ThemeContext
import i18n from '../i18n';

function Settings() {
  const [region, setRegion] = useState('US');

  const { theme, toggleTheme } = useContext(ThemeContext);
  const { t, i18n } = useTranslation(); // Use the useTranslation hook

  const handleThemeSwitch = () => {
    toggleTheme();
  };

  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    console.log(i18n); // Check if i18n has changeLanguage function
    i18n.changeLanguage(newLanguage); // Change language on selection
  };

  return (
    <div className='animate-fadeIn bg-gradient-to-r from-customColor2 via-gray-700 to-customColor2 min-h-screen dark:bg-gradient-to-r dark:from-customColor4 dark:via-gray-400 dark:to-customColor4 transition'>
      <div className={`bg-gray-700 relative container mx-auto max-w-screen-lg border-r-4 border-l-4 border-gray-700 border-opacity-75 shadow-xl min-h-screen p-4 dark:bg-customColor4 dark:border-customColor4 transition`}>
        <h1 className="text-customColor4 text-3xl font-bold p-4 text-center pt-8 dark:text-customWhite dark:text-customColor2 transition">{t('Settings')}</h1>
        
        <div className="bg-customColor2 p-4 rounded-3xl shadow-lg bg-gradient-to-br from-customColor2 via-gray-700 to-cyan-600 text-customColor4 dark:bg-gradient-to-br dark:from-customColor1 dark:via-gray-200 dark:to-gray-300 transition">
          <section className="transition space-y-4 text-lg mb-8 p-4 bg-customColor4 bg-opacity-20 rounded-3xl dark:bg-cyan-900 dark:bg-opacity-25">
            <h2 className="text-xl font-semibold dark:text-customColor2">{t('Theme and Display')}</h2>
            
            <div className="transition flex items-center justify-between text-lg">
              <span className="text-customColor4 font-medium dark:text-customWhite dark:text-customColor2">{t('Theme')}</span>
              <select
                value={theme}
                onChange={handleThemeSwitch}
                className="cursor-pointer dark:hover:bg-slate-300 dark:bg-slate-200 dark:text-customColor2 border border-customColor4 rounded-2xl bg-customColor2 text-customColor4 px-2 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-customColor1 font-medium dark:border-customWhite hover:bg-zinc-800 dark:text-customWhite dark:focus:ring-customColor2"
              >
                <option value="dark">{t('Light Mode')}</option>
                <option value="light">{t('Dark Mode')}</option>
              </select>
            </div>
          </section>

          {/* Language and Region */}
          <section className="space-y-4 text-lg mb-0 p-4 bg-customColor4 bg-opacity-20 rounded-3xl dark:bg-cyan-900 dark:bg-opacity-25">
            <h2 className="text-xl font-semibold dark:text-customColor2">{t('Language and Region')}</h2>
            
            <div className="flex items-center justify-between">
              <span className="dark:text-customColor2 text-customColor4 font-medium dark:text-customWhite">{t('Language')}</span>
              <select
                value={i18n.language}
                onChange={handleLanguageChange}
                className="border cursor-pointer dark:hover:bg-slate-300 hover:bg-zinc-800 dark:bg-slate-200 border-customColor4 rounded-2xl bg-customColor2 text-customColor4 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-customColor1 font-medium dark:border-customWhite dark:text-customWhite dark:focus:ring-customColor2 dark:bg-customColor4 dark:text-customColor2"
              >
                <option value="en">{t('English')}</option>
                <option value="fr">{t('French')}</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <span className="dark:text-customColor2 text-customColor4 font-medium dark:text-customWhite">{t('Region')}</span>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="border dark:hover:bg-slate-300 hover:bg-zinc-800 dark:bg-slate-200 cursor-pointer border-customColor4 rounded-2xl bg-customColor2 text-customColor4 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-customColor1 font-medium dark:border-customWhite dark:text-customWhite dark:focus:ring-customColor2 dark:bg-customColor4 dark:text-customColor2"
              >
                <option value="US">{t('US')}</option>
                <option value="EU">{t('EU')}</option>
                <option value="Asia">{t('Asia')}</option>
                <option value="Other">{t('Other')}</option>
              </select>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

export default Settings;
