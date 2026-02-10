declare module 'react-native-sqlite-storage' {
    export = SQLite;
    
    namespace SQLite {
        interface DatabaseParams {
        name: string;
        version?: string;
        displayName?: string;
        size?: number;
        location?: 'default' | 'Library' | 'Documents' | 'Shared';
        }

        interface TransactionCallback {
        (tx: Transaction): void;
        }

        interface TransactionErrorCallback {
        (error: Error): void;
        }

        interface TransactionSuccessCallback {
        (): void;
        }

        interface ResultSet {
        insertId: number;
        rowsAffected: number;
        rows: {
            length: number;
            item(index: number): any;
            raw(): any[];
        };
        }

        interface Transaction {
        executeSql(
            sql: string,
            params?: any[],
            success?: (tx: Transaction, result: ResultSet) => void,
            error?: (tx: Transaction, error: Error) => boolean
        ): Promise<[Transaction, ResultSet]>;
        }

        interface SQLiteDatabase {
        executeSql(sql: string, params?: any[]): Promise<[ResultSet]>;
        transaction(
            callback: TransactionCallback,
            error?: TransactionErrorCallback,
            success?: TransactionSuccessCallback
        ): Promise<void>;
        }

        function openDatabase(
        params: DatabaseParams,
        success?: () => void,
        error?: (error: any) => void
        ): SQLiteDatabase;

        function enablePromise(enable: boolean): void;
    }
}