import {db} from '../database/initDatabase';
import {Event} from '../models/Event';
import uuid from 'react-native-uuid';

export const EventService = {
    createEvent: async (
        dayId: string,
        title: string,
        description: string,
        startTime: string,
        endTime: string,
        color: string,
    ): Promise<Event> => {
        const id: string = uuid.v4() as string;
        const event: Event = {
        id,
        dayId,
        title,
        description,
        startTime,
        endTime,
        color,
        };

        await db.executeSql(
        'INSERT INTO events (id, dayId, title, description, startTime, endTime, color) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [id, dayId, title, description, startTime, endTime, color],
        );

        return event;
    },

    getEventsByDayId: async (dayId: string): Promise<Event[]> => {
        const [result] = await db.executeSql(
        'SELECT * FROM events WHERE dayId = ? ORDER BY startTime ASC',
        [dayId],
        );
        const events: Event[] = [];

        for (let i: number = 0; i < result.rows.length; i++) {
        events.push(result.rows.item(i));
        }

        return events;
    },

    getEventsByWeekId: async (weekId: string): Promise<Event[]> => {
        const [result] = await db.executeSql(
        `SELECT e.* FROM events e 
        INNER JOIN days d ON e.dayId = d.id 
        WHERE d.weekId = ? 
        ORDER BY d.dayIndex ASC, e.startTime ASC`,
        [weekId],
        );
        const events: Event[] = [];

        for (let i: number = 0; i < result.rows.length; i++) {
        events.push(result.rows.item(i));
        }

        return events;
    },

    updateEvent: async (
        id: string,
        updates: Partial<Omit<Event, 'id' | 'dayId'>>,
    ): Promise<void> => {
        const fields: string[] = Object.keys(updates);
        const values: (string | number)[] = Object.values(updates);

        if (fields.length === 0) return;

        const setClause: string = fields.map(field => `${field} = ?`).join(', ');
        await db.executeSql(`UPDATE events SET ${setClause} WHERE id = ?`, [
        ...values,
        id,
        ]);
    },

    deleteEvent: async (id: string): Promise<void> => {
        await db.executeSql('DELETE FROM events WHERE id = ?', [id]);
    },
};