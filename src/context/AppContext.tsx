import React, {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppContextType {
    isDark: boolean;
    setIsDark: (value: boolean) => void;
    themeMode: 'light' | 'dark' | 'auto';
    setThemeMode: (mode: 'light' | 'dark' | 'auto') => Promise<void>;
    language: string;
    setLanguage: (lang: 'es' | 'en') => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [isDark, setIsDarkState] = useState<boolean>(false);
    const [themeMode, setThemeModeState] = useState<'light' | 'dark' | 'auto'>('light');
    const [language, setLanguageState] = useState<string>('es');

    useEffect(() => {
        loadPreferences();
    }, []);

    const loadPreferences = async () => {
        const savedTheme = await AsyncStorage.getItem('@theme_mode');
        const savedLang = await AsyncStorage.getItem('@language');
        
        if (savedLang) {
        setLanguageState(savedLang);
        }
        
        if (savedTheme) {
        const mode = savedTheme as 'light' | 'dark' | 'auto';
        setThemeModeState(mode);
        applyTheme(mode);
        }
    };

    const applyTheme = (mode: 'light' | 'dark' | 'auto') => {
        if (mode === 'dark') {
        setIsDarkState(true);
        } else if (mode === 'light') {
        setIsDarkState(false);
        } else {
        const hour = new Date().getHours();
        setIsDarkState(hour < 6 || hour >= 18);
        }
    };

    const setThemeMode = async (mode: 'light' | 'dark' | 'auto') => {
        setThemeModeState(mode);
        await AsyncStorage.setItem('@theme_mode', mode);
        applyTheme(mode);
    };

    const setIsDark = (value: boolean) => {
        setIsDarkState(value);
    };

    const setLanguage = async (lang: 'es' | 'en') => {
        setLanguageState(lang);
        await AsyncStorage.setItem('@language', lang);
    };

    useEffect(() => {
        if (themeMode !== 'auto') return;
        
        const interval = setInterval(() => {
        const hour = new Date().getHours();
        const shouldBeDark = hour < 6 || hour >= 18;
        setIsDarkState(shouldBeDark);
        }, 60000);

        return () => clearInterval(interval);
    }, [themeMode]);

    return (
        <AppContext.Provider
        value={{
            isDark,
            setIsDark,
            themeMode,
            setThemeMode,
            language,
            setLanguage,
        }}
        >
        {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useApp must be used within AppProvider');
    return context;
};