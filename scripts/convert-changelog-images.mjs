import sharp from 'sharp';
import { readFileSync, writeFileSync, unlinkSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

const STATIC_DIR = 'static/changelog';
const CHANGELOG_DIR = 'src/lib/changelog';
const QUALITY = 80;

function findPngs(dir) {
	const results = [];
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const fullPath = join(dir, entry.name);
		if (entry.isDirectory()) {
			results.push(...findPngs(fullPath));
		} else if (entry.name.endsWith('.png')) {
			results.push(fullPath);
		}
	}
	return results;
}

const pngs = findPngs(STATIC_DIR);

if (pngs.length === 0) {
	console.log('No PNGs found in static/changelog/ — nothing to convert.');
	process.exit(0);
}

console.log(`Converting ${pngs.length} PNG(s) to WebP...`);

for (const png of pngs) {
	const webp = png.replace(/\.png$/, '.webp');
	await sharp(png).webp({ quality: QUALITY }).toFile(webp);
	const pngSize = statSync(png).size;
	const webpSize = statSync(webp).size;
	const savings = Math.round((1 - webpSize / pngSize) * 100);
	console.log(`  ${relative('.', png)} → .webp (${savings}% smaller)`);
	unlinkSync(png);
}

// Update markdown references
const mdFiles = readdirSync(CHANGELOG_DIR).filter((f) => f.endsWith('.md'));
let updatedCount = 0;

for (const mdFile of mdFiles) {
	const mdPath = join(CHANGELOG_DIR, mdFile);
	const content = readFileSync(mdPath, 'utf-8');
	const updated = content.replace(/\/changelog\/([^)]+)\.png/g, '/changelog/$1.webp');
	if (updated !== content) {
		writeFileSync(mdPath, updated);
		updatedCount++;
		console.log(`  Updated references in ${mdFile}`);
	}
}

console.log(`Done. Converted ${pngs.length} image(s), updated ${updatedCount} markdown file(s).`);
