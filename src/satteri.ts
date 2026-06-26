import type { AstroIntegrationLogger } from "astro";
import { FlatCache } from "flat-cache";
import { defineMdastPlugin } from "satteri";
import { fileURLToPath } from "node:url";
import path from "node:path";

// --- Types ---
export interface MdastOption {
  cache: FlatCache;
  base: string;
  outDir: string;
  logger: AstroIntegrationLogger;
}

// --- Export satteri plugin ---
export const mdastAsset = ({ cache, base, outDir, logger }: MdastOption) =>
  defineMdastPlugin({
    name: "astro-include-asset-mdast",
    leafDirective(node, ctx) {
      if (node.name !== "include-asset") return;

      if (node.children[0].type !== "text") {
        throw Error("invalid asset directive");
      }

      const attr = node.attributes;
      if (!attr?.id) {
        throw Error("invalid asset directive");
      }

      if (!ctx.fileURL) {
        throw Error("no context file URL");
      }
      const ctxPath = fileURLToPath(ctx.fileURL);

      const fromPath = path.resolve(ctxPath, node.children[0].value);
      const toPath = path.join(base, outDir, attr.id);
      cache.set(toPath, fromPath);
      cache.save();
      logger.info(`new asset: ${toPath} -> ${fromPath}`);

      ctx.setProperty(node, "children", []);
    },
  });
