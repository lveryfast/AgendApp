import {db} from '../database/initDatabase';
import {Day} from '../models/Day';
import uuid from 'react-native-uuid';

const DAY_NAMES: string[] = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
];

export const DayService = {
    createDaysForWeek: async (weekId: string): Promise<Day[]> => {
        const days: Day[] = [];

        for (let i: number = 0; i < 7; i++) {
        const id: string = uuid.v4() as string;
        const day: Day = {
            id,
            weekId,
            dayName: DAY_NAMES[i],
            dayIndex: i,
        };

        await db.executeSql(
            'INSERT INTO days (id, weekId, dayName, dayIndex) VALUES (?, ?, ?, ?)',
            [id, weekId, DAY_NAMES[i], i],
        );

        days.push(day);
        }

        return days;
    },

    getDaysByWeekId: async (weekId: string): Promise<Day[]> => {
        const [result] = await db.executeSql(
        'SELECT * FROM days WHERE weekId = ? ORDER BY dayIndex ASC',
        [weekId],
        );
        const days: Day[] = [];

        for (let i: number = 0; i < result.rows.length; i++) {
        days.push(result.rows.item(i));
        }

        return days;
    },

    getDayById: async (id: string): Promise<Day | null> => {
        const [result] = await db.executeSql(
        'SELECT * FROM days WHERE id = ? LIMIT 1',
        [id],
        );

        if (result.rows.length > 0) {
        return result.rows.item(0);
        }
        return null;
    },

    deleteDay: async (id: string): Promise<void> => {
        await db.executeSql('DELETE FROM days WHERE id = ?', [id]);
    },
};