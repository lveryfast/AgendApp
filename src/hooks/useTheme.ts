import {useState, useEffect, useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark' | 'auto';
export type AdaptiveMode = boolean;

interface ThemeState {
    themeMode: ThemeMode;
    isAdaptive: AdaptiveMode;
    isDark: boolean;
}

const STORAGE_KEY_THEME: string = '@theme_mode';
const STORAGE_KEY_ADAPTIVE: string = '@adaptive_mode';

export const useTheme = (): ThemeState & {
    setThemeMode: (mode: ThemeMode) => Promise<void>;
    setAdaptiveMode: (enabled: AdaptiveMode) => Promise<void>;
    } => {
    const [themeMode, setThemeModeState] = useState<ThemeMode>('light');
    const [isAdaptive, setIsAdaptive] = useState<AdaptiveMode>(false);
    const [isDark, setIsDark] = useState<boolean>(false);

    useEffect(() => {
        loadThemePreferences();
    }, []);

    useEffect(() => {
        if (themeMode === 'auto') {
        const hour: number = new Date().getHours();
        setIsDark(hour < 6 || hour >= 18);
        } else {
        setIsDark(themeMode === 'dark');
        }
    }, [themeMode]);

    const loadThemePreferences = async (): Promise<void> => {
        try {
        const savedTheme = await AsyncStorage.getItem(STORAGE_KEY_THEME);
        const savedAdaptive = await AsyncStorage.getItem(STORAGE_KEY_ADAPTIVE);

        if (savedTheme) {
            setThemeModeState(savedTheme as ThemeMode);
        }
        if (savedAdaptive) {
            setIsAdaptive(savedAdaptive === 'true');
        }
        } catch (error) {
        console.error('Error loading theme preferences:', error);
        }
    };

    const setThemeMode = useCallback(async (mode: ThemeMode): Promise<void> => {
        try {
        await AsyncStorage.setItem(STORAGE_KEY_THEME, mode);
        setThemeModeState(mode);
        } catch (error) {
        console.error('Error saving theme mode:', error);
        }
    }, []);

    const setAdaptiveMode = useCallback(
        async (enabled: AdaptiveMode): Promise<void> => {
        try {
            await AsyncStorage.setItem(
            STORAGE_KEY_ADAPTIVE,
            enabled ? 'true' : 'false',
            );
            setIsAdaptive(enabled);
        } catch (error) {
            console.error('Error saving adaptive mode:', error);
        }
        },
        [],
    );

    return {
        themeMode,
        isAdaptive,
        isDark,
        setThemeMode,
        setAdaptiveMode,
    };
};