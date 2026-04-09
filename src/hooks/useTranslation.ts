import { useAppStore } from "@/store/useAppStore";
import { translations, TranslationKeys } from "@/constants/translations";

export const useTranslation = () => {
  const { language } = useAppStore();
  
  const t = (key: TranslationKeys): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  return { t, language };
};
