import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

const databaseName: string = 'AgendaOffline.db';
const databaseVersion: string = '1.0';
const databaseDisplayName: string = 'Agenda Offline Database';
const databaseSize: number = 200000;

let dbInstance: SQLite.SQLiteDatabase | null = null;

export const getDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
    if (dbInstance) {
        return dbInstance;
    }

    dbInstance = await SQLite.openDatabase(
        {
            name: databaseName,
            version: databaseVersion,
            displayName: databaseDisplayName,
            size: databaseSize,
            location: 'default',
        },
        () => {
            console.log('Database opened successfully');
        },
        (_error: any) => {
            console.error('Error opening database');
        },
    );

    return dbInstance;
};

// Exportar db como getter para compatibilidad
export const db = {
    executeSql: async (sql: string, params?: any[]): Promise<[SQLite.ResultSet]> => {
        const database = await getDatabase();
        return database.executeSql(sql, params);
    },
    transaction: async (
        callback: (tx: SQLite.Transaction) => void,
        error?: (error: Error) => void,
        success?: () => void,
    ): Promise<void> => {
        const database = await getDatabase();
        return database.transaction(callback, error, success);
    },
} as SQLite.SQLiteDatabase;

export const initDatabase = async (): Promise<void> => {
    try {
        const db = await getDatabase();

        await db.executeSql(`
            CREATE TABLE IF NOT EXISTS weeks (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                createdAt TEXT NOT NULL
            )
        `);

        await db.executeSql(`
            CREATE TABLE IF NOT EXISTS days (
                id TEXT PRIMARY KEY,
                weekId TEXT NOT NULL,
                dayName TEXT NOT NULL,
                dayIndex INTEGER NOT NULL,
                FOREIGN KEY (weekId) REFERENCES weeks(id) ON DELETE CASCADE
            )
        `);

        await db.executeSql(`
            CREATE TABLE IF NOT EXISTS events (
                id TEXT PRIMARY KEY,
                dayId TEXT NOT NULL,
                title TEXT NOT NULL,
                description TEXT,
                startTime TEXT NOT NULL,
                endTime TEXT NOT NULL,
                color TEXT NOT NULL,
                FOREIGN KEY (dayId) REFERENCES days(id) ON DELETE CASCADE
            )
        `);

        await db.executeSql(`
            CREATE TABLE IF NOT EXISTS tasks (
                id TEXT PRIMARY KEY,
                weekId TEXT NOT NULL,
                title TEXT NOT NULL,
                completed INTEGER DEFAULT 0,
                createdAt TEXT NOT NULL,
                FOREIGN KEY (weekId) REFERENCES weeks(id) ON DELETE CASCADE
            )
        `);

        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
};