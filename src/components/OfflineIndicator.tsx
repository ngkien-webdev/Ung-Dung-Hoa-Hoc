
import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface OfflineIndicatorProps {
  className?: string;
}

const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ className = '' }) => {
  const { language } = useLanguage();
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check immediately on mount
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) {
    return (
      <Badge variant="outline" className={`flex items-center gap-1 px-2 py-1 ${className}`}>
        <Wifi className="h-3 w-3 text-green-500" />
        <span className="text-xs">
          {language === 'vi' ? 'Trực tuyến' : 'Online'}
        </span>
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className={`flex items-center gap-1 px-2 py-1 animate-pulse bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 ${className}`}>
      <WifiOff className="h-3 w-3" />
      <span className="text-xs">
        {language === 'vi' ? 'Ngoại tuyến' : 'Offline'}
      </span>
    </Badge>
  );
};

export default OfflineIndicator;
