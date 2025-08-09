function getChangelogBetween(oldRev, newRev) {
	const delimiter = "----DELIM----";
	// Use a delimiter to separate commit messages.
	const logRaw = sh(
		`git log ${oldRev}..${newRev} --pretty=format:"%B${delimiter}%h, %ad" --date=short`
	);
	if (!logRaw.trim()) return "";
	// Split raw log into commit entries using the delimiter.
	const commitEntries = logRaw.split(delimiter).filter(entry => entry.trim().length > 0);

	const formattedCommits = commitEntries.map(entry => {
		const lines = entry.trim().split("\n");
		// The last line is metadata (hash and date).
		const meta = lines.pop().trim();
		const message = lines.join("\n").trim();
		if (!message) return `- (${meta})`;
		// Format the commit:
		// • The first line gets a bullet and metadata appended.
		// • Subsequent lines are indented.
		const messageLines = message.split("\n");
		let formatted = `- ${messageLines[0]} (${meta})\n`;
		for (let i = 1; i < messageLines.length; i++) {
			formatted += `  ${messageLines[i]}\n`;
		}
		return formatted.trim();
	});
	return formattedCommits.join("\n");
}
