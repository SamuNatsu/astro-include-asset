import type { AstroIntegration } from "astro";
import { FlatCache } from "flat-cache";
import { isSatteriProcessor } from "@astrojs/markdown-satteri";
import { isUnifiedProcessor } from "@astrojs/markdown-remark";
import { mdastAsset } from "./satteri";
import { remarkAsset } from "./unified";
import { viteAsset } from "./vite";
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

// Types
export interface Option {
  /**
   * Output directory in distribution folder for placing the assets
   *
   * @default "_astro"
   */
  outDir?: string;
}

// Shared
let cache: FlatCache;

// --- Export integration ---
export default function includeAsset({
  outDir = "_astro",
}: Option = {}): AstroIntegration {
  return {
    name: "astro-include-asset",
    hooks: {
      "astro:config:setup": ({
        config,
        command,
        updateConfig,
        createCodegenDir,
        logger,
      }) => {
        if (command !== "build" && command !== "dev") return;

        // --- Cache control ---
        cache = new FlatCache({
          cacheDir: url.fileURLToPath(createCodegenDir()),
        });
        cache.load("cache1");
        if (command === "build") cache.clear();

        // --- Inject plugins ---
        const processor = config.markdown.processor;
        if (isSatteriProcessor(processor)) {
          processor.options.mdastPlugins.push(
            mdastAsset({ cache, base: config.base, outDir, logger }),
          );
        } else if (isUnifiedProcessor(processor)) {
          processor.options.remarkPlugins.push([
            remarkAsset,
            { cache, base: config.base, outDir, logger },
          ]);
        } else {
          throw Error(
            "only satteri and unified markdown processors are supported",
          );
        }

        updateConfig({
          vite: { plugins: [viteAsset(cache, outDir)] },
        });
      },
      "astro:build:done": async ({ dir }) => {
        const outputDir = url.fileURLToPath(new URL(`./${outDir}`, dir));
        fs.mkdirSync(outputDir, { recursive: true });

        Object.entries(cache.all()).forEach(([k, v]) =>
          fs.copyFileSync(
            v,
            path.join(outputDir, k.slice(`/${outDir}/`.length)),
          ),
        );
      },
    },
  };
}
