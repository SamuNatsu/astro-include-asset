import type {} from "remark-directive";
import type { AstroIntegrationLogger } from "astro";
import type { Root } from "mdast";
import type { VFile } from "vfile";
import { FlatCache } from "flat-cache";
import { visit } from "unist-util-visit";
import path from "node:path";

// --- Types ---
export interface RemarkOption {
  cache: FlatCache;
  base: string;
  outDir: string;
  logger: AstroIntegrationLogger;
}

// --- Export remark plugin ---
export const remarkAsset =
  ({ cache, base, outDir, logger }: RemarkOption) =>
  (tree: Root, vfile: VFile) => {
    visit(tree, "leafDirective", (node) => {
      if (node.name !== "include-asset") return;

      if (node.children[0].type !== "text") {
        throw Error("invalid asset directive");
      }

      const attr = node.attributes || (node.attributes = {});
      if (!attr.id) {
        throw Error("invalid asset directive");
      }

      const fromPath = path.resolve(vfile.history[0], node.children[0].value);
      const toPath = path.join(base, outDir, attr.id);
      cache.set(toPath, fromPath);
      cache.save();
      logger.info(`new asset: ${toPath} -> ${fromPath}`);

      node.children = [];
    });
  };
