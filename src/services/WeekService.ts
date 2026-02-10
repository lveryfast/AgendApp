import {db} from '../database/initDatabase';
import {Week} from '../models/Week';
import uuid from 'react-native-uuid';

export const WeekService = {
    createWeek: async (title: string): Promise<Week> => {
        const id: string = uuid.v4() as string;
        const createdAt: string = new Date().toISOString();
        const week: Week = {id, title, createdAt};

        await db.executeSql(
        'INSERT INTO weeks (id, title, createdAt) VALUES (?, ?, ?)',
        [id, title, createdAt],
        );

        return week;
    },

    getAllWeeks: async (): Promise<Week[]> => {
        const [result] = await db.executeSql(
        'SELECT * FROM weeks ORDER BY createdAt DESC',
        );
        const weeks: Week[] = [];

        for (let i: number = 0; i < result.rows.length; i++) {
        weeks.push(result.rows.item(i));
        }

        return weeks;
    },

    getWeekById: async (id: string): Promise<Week | null> => {
        const [result] = await db.executeSql(
        'SELECT * FROM weeks WHERE id = ? LIMIT 1',
        [id],
        );

        if (result.rows.length > 0) {
        return result.rows.item(0);
        }
        return null;
    },

    updateWeek: async (id: string, title: string): Promise<void> => {
        await db.executeSql('UPDATE weeks SET title = ? WHERE id = ?', [title, id]);
    },

    deleteWeek: async (id: string): Promise<void> => {
        await db.executeSql('DELETE FROM weeks WHERE id = ?', [id]);
    },
};