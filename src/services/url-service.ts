import { Database } from "sqlite";
import sqlite3 from "sqlite3";

interface UrlLookupResult {
  shortcode: string;
}

interface ShortcodeLookupResult {
  longUrl: string;
}

export class UrlService {
  constructor(private db: Database<sqlite3.Database>) {}

  async findByLongUrl(longUrl: string): Promise<UrlLookupResult | undefined> {
    try {
      return await this.db.get<UrlLookupResult>(
        "SELECT shortcode FROM urls WHERE longUrl = ?",
        longUrl
      );
    } catch (error) {
      console.error("Database error in findByLongUrl:", error);
      throw new Error("Failed to lookup URL");
    }
  }

  async findByShortcode(
    shortcode: string
  ): Promise<ShortcodeLookupResult | undefined> {
    try {
      return await this.db.get<ShortcodeLookupResult>(
        "SELECT longUrl FROM urls WHERE shortcode = ?",
        shortcode
      );
    } catch (error) {
      console.error("Database error in findByShortcode:", error);
      throw new Error("Failed to lookup shortcode");
    }
  }

  async create(shortcode: string, longUrl: string) {
    try {
      return await this.db.run(
        "INSERT INTO urls (shortcode, longUrl) VALUES (?, ?)",
        shortcode,
        longUrl
      );
    } catch (error) {
      console.error(
        "Database error in create:",
        error instanceof Error ? error.message : error
      );
      throw new Error("Failed to create short URL");
    }
  }
}
