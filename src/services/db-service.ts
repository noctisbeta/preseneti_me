import { Database, open } from "sqlite";
import sqlite3 from "sqlite3";

export class DbService {
  private static instance: Database<sqlite3.Database>;

  private constructor() {}

  static async getInstance(): Promise<Database<sqlite3.Database>> {
    if (!DbService.instance) {
      try {
        DbService.instance = await open({
          filename: "./data/urls.db",
          driver: sqlite3.Database,
        });

        await initializeDatabase(DbService.instance);
      } catch (error) {
        console.error("Failed to initialize database:", error);
        throw error;
      }
    }

    return DbService.instance;
  }
}

async function initializeDatabase(db: Database) {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS urls (
      shortcode TEXT PRIMARY KEY,
      longUrl TEXT NOT NULL
    );
    
    CREATE INDEX IF NOT EXISTS idx_urls_long_url ON urls(longUrl);
  `);
}
