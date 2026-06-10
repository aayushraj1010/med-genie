import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

// Only initialize if it hasn't been initialized yet
if (!i18n.isInitialized) {
  i18n
    // load translation using http -> see /public/locales
    .use(HttpBackend)
    // detect user language
    .use(LanguageDetector)
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // init i18next
    .init({
      fallbackLng: 'en',
      supportedLngs: ['en', 'hi', 'bn', 'ta'],
      debug: false,
      interpolation: {
        escapeValue: false, // not needed for react as it escapes by default
      },
      backend: {
        loadPath: '/locales/{{lng}}/translation.json',
      },
    });
}

export default i18n;
