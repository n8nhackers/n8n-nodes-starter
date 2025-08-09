#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Helper to run shell commands.
function sh(cmd) {
	return execSync(cmd, { encoding: "utf8" }).trim();
}

// Get the last tag from git (or initial commit as fallback).
function getLastTag() {
	try {
		return sh("git describe --tags --abbrev=0");
	} catch {
		return sh("git rev-list --max-parents=0 HEAD");
	}
}

// Build a changelog summary since the given tag using conventional commit types.
function getChangelogSince(tag) {
	// Format: hash, subject, author, date (using a delimiter)
	const logRaw = sh(
		`git log ${tag}..HEAD --pretty=format:%H%x1f%s%x1f%an%x1f%ad --date=short`
	);
	if (!logRaw) return { grouped: {}, list: [] };

	const commits = logRaw.split("\n").map(line => {
		const [hash, subject, author, date] = line.split("\x1f");
		return { hash: hash.slice(0, 7), subject, author, date };
	});

	// Determine commit type using conventional commit prefixes.
	const typeOf = (s) => {
		if (/^feat(\(.+\))?:/i.test(s)) return "Features";
		if (/^fix(\(.+\))?:/i.test(s)) return "Fixes";
		if (/^perf(\(.+\))?:/i.test(s)) return "Performance";
		if (/^refactor(\(.+\))?:/i.test(s)) return "Refactors";
		if (/^docs(\(.+\))?:/i.test(s)) return "Docs";
		if (/^chore(\(.+\))?:/i.test(s)) return "Chores";
		return "Other";
	};

	const grouped = {};
	for (const commit of commits) {
		const group = typeOf(commit.subject);
		if (!grouped[group]) grouped[group] = [];
		grouped[group].push(commit);
	}

	return { grouped, list: commits };
}

// Render a changelog section given a version, date, and commit data.
function renderChangelogSection(version, date, grouped, list) {
	let out = `## ${version} - ${date}\n`;
	const groupsOrder = ["Features", "Fixes", "Performance", "Refactors", "Docs", "Chores", "Other"];
	let hasGroups = false;
	for (const groupName of groupsOrder) {
		if (grouped[groupName] && grouped[groupName].length) {
			hasGroups = true;
			out += `\n### ${groupName}\n`;
			for (const commit of grouped[groupName]) {
				out += `- ${commit.subject} (${commit.hash}, ${commit.date})\n`;
			}
		}
	}
	// Fallback: if no conventional types were detected.
	if (!hasGroups) {
		for (const commit of list) {
			out += `- ${commit.subject} (${commit.hash}, ${commit.date})\n`;
		}
	}
	out += "\n";
	return out;
}

// Update the CHANGELOG.md file by inserting (or replacing) a changelog section.
function writeChangelog(section) {
	const changelogFile = path.join(process.cwd(), "CHANGELOG.md");
	const header = "# Changelog\n\n";
	let content;
	if (fs.existsSync(changelogFile)) {
		content = fs.readFileSync(changelogFile, "utf8");
		if (content.startsWith("# Changelog")) {
			// Replace the header and first section.
			content = content.replace(/^# Changelog\n\n?/, header + section);
		} else {
			// Prepend the header and new section.
			content = header + section + content;
		}
	} else {
		content = header + section;
	}
	fs.writeFileSync(changelogFile, content, "utf8");
}

// Determine revision range:
// If arguments are provided, use them; otherwise, use the latest tag as the starting point.
let oldRev, newRev;
if (process.argv.length > 2) {
	oldRev = process.argv[2];
	newRev = process.argv[3] || "HEAD";
} else {
	oldRev = getLastTag();
	newRev = "HEAD";
}

// Get commit changelog data since oldRev.
const { grouped, list } = getChangelogSince(oldRev);
const today = new Date().toISOString().slice(0, 10);
// Use "Unreleased" as the current version label.
const section = renderChangelogSection("Unreleased", today, grouped, list);
writeChangelog(section);
console.log("CHANGELOG.md generated.");
