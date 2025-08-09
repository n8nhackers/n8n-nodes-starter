#!/usr/bin/env node
const { execSync } = require("child_process");
const fs = require("fs");
const readline = require("readline");

const argv = process.argv.slice(2);
const DRY_RUN = argv.includes("--dry-run");
const WRITE_CHANGELOG = argv.includes("--write-changelog");
const DEFAULT_BUMP = (() => {
	const idx = argv.indexOf("--default-bump");
	return idx !== -1 ? (argv[idx + 1] || "patch") : null;
})();

// === Rules by path ===
const RULES = [
	{ test: f => f.startsWith("credentials/"), bump: "major" },
	{ test: f => f.startsWith("nodes/"),        bump: "minor" },
	{ test: f => f.match(/\.(ts|js|mjs|cjs)$/), bump: "patch" },
];
const IGNORE = f => f.startsWith("docs/") || f === "README.md" || f.endsWith(".md");
const ORDER = { major: 3, minor: 2, patch: 1 };

function sh(cmd, opts = {}) {
	return execSync(cmd, { stdio: ["pipe", "pipe", "inherit"], encoding: "utf8", ...opts }).trim();
}
function getLastTag() {
	try { return sh("git describe --tags --abbrev=0"); } catch { return "v0.0.0"; }
}
function getChangesSince(tag) {
	try { return sh(`git diff --name-only ${tag}...HEAD`).split("\n").filter(Boolean); }
	catch { return []; }
}
function inferBump(files) {
	let bump = null;
	for (const f of files) {
		if (IGNORE(f)) continue;
		for (const rule of RULES) {
			if (rule.test(f)) {
				if (!bump || ORDER[rule.bump] > ORDER[bump]) bump = rule.bump;
			}
		}
	}
	return bump || "patch";
}
function bumpSemver(current, type) {
	const [maj, min, pat] = current.split(".").map(Number);
	if (type === "major") return `${maj + 1}.0.0`;
	if (type === "minor") return `${maj}.${min + 1}.0`;
	return `${maj}.${min}.${pat + 1}`;
}
async function ask(question, def) {
	const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
	const answer = await new Promise(res => rl.question(`${question} ${def ? `[${def}] ` : ""}`, res));
	rl.close();
	return (answer || def || "").trim();
}
function ensureCleanWorkingTree() {
	const status = sh("git status --porcelain");
	if (status) {
		console.error("⚠️  You have uncommitted changes. Please commit or stash before versioning.");
		process.exit(1);
	}
}
function readPkg() {
	if (!fs.existsSync("package.json")) return null;
	return JSON.parse(fs.readFileSync("package.json", "utf8"));
}

function getChangelogSince(tag) {
	// Compact view grouped by type (Conventional commits if any)
	const logRaw = sh(`git log ${tag}..HEAD --pretty=format:%H%x1f%s%x1f%an%x1f%ad --date=short`);
	if (!logRaw) return { grouped: {}, list: [] };
	const lines = logRaw.split("\n").map(l => {
		const [hash, subject, author, date] = l.split("\x1f");
		return { hash: hash.slice(0,7), subject, author, date };
	});
	const typeOf = (s) => {
		if (/^feat(\(.+\))?:/i.test(s)) return "Features";
		if (/^fix(\(.+\))?:/i.test(s))  return "Fixes";
		if (/^perf(\(.+\))?:/i.test(s)) return "Performance";
		if (/^refactor(\(.+\))?:/i.test(s)) return "Refactors";
		if (/^docs(\(.+\))?:/i.test(s)) return "Docs";
		if (/^chore(\(.+\))?:/i.test(s)) return "Chores";
		return "Other";
	};
	const grouped = {};
	for (const c of lines) {
		const t = typeOf(c.subject);
		grouped[t] = grouped[t] || [];
		grouped[t].push(c);
	}
	return { grouped, list: lines };
}

