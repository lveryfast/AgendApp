export const rgbToHex = (r: number, g: number, b: number): string => {
    const toHex = (n: number): string => {
        const hex: string = Math.max(0, Math.min(255, n)).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
};

export const hexToRgb = (hex: string): {r: number; g: number; b: number} => {
    const cleanHex: string = hex.replace('#', '');
    const bigint: number = parseInt(cleanHex, 16);
    const r: number = (bigint >> 16) & 255;
    const g: number = (bigint >> 8) & 255;
    const b: number = bigint & 255;
    return {r, g, b};
};

export const getContrastColor = (hexColor: string): string => {
    const {r, g, b} = hexToRgb(hexColor);
    const luminance: number = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
};