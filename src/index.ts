import cors from "cors";
import express from "express";
import { UrlController } from "./controllers/url-controller.js";
import { setupUrlRoutes } from "./routes/url-routes.js";
import { DbService } from "./services/db-service.js";
import { UrlService } from "./services/url-service.js";

async function main() {
  const db = await DbService.getInstance();
  const urlService = new UrlService(db);
  const urlController = new UrlController(urlService);

  const app = express();
  const port = 3001;

  app.use(express.json());
  app.use(cors());
  app.use(setupUrlRoutes(urlController));

  const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });

  // Graceful shutdown
  process.on("SIGTERM", () => {
    console.log("SIGTERM signal received: closing HTTP server");
    server.close(() => {
      console.log("HTTP server closed");
      process.exit(0);
    });
  });
}

main().catch(console.error);
