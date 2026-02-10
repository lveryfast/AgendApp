import {useState, useEffect} from 'react';

interface CurrentTime {
    date: Date;
    formattedDate: string;
    formattedTime: string;
    dayProgress: number;
}

export const useCurrentTime = (): CurrentTime => {
    const [currentTime, setCurrentTime] = useState<Date>(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
        setCurrentTime(new Date());
        }, 60000);

        return () => clearInterval(timer);
    }, []);

    const formatDate = (date: Date): string => {
        const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        };
        return date.toLocaleDateString('es-ES', options);
    };

    const formatTime = (date: Date): string => {
        return date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        });
    };

    const calculateDayProgress = (date: Date): number => {
        const hours: number = date.getHours();
        const minutes: number = date.getMinutes();
        const totalMinutes: number = hours * 60 + minutes;
        const startOfDay: number = 6 * 60;
        const endOfDay: number = 22 * 60;

        if (totalMinutes < startOfDay) return 0;
        if (totalMinutes > endOfDay) return 100;

        return ((totalMinutes - startOfDay) / (endOfDay - startOfDay)) * 100;
    };

    return {
        date: currentTime,
        formattedDate: formatDate(currentTime),
        formattedTime: formatTime(currentTime),
        dayProgress: calculateDayProgress(currentTime),
    };
};