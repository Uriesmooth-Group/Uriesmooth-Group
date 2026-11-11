import { readFileSync } from "node:fs";
import { Script } from "node:vm";

const html = readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/gi)];
if (scripts.length !== 1) {
  throw new Error("Expected one inline application script, found " + scripts.length);
}
new Script(scripts[0][1], { filename: "public/index.html:inline-script" });
console.log("Inline browser JavaScript syntax: OK");
