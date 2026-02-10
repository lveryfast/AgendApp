import {db} from './initDatabase';

export const runMigrations = async (): Promise<void> => {
    try {
        const [result] = await db.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='schema_version'",
        );

        let currentVersion: number = 0;

        if (result.rows.length > 0) {
        const [versionResult] = await db.executeSql(
            'SELECT version FROM schema_version LIMIT 1',
        );
        if (versionResult.rows.length > 0) {
            currentVersion = versionResult.rows.item(0).version;
        }
        } else {
        await db.executeSql(
            'CREATE TABLE schema_version (version INTEGER PRIMARY KEY)',
        );
        await db.executeSql('INSERT INTO schema_version (version) VALUES (0)');
        }

        if (currentVersion < 1) {
        await db.executeSql('UPDATE schema_version SET version = 1');
        }

        console.log('Migrations completed. Current version:', currentVersion);
    } catch (error) {
        console.error('Error running migrations:', error);
        throw error;
    }
};