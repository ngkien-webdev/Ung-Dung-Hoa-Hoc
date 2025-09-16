
import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Download, Check } from 'lucide-react';

interface LanguageSynchronizerProps {
  children: React.ReactNode;
}

const LanguageSynchronizer: React.FC<LanguageSynchronizerProps> = ({ children }) => {
  const { language, t } = useLanguage();
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [hasCachedTranslations, setHasCachedTranslations] = useState<boolean>(false);
  const [showOfflineBanner, setShowOfflineBanner] = useState<boolean>(false);
  const [translationsData, setTranslationsData] = useState<Record<string, string>>({});

  useEffect(() => {
    // Check if we have cached language data in IndexedDB
    checkCachedTranslations();

    // Set up online/offline event listeners
    const handleOnline = () => {
      setIsOnline(true);
      toast.success(language === 'vi' ? 'Đã kết nối lại!' : 'You\'re back online!');
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.warning(language === 'vi' ? 'Bạn đang ngoại tuyến!' : 'You\'re offline!');
      setShowOfflineBanner(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [language]);

  const checkCachedTranslations = async () => {
    try {
      // Check if IndexedDB is supported
      if (!window.indexedDB) {
        console.error('IndexedDB not supported');
        return;
      }

      // Open or create our translations database
      const request = window.indexedDB.open('ChemistryTranslations', 1);

      request.onerror = (event) => {
        console.error('IndexedDB error:', event);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        // Create an object store for translations if it doesn't exist
        if (!db.objectStoreNames.contains('translations')) {
          db.createObjectStore('translations', { keyPath: 'lang' });
        }
      };

      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const transaction = db.transaction(['translations'], 'readonly');
        const store = transaction.objectStore('translations');
        const getRequest = store.get(language);

        getRequest.onsuccess = () => {
          if (getRequest.result) {
            setHasCachedTranslations(true);
            // If we have cached data and we're offline, use it
            if (!isOnline) {
              setTranslationsData(getRequest.result.data);
              toast.info(language === 'vi' ? 
                'Đang sử dụng bản dịch ngoại tuyến' : 
                'Using offline translations');
            }
          } else {
            setHasCachedTranslations(false);
          }
        };

        getRequest.onerror = (err) => {
          console.error('Error getting cached translations:', err);
        };
      };
    } catch (error) {
      console.error('Error checking cached translations:', error);
    }
  };

  const syncTranslations = async () => {
    if (!isOnline) {
      toast.error(language === 'vi' ? 
        'Không thể đồng bộ hóa khi ngoại tuyến' : 
        'Cannot sync translations while offline');
      return;
    }

    setIsSyncing(true);

    try {
      // Simulate API call to fetch translations (in real app, this would be a real API call)
      const response = await new Promise<Record<string, string>>((resolve) => {
        setTimeout(() => {
          // Simulated translation data
          if (language === 'vi') {
            resolve({
              'learn.title': 'Học Hóa Học',
              'learn.description': 'Khám phá các khái niệm hóa học qua các tài liệu tương tác',
              'format.interactive': 'Tương tác',
              'format.video': 'Video',
              'format.reading': 'Đọc',
              'format.simulation': 'Mô phỏng',
              'format.educational': 'Khóa học',
              'difficulty.beginner': 'Cơ bản',
              'difficulty.intermediate': 'Trung bình',
              'difficulty.advanced': 'Nâng cao',
              'difficulty.allLevels': 'Mọi cấp độ',
              'learn.resources.downloadTooltip': 'Tải về để sử dụng ngoại tuyến',
              // ... more translations
            });
          } else {
            resolve({
              'learn.title': 'Learn Chemistry',
              'learn.description': 'Explore chemistry concepts through interactive materials',
              'format.interactive': 'Interactive',
              'format.video': 'Video',
              'format.reading': 'Reading',
              'format.simulation': 'Simulation',
              'format.educational': 'Course',
              'difficulty.beginner': 'Beginner',
              'difficulty.intermediate': 'Intermediate',
              'difficulty.advanced': 'Advanced',
              'difficulty.allLevels': 'All Levels',
              'learn.resources.downloadTooltip': 'Download for offline use',
              // ... more translations
            });
          }
        }, 1000);
      });

      // Store the translations in component state
      setTranslationsData(response);

      // Store in IndexedDB for offline use
      const request = window.indexedDB.open('ChemistryTranslations', 1);
      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const transaction = db.transaction(['translations'], 'readwrite');
        const store = transaction.objectStore('translations');
        
        // Save the translations data
        store.put({
          lang: language,
          data: response,
          timestamp: new Date().toISOString()
        });

        transaction.oncomplete = () => {
          toast.success(language === 'vi' ? 
            'Đã đồng bộ hóa bản dịch thành công!' : 
            'Translations synchronized successfully!');
          setHasCachedTranslations(true);
        };

        transaction.onerror = () => {
          toast.error(language === 'vi' ? 
            'Không thể lưu bản dịch' : 
            'Could not save translations');
        };
      };
    } catch (error) {
      console.error('Error syncing translations:', error);
      toast.error(language === 'vi' ? 
        'Đồng bộ hóa thất bại' : 
        'Synchronization failed');
    } finally {
      setIsSyncing(false);
    }
  };

  const dismissOfflineBanner = () => {
    setShowOfflineBanner(false);
  };

  return (
    <>
      {showOfflineBanner && !isOnline && (
        <Alert className="mb-4 animate-fade-in">
          <AlertTitle className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-amber-500 mr-2 animate-pulse"></div>
            {language === 'vi' ? 'Bạn đang ngoại tuyến' : 'You are offline'}
          </AlertTitle>
          <AlertDescription>
            <div className="flex justify-between items-center">
              <span>
                {language === 'vi' 
                  ? `${hasCachedTranslations ? 'Đang sử dụng bản dịch ngoại tuyến' : 'Một số nội dung có thể không hiển thị đúng'}`
                  : `${hasCachedTranslations ? 'Using offline translations' : 'Some content may not display correctly'}`}
              </span>
              <Button variant="outline" size="sm" onClick={dismissOfflineBanner}>
                {language === 'vi' ? 'Đóng' : 'Dismiss'}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {isOnline && !hasCachedTranslations && (
        <div className="mb-4">
          <Button 
            variant="outline"
            className="w-full" 
            onClick={syncTranslations}
            disabled={isSyncing}
          >
            {isSyncing ? (
              <>
                <div className="h-4 w-4 rounded-full border-2 border-primary border-r-transparent animate-spin mr-2"></div>
                {language === 'vi' ? 'Đang đồng bộ hóa...' : 'Synchronizing...'}
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                {language === 'vi' ? 'Đồng bộ hóa bản dịch cho sử dụng ngoại tuyến' : 'Sync translations for offline use'}
              </>
            )}
          </Button>
        </div>
      )}

      {isOnline && hasCachedTranslations && (
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4 px-1">
          <span className="flex items-center">
            <Check className="h-3 w-3 mr-1 text-green-500" />
            {language === 'vi' ? 'Đã đồng bộ hóa cho sử dụng ngoại tuyến' : 'Synchronized for offline use'}
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={syncTranslations}
            disabled={isSyncing}
            className="h-7 text-xs"
          >
            {isSyncing ? 
              (language === 'vi' ? 'Đang đồng bộ...' : 'Syncing...') : 
              (language === 'vi' ? 'Cập nhật' : 'Update')}
          </Button>
        </div>
      )}

      {children}
    </>
  );
};

export default LanguageSynchronizer;