function renderChangelogSection(version, date, grouped, list) {
	const hasGroups = Object.keys(grouped).length > 0;
	let out = `## ${version} - ${date}\n`;
	if (hasGroups) {
		for (const k of ["Features","Fixes","Performance","Refactors","Docs","Chores","Other"]) {
			if (!grouped[k]?.length) continue;
			out += `\n### ${k}\n`;
			for (const c of grouped[k]) out += `- ${c.subject} (${c.hash}, ${c.date})\n`;
		}
	} else {
		for (const c of list) out += `- ${c.subject} (${c.hash}, ${c.date})\n`;
	}
	out += "\n";
	return out;
}

function writeChangelog(section) {
	const file = "CHANGELOG.md";
	const header = "# Changelog\n\n";
	if (!fs.existsSync(file)) {
		fs.writeFileSync(file, header + section, "utf8");
		return;
	}
	const prev = fs.readFileSync(file, "utf8");
	if (prev.startsWith("# Changelog")) {
		fs.writeFileSync(file, prev.replace(/^# Changelog\n\n?/, header + section), "utf8");
	} else {
		fs.writeFileSync(file, header + section + prev, "utf8");
	}
}

(async function main() {
	ensureCleanWorkingTree();

	const lastTag = getLastTag();
	const files = getChangesSince(lastTag);
	if (!files.length) {
		console.log(`No changes since ${lastTag}. Nothing to version.`);
		process.exit(0);
	}

	console.log(`Last tag: ${lastTag}`);
	console.log("Changes:\n - " + files.join("\n - "));

	let suggested = inferBump(files);
	if (DEFAULT_BUMP) suggested = DEFAULT_BUMP;

	const chosen = await ask("Bump type? (major/minor/patch)", suggested);
	if (!["major","minor","patch"].includes(chosen)) {
		console.error("Invalid type.");
		process.exit(1);
	}

	// current and next version
	const pkg = readPkg();
	let current = pkg?.version || "0.0.0";
	const next = bumpSemver(current, chosen);
	const confirmed = await ask(`Current version ${current}. New version`, next);
	const tagName = `v${confirmed}`;

	// PRETAG: show changelog
	const { grouped, list } = getChangelogSince(lastTag);
	const today = new Date().toISOString().slice(0,10);
	const preview = renderChangelogSection(tagName, today, grouped, list);

	console.log("\n=== PRETAG / CHANGELOG PREVIEW ===");
	console.log(preview);
	console.log("==================================\n");

	if (DRY_RUN) {
		console.log("Dry-run active: package.json not modified, no tags created, no push.");
		process.exit(0);
	}

	const ok = (await ask("Proceed with tag after reviewing changelog? (y/N)", "y"))
		.toLowerCase().startsWith("y");
	if (!ok) {
		console.log("Operation cancelled.");
		process.exit(0);
	}

	if (WRITE_CHANGELOG) {
		writeChangelog(preview);
		sh(`git add CHANGELOG.md`);
	}

	// Update package.json if exists
	if (pkg) {
		sh(`npm version ${confirmed} --no-git-tag-version`);
		sh(`git commit -am "chore(release): ${tagName}"`);
		console.log(`✅ package.json updated and commit created.`);
	} else {
		console.log("ℹ️ No package.json found. Skipping package update.");
	}

	const tagMsg = await ask("Tag message (annotated)", `release ${tagName}`);
	sh(`git tag -a ${tagName} -m "${tagMsg.replace(/"/g, '\\"')}"`);
	console.log(`🏷️  Tag created: ${tagName}`);

	const doPush = (await ask("Push to origin? (y/N)", "y")).toLowerCase().startsWith("y");
	if (doPush) {
		try { sh(`git push`); } catch {}
		sh(`git push origin ${tagName}`);
		console.log("⬆️  Tag (and commit if applicable) pushed to origin.");
	} else {
		console.log("⏭️  Push omitted. Reminder: git push && git push origin --tags");
	}

	console.log("Done ✅");
})().catch(err => {
	console.error(err.message || err);
	process.exit(1);
});
