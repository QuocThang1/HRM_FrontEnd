// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationEN from "./locales/en/translation.json";
import translationVI from "./locales/vi/translation.json";

const resources = {
  en: { translation: translationEN },
  vi: { translation: translationVI },
};

i18n
  .use(initReactI18next) // pass i18n to react-i18next
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {},
  });

export default i18n;
