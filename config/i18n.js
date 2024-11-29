const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const Middleware = require('i18next-http-middleware');

i18next
  .use(Backend)
  .use(Middleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    preload: ['en', 'fr', 'kin', 'sw'],
    backend: {
      loadPath: __dirname + '../locales/{{lng}}/{{ns}}.json'
    },
    detection: {
      order: ['querystring', 'cookie', 'header'],
      caches: ['cookie']
    },
    interpolation: {
      escapeValue: false
    }
  });

module.exports = i18next;
