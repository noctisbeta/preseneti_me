import cors from 'cors';
import express, { Request, Response } from 'express';
import { nanoid } from 'nanoid';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

async function main() {
  const db = await open({
    filename: './data/urls.db',
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS urls (
      shortcode TEXT PRIMARY KEY,
      longUrl TEXT NOT NULL
    )
  `);

  const app = express();
  const port = 3001;

  app.use(express.json());
  app.use(cors());

  app.post('/shorten', async (req: Request, res: Response) => {
    const { longUrl } = req.body;
    const shortcode = nanoid(8);

    try {
      await db.run('INSERT INTO urls (shortcode, longUrl) VALUES (?, ?)', shortcode, longUrl);
      res.json({ shortUrl: `preseneti.me/${shortcode}` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to shorten URL' });
    }
  });

  app.get('/:shortcode', async (req: Request, res: Response) => {
    const { shortcode } = req.params;

    try {
      const result = await db.get('SELECT longUrl FROM urls WHERE shortcode = ?', shortcode);
      if (result) {
        res.redirect(result.longUrl);
      } else {
        res.status(404).json({ error: 'URL not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to retrieve URL' });
    }
  });

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

main().catch(console.error);