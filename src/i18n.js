import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './locales/en/translation.json';
import frTranslation from './locales/fr/translation.json';

// Determine the initial language
const savedLanguage = localStorage.getItem('language') || 'en'; // Default to 'en' if not set

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      fr: { translation: frTranslation },
    },
    lng: savedLanguage, // Set the initial language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

i18n.on('languageChanged', (lng) => {
  // Save the new language preference to local storage
  localStorage.setItem('language', lng);
});

export default i18n;
