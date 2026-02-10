import {db} from '../database/initDatabase';
import {Task} from '../models/Task';
import uuid from 'react-native-uuid';

export const TaskService = {
    createTask: async (weekId: string, title: string): Promise<Task> => {
        const id: string = uuid.v4() as string;
        const createdAt: string = new Date().toISOString();
        const task: Task = {
        id,
        weekId,
        title,
        completed: 0,
        createdAt,
        };

        await db.executeSql(
        'INSERT INTO tasks (id, weekId, title, completed, createdAt) VALUES (?, ?, ?, ?, ?)',
        [id, weekId, title, 0, createdAt],
        );

        return task;
    },

    getTasksByWeekId: async (weekId: string): Promise<Task[]> => {
        const [result] = await db.executeSql(
        'SELECT * FROM tasks WHERE weekId = ? ORDER BY createdAt DESC',
        [weekId],
        );
        const tasks: Task[] = [];

        for (let i: number = 0; i < result.rows.length; i++) {
        tasks.push(result.rows.item(i));
        }

        return tasks;
    },

    toggleTask: async (id: string, completed: number): Promise<void> => {
        await db.executeSql('UPDATE tasks SET completed = ? WHERE id = ?', [
        completed,
        id,
        ]);
    },

    updateTaskTitle: async (id: string, title: string): Promise<void> => {
        await db.executeSql('UPDATE tasks SET title = ? WHERE id = ?', [title, id]);
    },

    deleteTask: async (id: string): Promise<void> => {
        await db.executeSql('DELETE FROM tasks WHERE id = ?', [id]);
    },

    getTaskStats: async (
        weekId: string,
    ): Promise<{completed: number; pending: number}> => {
        const [result] = await db.executeSql(
        'SELECT completed, COUNT(*) as count FROM tasks WHERE weekId = ? GROUP BY completed',
        [weekId],
        );

        let completed: number = 0;
        let pending: number = 0;

        for (let i: number = 0; i < result.rows.length; i++) {
        const row = result.rows.item(i);
        if (row.completed === 1) {
            completed = row.count;
        } else {
            pending = row.count;
        }
        }

        return {completed, pending};
    },
};