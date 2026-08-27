import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import am from './locales/am.json';
import wt from './locales/wt.json';

const savedLang = localStorage.getItem('lang') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      am: { translation: am },
      wt: { translation: wt }
    },
    lng: savedLang,
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  });

export default i18n;
