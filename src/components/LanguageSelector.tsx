
import React from 'react';
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { toast } from "sonner";

const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const languages: { value: Language; label: string; flag: string }[] = [
    { value: 'en', label: t('language.en', { defaultValue: 'English' }), flag: '🇬🇧' },
    { value: 'vi', label: t('language.vi', { defaultValue: 'Vietnamese' }), flag: '🇻🇳' }
  ];

  const handleLanguageChange = (newLang: Language) => {
    if (newLang === language) return; // Don't change if it's already the selected language
    
    setLanguage(newLang);
    // Show toast notification
    toast.success(t('language.changed', { defaultValue: 'Language changed' }), {
      description: languages.find(lang => lang.value === newLang)?.label || '',
      position: 'bottom-right'
    });
    
    // Use setTimeout to trigger page reload after state update
    setTimeout(() => {
      window.location.reload();
    }, 200);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1 hover:bg-secondary transition-colors">
          <Globe className="h-4 w-4" />
          <span className="hidden md:inline-block text-sm">
            {languages.find(lang => lang.value === language)?.flag} {languages.find(lang => lang.value === language)?.label}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px] bg-background/95 backdrop-blur-sm border shadow-lg animate-fade-in">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.value}
            onClick={() => handleLanguageChange(lang.value)}
            className={`flex items-center gap-2 cursor-pointer ${language === lang.value ? 'bg-muted' : ''} hover:bg-muted/80 transition-colors`}
          >
            <span className="text-base">{lang.flag}</span>
            <span>{lang.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
