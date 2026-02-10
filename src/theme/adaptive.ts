import {ColorPalette} from '../hooks/useImageColors';

export const generateAdaptiveTheme = (palette: ColorPalette) => {
    return {
        colors: {
        primary: palette.primary,
        secondary: palette.secondary,
        accent: palette.accent,
        background: palette.background,
        surface: adjustBrightness(palette.background, 20),
        text: palette.text,
        textSecondary: adjustOpacity(palette.text, 0.7),
        border: adjustOpacity(palette.primary, 0.3),
        },
    };
};

const adjustBrightness = (hex: string, percent: number): string => {
    const num: number = parseInt(hex.replace('#', ''), 16);
    const amt: number = Math.round(2.55 * percent);
    const R: number = (num >> 16) + amt;
    const G: number = ((num >> 8) & 0x00ff) + amt;
    const B: number = (num & 0x0000ff) + amt;
    return (
        '#' +
        (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
        )
        .toString(16)
        .slice(1)
    );
};

const adjustOpacity = (hex: string, opacity: number): string => {
    const r: number = parseInt(hex.slice(1, 3), 16);
    const g: number = parseInt(hex.slice(3, 5), 16);
    const b: number = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};