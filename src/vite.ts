import type { Plugin } from "vite";
import { FlatCache } from "flat-cache";
import fs from "node:fs";
import mime from "mime";

// --- Export vite plugin ---
export const viteAsset = (cache: FlatCache, outDir: string) =>
  ({
    name: "astro-include-asset-vite",
    configureServer: (svr) => {
      svr.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith(`/${outDir}/`)) {
          const pth = cache.get<string>(req.url);

          if (!pth || !fs.existsSync(pth)) {
            return next();
          }

          res.setHeader(
            "Content-Type",
            mime.getType(pth) ?? "application/octet-stream",
          );
          fs.createReadStream(pth).pipe(res);
          return;
        }
        next();
      });
    },
  }) satisfies Plugin;
