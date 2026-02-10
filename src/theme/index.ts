import {Colors} from './colors';
import {generateAdaptiveTheme} from './adaptive';
import {ColorPalette} from '../hooks/useImageColors';

export type ThemeType = 'light' | 'dark' | 'adaptive';

export const getTheme = (
    themeType: ThemeType,
    isDark: boolean,
    adaptivePalette?: ColorPalette | null,
) => {
    if (themeType === 'adaptive' && adaptivePalette) {
        return generateAdaptiveTheme(adaptivePalette);
    }

    const baseColors = isDark ? Colors.dark : Colors.light;

    return {
        colors: baseColors,
        paper: Colors.paper,
    };
};

export {Colors};