import {useState, useCallback} from 'react';
export interface ColorPalette {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
}

export const useImageColors = () => {
    const [palette, setPalette] = useState<ColorPalette | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const extractColors = useCallback(
        async (imagePath: string): Promise<ColorPalette | null> => {
        setLoading(true);
        try {
            // Simulación de extracción de colores dominantes
            const colors: ColorPalette = generatePaletteFromImage(imagePath);
            setPalette(colors);
            return colors;
        } catch (error) {
            console.error('Error extracting colors:', error);
            return null;
        } finally {
            setLoading(false);
        }
        },
        [],
    );

    const generatePaletteFromImage = (path: string): ColorPalette => {
        // Algoritmo simplificado - en producción usar análisis real de píxeles
        const hash: number = path.split('').reduce((acc, char) => {
        return acc + char.charCodeAt(0);
        }, 0);

        const r: number = (hash * 123) % 255;
        const g: number = (hash * 456) % 255;
        const b: number = (hash * 789) % 255;

        return {
        primary: `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`,
        secondary: `#${(((255 - r) << 16) | ((255 - g) << 8) | (255 - b)).toString(16).padStart(6, '0')}`,
        accent: `#${((r << 16) | (b << 8) | g).toString(16).padStart(6, '0')}`,
        background: `#${((Math.min(r + 50, 255) << 16) | (Math.min(g + 50, 255) << 8) | Math.min(b + 50, 255)).toString(16).padStart(6, '0')}`,
        text: r + g + b > 382 ? '#000000' : '#FFFFFF',
        };
    };

    return {palette, loading, extractColors};
};