import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_EXPIRY_MS = 60 * 60 * 1000;

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

export const saveToCache = async <T>(key: string, data: T): Promise<void> => {
  try {
    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(key, JSON.stringify(cacheItem));
    console.log('[v0] Saved to cache:', key);
  } catch (error) {
    console.log('[v0] Error saving to cache:', error);
  }
};

export const getFromCache = async <T>(key: string): Promise<T | null> => {
  try {
    const item = await AsyncStorage.getItem(key);

    if (!item) {
      return null;
    }

    const cacheItem: CacheItem<T> = JSON.parse(item);
    const age = Date.now() - cacheItem.timestamp;

    if (age > CACHE_EXPIRY_MS) {
      console.log('[v0] Cache expired for:', key);
      await AsyncStorage.removeItem(key);
      return null;
    }

    console.log('[v0] Retrieved from cache:', key);
    return cacheItem.data;
  } catch (error) {
    console.log('[v0] Error retrieving from cache:', error);
    return null;
  }
};

export const clearCache = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
    console.log('[v0] Cache cleared');
  } catch (error) {
    console.log('[v0] Error clearing cache:', error);
  }
};

export const removeCacheItem = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
    console.log('[v0] Cache item removed:', key);
  } catch (error) {
    console.log('[v0] Error removing cache item:', error);
  }
};
