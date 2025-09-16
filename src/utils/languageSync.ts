
import { toast } from "sonner";

// This is used to store the current language selection in both localStorage and IndexedDB
export interface LanguageSettings {
  currentLanguage: string;
  autoSync: boolean;
  lastSynced: string;
  availableLanguages: { code: string; name: string }[];
}

// Default language settings
const defaultSettings: LanguageSettings = {
  currentLanguage: 'en',
  autoSync: true,
  lastSynced: new Date().toISOString(),
  availableLanguages: [
    { code: 'en', name: 'English' },
    { code: 'vi', name: 'Tiếng Việt' }
  ]
};

/**
 * Initialize the language database
 */
export async function initLanguageDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('ChemistryAppLanguageDB', 1);
    
    request.onerror = (event) => {
      console.error('Error opening language database', event);
      reject(new Error('Failed to open language database'));
    };
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create object stores for translations and settings
      if (!db.objectStoreNames.contains('translations')) {
        const translationStore = db.createObjectStore('translations', { keyPath: 'key' });
        translationStore.createIndex('language', 'language', { unique: false });
      }
      
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'id' });
      }
    };
    
    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };
  });
}

/**
 * Store the current language settings
 */
export async function storeLanguageSettings(settings: LanguageSettings): Promise<void> {
  try {
    // Store in localStorage for quick access
    localStorage.setItem('languageSettings', JSON.stringify(settings));
    
    // Store in IndexedDB for offline persistence
    const db = await initLanguageDB();
    const transaction = db.transaction(['settings'], 'readwrite');
    const store = transaction.objectStore('settings');
    
    store.put({
      id: 'languageSettings',
      ...settings
    });
    
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = (event) => reject(event);
    });
  } catch (error) {
    console.error('Error storing language settings', error);
    throw error;
  }
}

/**
 * Get the current language settings
 */
export async function getLanguageSettings(): Promise<LanguageSettings> {
  try {
    // Try to get from localStorage first for performance
    const localSettings = localStorage.getItem('languageSettings');
    if (localSettings) {
      return JSON.parse(localSettings);
    }
    
    // Fall back to IndexedDB
    const db = await initLanguageDB();
    const transaction = db.transaction(['settings'], 'readonly');
    const store = transaction.objectStore('settings');
    
    return new Promise((resolve, reject) => {
      const request = store.get('languageSettings');
      
      request.onsuccess = () => {
        if (request.result) {
          const settings = request.result as LanguageSettings;
          // Update localStorage for next quick access
          localStorage.setItem('languageSettings', JSON.stringify(settings));
          resolve(settings);
        } else {
          // No settings found, store and return defaults
          storeLanguageSettings(defaultSettings).then(() => {
            resolve(defaultSettings);
          });
        }
      };
      
      request.onerror = (event) => {
        console.error('Error getting language settings', event);
        reject(new Error('Failed to get language settings'));
      };
    });
  } catch (error) {
    console.error('Error retrieving language settings', error);
    // Fall back to defaults if there's an error
    return defaultSettings;
  }
}

/**
 * Store translations for offline use
 */
export async function storeTranslations(language: string, translations: Record<string, string>): Promise<void> {
  try {
    const db = await initLanguageDB();
    const transaction = db.transaction(['translations'], 'readwrite');
    const store = transaction.objectStore('translations');
    
    // Store each translation as a separate record
    const promises: Promise<void>[] = [];
    
    Object.entries(translations).forEach(([key, value]) => {
      const promise = new Promise<void>((resolve, reject) => {
        const request = store.put({
          key: `${language}:${key}`,
          language,
          translationKey: key,
          value
        });
        request.onsuccess = () => resolve();
        request.onerror = () => reject();
      });
      
      promises.push(promise);
    });
    
    await Promise.all(promises);
    
    // Update last synced timestamp
    const settings = await getLanguageSettings();
    settings.lastSynced = new Date().toISOString();
    await storeLanguageSettings(settings);
    
  } catch (error) {
    console.error('Error storing translations', error);
    throw error;
  }
}

/**
 * Get translations for a specific language
 */
export async function getTranslations(language: string): Promise<Record<string, string>> {
  try {
    const db = await initLanguageDB();
    const transaction = db.transaction(['translations'], 'readonly');
    const store = transaction.objectStore('translations');
    const index = store.index('language');
    
    return new Promise((resolve, reject) => {
      const request = index.getAll(language);
      
      request.onsuccess = () => {
        const results = request.result;
        if (results && results.length > 0) {
          // Convert array of records to a key-value object
          const translations: Record<string, string> = {};
          results.forEach((record: any) => {
            translations[record.translationKey] = record.value;
          });
          resolve(translations);
        } else {
          resolve({});
        }
      };
      
      request.onerror = (event) => {
        console.error('Error getting translations', event);
        reject(new Error('Failed to get translations'));
      };
    });
  } catch (error) {
    console.error('Error retrieving translations', error);
    return {};
  }
}

/**
 * Auto-detect system language
 */
export function detectSystemLanguage(): string {
  const browserLang = navigator.language.split('-')[0];
  const supportedLanguages = defaultSettings.availableLanguages.map(lang => lang.code);
  
  return supportedLanguages.includes(browserLang) ? browserLang : 'en';
}

/**
 * Sync translations with online server (simulated)
 */
export async function syncTranslationsWithServer(forceSync = false): Promise<boolean> {
  try {
    const settings = await getLanguageSettings();
    
    // Check if auto-sync is enabled or force sync requested
    if (!settings.autoSync && !forceSync) {
      return false;
    }
    
    // Simulate fetch request to get latest translations
    toast.loading('Syncing language data...');
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Update last synced timestamp
    settings.lastSynced = new Date().toISOString();
    await storeLanguageSettings(settings);
    
    toast.success('Language data synchronized successfully');
    return true;
  } catch (error) {
    console.error('Error syncing translations', error);
    toast.error('Failed to sync language data. Check your connection.');
    return false;
  }
}

/**
 * Export language data for offline use
 */
export async function exportLanguageData(): Promise<Blob> {
  try {
    const settings = await getLanguageSettings();
    const languages = settings.availableLanguages.map(lang => lang.code);
    
    const exportData: Record<string, any> = {
      settings,
      translations: {}
    };
    
    // Get translations for all available languages
    for (const language of languages) {
      exportData.translations[language] = await getTranslations(language);
    }
    
    // Create a Blob with the JSON data
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    return blob;
  } catch (error) {
    console.error('Error exporting language data', error);
    throw new Error('Failed to export language data');
  }
}

/**
 * Import language data from file
 */
export async function importLanguageData(file: File): Promise<void> {
  try {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          const content = event.target?.result as string;
          const importData = JSON.parse(content);
          
          // Validate imported data
          if (!importData.settings || !importData.translations) {
            throw new Error('Invalid language data format');
          }
          
          // Store settings
          await storeLanguageSettings(importData.settings);
          
          // Store translations for each language
          for (const [language, translations] of Object.entries(importData.translations)) {
            await storeTranslations(language, translations as Record<string, string>);
          }
          
          toast.success('Language data imported successfully');
          resolve();
        } catch (error) {
          console.error('Error parsing imported data', error);
          reject(new Error('Failed to parse imported data'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsText(file);
    });
  } catch (error) {
    console.error('Error importing language data', error);
    throw error;
  }
}

/**
 * Get offline status
 */
export function isOffline(): boolean {
  return !navigator.onLine;
}

/**
 * Register service worker for offline support
 */
export async function registerServiceWorker(): Promise<void> {
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service worker registered successfully');
    } catch (error) {
      console.error('Error registering service worker', error);
    }
  }
}
