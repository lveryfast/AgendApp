import i18n from '../i18n';

export const formatDateDisplay = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    };
    return date.toLocaleDateString(i18n.language === 'es' ? 'es-ES' : 'en-US', options);
};

export const formatTimeDisplay = (time: string): string => {
    return time;
};

const DAY_NAME_TO_KEY: Record<string, string> = {
    'Lunes': 'monday',
    'Martes': 'tuesday',
    'Miércoles': 'wednesday',
    'Miercoles': 'wednesday',
    'Jueves': 'thursday',
    'Viernes': 'friday',
    'Sábado': 'saturday',
    'Sabado': 'saturday',
    'Domingo': 'sunday',
};

export const getDayTranslationKey = (dayName: string): string => {
    return DAY_NAME_TO_KEY[dayName] || dayName.toLowerCase();
};

export const getTranslatedDayName = (dayName: string): string => {
    const key = getDayTranslationKey(dayName);
    return i18n.t(`days.${key}`);
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
};