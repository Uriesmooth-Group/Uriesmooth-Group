import express from "express";
import helmet from "helmet";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const here = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 3000);
const owner = process.env.GITHUB_OWNER || "Uriesmooth-Group";
const repo = process.env.GITHUB_REPO || "Uriesmooth-Group";
const branch = process.env.GITHUB_BRANCH || "main";
const token = process.env.GITHUB_TOKEN;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.static(path.join(here, "public"), { extensions: ["html"] }));
app.get("/api/health", (_req, res) => res.json({ status: "ok", service: "uriesmooth-omnicare", timestamp: new Date().toISOString() }));

async function github(endpoint) {
  const response = await fetch("https://api.github.com" + endpoint, {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "Uriesmooth-OmniCare",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    signal: AbortSignal.timeout(10000)
  });
  if (!response.ok) {
    const error = new Error(`GitHub returned ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

app.get("/api/repository", async (_req, res) => {
  try {
    const [metadata, commits, branches, manifest, source] = await Promise.all([
      github(`/repos/${owner}/${repo}`),
      github(`/repos/${owner}/${repo}/commits?per_page=8`),
      github(`/repos/${owner}/${repo}/branches?per_page=100`),
      github(`/repos/${owner}/${repo}/contents/products/uriesmooth-omnicare/package.json?ref=${encodeURIComponent(branch)}`).catch(() => null),
      github(`/repos/${owner}/${repo}/contents/products/uriesmooth-omnicare/public/index.html?ref=${encodeURIComponent(branch)}`).catch(() => null)
    ]);
    const decode = item => item?.content ? Buffer.from(item.content, "base64").toString("utf8") : null;
    res.json({
      metadata: { fullName: metadata.full_name, private: metadata.private, defaultBranch: metadata.default_branch, htmlUrl: metadata.html_url, pushedAt: metadata.pushed_at, updatedAt: metadata.updated_at, stars: metadata.stargazers_count, openIssues: metadata.open_issues_count },
      commits: commits.map(item => ({ sha: item.sha, shortSha: item.sha.slice(0, 7), message: item.commit.message, author: item.commit.author?.name || item.author?.login || "Unknown", date: item.commit.author?.date, url: item.html_url })),
      branches: branches.map(item => ({ name: item.name, sha: item.commit.sha })),
      manifest: decode(manifest),
      source: decode(source),
      configuredBranch: branch,
      sync: metadata.default_branch === branch ? "tracking-default-branch" : "tracking-configured-branch",
      fetchedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(error.status || 502).json({ error: "Repository data is temporarily unavailable.", detail: error.message });
  }
});

app.listen(port, "0.0.0.0", () => console.log(`OmniCare listening on ${port}`));