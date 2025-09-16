
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Atom, Search, Book, Beaker, Gamepad, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from '@/hooks/use-mobile';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';

export function Navbar() {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useLanguage();

  const navigation = [
    { name: t('nav.home', { defaultValue: 'Periodic Table' }), href: '/', icon: <Atom className="h-4 w-4 mr-2" /> },
    { name: t('nav.search', { defaultValue: 'Search' }), href: '/search', icon: <Search className="h-4 w-4 mr-2" /> },
    { name: t('nav.learn', { defaultValue: 'Learn' }), href: '/learn', icon: <Book className="h-4 w-4 mr-2" /> },
    { name: t('nav.reactions', { defaultValue: 'Reactions' }), href: '/reactions', icon: <Beaker className="h-4 w-4 mr-2" /> },
    { name: t('nav.quiz', { defaultValue: 'Quiz' }), href: '/quiz', icon: <Gamepad className="h-4 w-4 mr-2" /> },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const NavLinks = () => (
    <>
      {navigation.map((item) => {
        const isActive = location.pathname === item.href;
        return (
          <Link key={item.name} to={item.href}>
            <Button 
              variant={isActive ? "default" : "ghost"} 
              className={`flex items-center ${isActive ? "bg-gradient-to-r from-primary to-primary/80" : "hover:bg-secondary"} transition-all`}
              onClick={() => setIsOpen(false)}
            >
              {item.icon}
              {item.name}
            </Button>
          </Link>
        );
      })}
      <LanguageSelector />
    </>
  );

  return (
    <header className={`sticky top-0 z-40 w-full border-b ${scrolled ? 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm' : 'bg-background'} transition-all duration-300`}>
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Atom className="h-6 w-6 text-primary animate-spin-slow" />
          <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">{t('app.title', { defaultValue: 'SmartAtom Explorer' })}</span>
        </div>

        {isMobile ? (
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-64 pt-10">
              <div className="flex flex-col gap-2">
                <NavLinks />
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <nav className="flex items-center gap-1">
            <NavLinks />
          </nav>
        )}
      </div>
    </header>
  );
}
