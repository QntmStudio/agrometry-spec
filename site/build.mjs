// Assemble dist/: static pages from public/ plus the JSON Schemas from ../schema,
// so the published $id URLs always match the files in the repository.
import { cpSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const dist = join(here, "dist");

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
cpSync(join(here, "public"), dist, { recursive: true });
cpSync(join(here, "..", "schema"), join(dist, "schema"), { recursive: true });
console.log("site built in", dist);
