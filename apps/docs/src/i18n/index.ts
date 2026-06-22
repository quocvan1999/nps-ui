import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import side-by-side locales from each component/page
import { commonLocales } from "./locales/common";
import { homeLocales } from "../pages/home/locales";
import { gettingStartedLocales } from "../pages/getting-started/locales";
import { buttonLocales } from "../pages/components/button/locales";
import { alertLocales } from "../pages/components/alert/locales";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: commonLocales.en,
        home: homeLocales.en,
        gettingStarted: gettingStartedLocales.en,
        button: buttonLocales.en,
        alert: alertLocales.en,
      },
      vi: {
        common: commonLocales.vi,
        home: homeLocales.vi,
        gettingStarted: gettingStartedLocales.vi,
        button: buttonLocales.vi,
        alert: alertLocales.vi,
      },
    },
    fallbackLng: "en",
    defaultNS: "common",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["querystring", "localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;
