import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Languages } from "lucide-react";

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLanguage(language === "es" ? "en" : "es")}
      className="text-purple-300 hover:text-purple-100 hover:bg-purple-700/50"
    >
      <Languages className="h-4 w-4 mr-2" />
      {language === "es" ? "ES" : "EN"}
    </Button>
  );
};
