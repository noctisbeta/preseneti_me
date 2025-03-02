import { Request, Response } from "express";
import { nanoid } from "nanoid";
import { UrlService } from "../services/url-service";

export class UrlController {
  constructor(private urlService: UrlService) {}

  isValidUrl = (urlString: string): boolean => {
    try {
      // First try with the original string
      new URL(urlString);
      return true;
    } catch {
      try {
        // If original fails, try with https:// prefix
        new URL(`https://${urlString}`);
        return true;
      } catch {
        return false;
      }
    }
  };

  shortenUrl = async (req: Request, res: Response): Promise<void> => {
    const { longUrl } = req.body;

    if (!longUrl || typeof longUrl !== "string" || !this.isValidUrl(longUrl)) {
      res.status(400).json({ error: "Invalid URL provided" });
      return;
    }

    // Add https:// if no protocol is specified
    const urlToStore = longUrl.startsWith("http")
      ? longUrl
      : `https://${longUrl}`;

    const existing = await this.urlService.findByLongUrl(urlToStore);

    if (existing) {
      res.json({ shortUrl: `https://preseneti.me/${existing.shortcode}` });
      return;
    }

    const shortcode = nanoid(8);

    try {
      await this.urlService.create(shortcode, urlToStore);
      res.json({ shortUrl: `https://preseneti.me/${shortcode}` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to shorten URL" });
    }
  };

  redirectToUrl = async (req: Request, res: Response): Promise<void> => {
    const { shortcode } = req.params;

    if (!shortcode || typeof shortcode !== "string" || shortcode.length !== 8) {
      res.status(400).json({ error: "Invalid shortcode" });
      return;
    }

    try {
      const result = await this.urlService.findByShortcode(shortcode);
      if (result) {
        res.redirect(result.longUrl);
      } else {
        res.status(404).json({ error: "URL not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to retrieve URL" });
    }
  };
}
