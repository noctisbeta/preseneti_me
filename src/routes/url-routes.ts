import { Router } from "express";
import { UrlController } from "../controllers/url-controller";

export function setupUrlRoutes(urlController: UrlController): Router {
  const router = Router();

  router.post("/shorten", urlController.shortenUrl);
  router.get("/:shortcode", urlController.redirectToUrl);

  return router;
}
