import AsyncStorage from '@react-native-async-storage/async-storage';

export const StorageKeys = {
    BACKGROUND_IMAGE: '@background_image',
    LAST_WEEK_ID: '@last_week_id',
    LANGUAGE: '@language',
} as const;

export const storage = {
    set: async (key: string, value: string): Promise<void> => {
        try {
        await AsyncStorage.setItem(key, value);
        } catch (error) {
        console.error('Error saving to storage:', error);
        }
    },

    get: async (key: string): Promise<string | null> => {
        try {
        return await AsyncStorage.getItem(key);
        } catch (error) {
        console.error('Error reading from storage:', error);
        return null;
        }
    },

    remove: async (key: string): Promise<void> => {
        try {
        await AsyncStorage.removeItem(key);
        } catch (error) {
        console.error('Error removing from storage:', error);
        }
    },
};