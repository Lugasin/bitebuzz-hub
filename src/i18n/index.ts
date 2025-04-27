import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import enTranslations from './locales/en.json';
import frTranslations from './locales/fr.json';
import esTranslations from './locales/es.json';

// Available languages
export const LANGUAGES = {
  en: { name: 'English', flag: '🇺🇸' },
  fr: { name: 'Français', flag: '🇫🇷' },
  es: { name: 'Español', flag: '🇪🇸' },
};

// Translation resources
const resources = {
  en: {
    translation: enTranslations,
  },
  fr: {
    translation: frTranslations,
  },
  es: {
    translation: esTranslations,
  },
};

// i18n configuration
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

// Helper function to format currency
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat(i18n.language, {
    style: 'currency',
    currency,
  }).format(amount);
}

// Helper function to format date
export function formatDate(date: Date | string, format: 'short' | 'long' = 'short'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat(i18n.language, {
    dateStyle: format === 'short' ? 'short' : 'long',
    timeStyle: 'short',
  }).format(dateObj);
}

// Helper function to format number
export function formatNumber(number: number, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(i18n.language, options).format(number);
}

// Example usage in React components:
/*
import { useTranslation } from 'react-i18next';
import { formatCurrency, formatDate } from '../i18n';

function MyComponent() {
  const { t, i18n } = useTranslation();

  return (
    <div>
      <h1>{t('welcome')}</h1>
      <p>{t('price', { price: formatCurrency(99.99) })}</p>
      <p>{t('date', { date: formatDate(new Date()) })}</p>
      
      <button onClick={() => i18n.changeLanguage('fr')}>
        {t('changeLanguage')}
      </button>
    </div>
  );
}
*/ 