import sqlite3 from "sqlite3";
import { open } from "sqlite";

sqlite3.verbose();

class SqlConnector {
    constructor(dbClient) {
        this.client = dbClient;
    }

    /**
     * Initializes the database connection asynchronously.
     * @param {Object} settings - Configuration object.
     * @param {string} settings.fileName - SQLite file path.
     * @returns {Promise<SqlConnector>} A new SqlConnector instance.
     */
    static async init(settings = {}) {
        if (!settings.fileName) {
            throw new Error("Database filename is required.");
        }

        const dbClient = await open({
            filename: settings.fileName,
            driver: sqlite3.Database,
        });

        return new SqlConnector(dbClient);
    }

    /**
     * Executes a SQL query and returns all matching rows.
     * @param {string} query - SQL query string.
     * @param {Array} params - Query parameters (optional).
     * @returns {Promise<Array>} The result set as an array.
     */
    async getAll(query, params = []) {
        if (!query) {
            throw new Error("No query given! Cannot query SQL.");
        }

        try {
            return await this.client.all(query, params);
        } catch (err) {
            console.error("SQL error:", err);
            throw new Error("Failed to query SQL");
        }
    }

    /**
     * Closes the database connection.
     */
    async close() {
        if (this.client) {
            await this.client.close();
            console.log("Database connection closed.");
        }
    }
}

export default SqlConnector;
