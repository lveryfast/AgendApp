import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useLanguage = () => {
    const {i18n, t} = useTranslation();

    const changeLanguage = useCallback(async (lng: 'es' | 'en') => {
        await i18n.changeLanguage(lng);
        await AsyncStorage.setItem('@language', lng);
    }, [i18n]);

    const currentLanguage = i18n.language || 'es';

    return {
        t,
        changeLanguage,
        currentLanguage,
    };
};