// Import source project images from "new excellent-april2026/Projects"
// into public/images/<slug>/ as optimized WebPs. Every image is imported —
// no per-phase cap. Each source subfolder becomes a named gallery tab.

import { readdir, stat, mkdir, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname, basename } from 'node:path';
import sharp from 'sharp';

const SOURCE_ROOT = 'C:/Users/User/new excellent-april2026';
const SOURCE_PROJECTS = join(SOURCE_ROOT, 'Projects');

const OUT_ROOT = 'C:/Users/User/investors-portfolio';
const OUT_IMAGES = join(OUT_ROOT, 'public/images');
const OUT_DATA = join(OUT_ROOT, 'src/data/projects.generated.js');

const IMG_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

// Hero: 3 widths for responsive <picture>. Gallery: 640 + 1280 (thumbnail + zoom).
const HERO_WIDTHS = [640, 1280, 1920];
const GALLERY_THUMB_WIDTH = 640;
const GALLERY_FULL_WIDTH = 1600;
const WEBP_QUALITY_HERO = 80;
const WEBP_QUALITY_GALLERY = 78;
const WEBP_QUALITY_THUMB = 74;

// Which source folder should supply the slide hero (priority order).
function heroPriority(folderName) {
  const s = folderName.toLowerCase();
  if (s.includes('drone after') || s.includes('drone finished') || s.includes('drone ready')) return 1;
  if (s === 'after' || s.includes('ready')) return 2;
  if (s.includes('external') || s.includes('exterior')) return 3;
  if (s.includes('rendering') || s.includes('rednering') || s.includes('design') || s.includes('placement')) return 5;
  if (s.includes('drone')) return 4;
  if (s.includes('before')) return 8;
  return 6;
}

// Human-readable title for a source folder. Fix common typos, Hebrew, casing.
function prettyTitle(folderName) {
  const map = {
    'הדמיות פנים': 'Interior Renderings',
    'הדמיות חוץ': 'Exterior Renderings',
    'הדמיות': 'Renderings',
  };
  if (map[folderName]) return map[folderName];
  let t = folderName
    .replace(/\bInteror\b/gi, 'Interior')
    .replace(/\bRednering/gi, 'Rendering')
    .replace(/\brenderingts?\b/gi, 'Renderings')
    .replace(/\bapts\b/gi, 'Apartments')
    .replace(/\bExteriors?\b/gi, (m) => m[0].toUpperCase() + m.slice(1).toLowerCase())
    .replace(/\s+/g, ' ')
    .trim();
  // Title case
  t = t.split(' ').map(w => w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : '').join(' ');
  return t;
}

async function listImages(dir) {
  if (!existsSync(dir)) return [];
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    if (!e.isFile()) continue;
    if (IMG_EXTS.has(extname(e.name).toLowerCase())) {
      const full = join(dir, e.name);
      const st = await stat(full);
      files.push({ full, name: e.name, size: st.size });
    }
  }
  files.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
  return files;
}

async function listSubfolders(dir) {
  if (!existsSync(dir)) return [];
  const entries = await readdir(dir, { withFileTypes: true });
  return entries.filter(e => e.isDirectory()).map(e => e.name);
}

// Walk up to 2 levels deep. Each leaf folder (containing images) becomes one gallery.
// For nested paths, the deepest folder name is used as the gallery title.
// If the root itself contains images (flat structure) and their filenames follow
// the pattern "N_Label_*.ext", group them by "Label" so tabs still work.
async function collectLeaves(rootDir) {
  const leaves = [];
  const rootFiles = await listImages(rootDir);
  if (rootFiles.length) {
    const buckets = new Map(); // label -> { order, files }
    const djiFiles = [];
    const unprefixed = [];
    for (const f of rootFiles) {
      const m = f.name.match(/^(\d+)_([^_]+?)_/);
      if (m) {
        const order = parseInt(m[1], 10);
        const label = m[2].trim();
        if (!buckets.has(label)) buckets.set(label, { order, files: [] });
        buckets.get(label).files.push(f);
      } else if (/^DJI[_-]/i.test(f.name)) {
        djiFiles.push(f);
      } else {
        unprefixed.push(f);
      }
    }
    // Emit labeled buckets in prefix-number order
    const ordered = [...buckets.entries()].sort((a, b) => a[1].order - b[1].order);
    for (const [label, { files }] of ordered) leaves.push({ folderName: label, files });
    if (djiFiles.length) leaves.push({ folderName: 'Drone', files: djiFiles });
    if (unprefixed.length) leaves.push({ folderName: 'Gallery', files: unprefixed });
    if (leaves.length) return leaves;
  }

  const topFolders = await listSubfolders(rootDir);
  for (const top of topFolders) {
    const topPath = join(rootDir, top);
    const files = await listImages(topPath);
    if (files.length) {
      leaves.push({ folderName: top, files });
      continue;
    }
    const nested = await listSubfolders(topPath);
    for (const inner of nested) {
      const innerPath = join(topPath, inner);
      const innerFiles = await listImages(innerPath);
      if (innerFiles.length) leaves.push({ folderName: inner, files: innerFiles });
    }
  }
  return leaves;
}

async function writeHero(srcPath, outDir, slug) {
  await mkdir(outDir, { recursive: true });
  const results = {};
  const image = sharp(srcPath, { failOn: 'none' }).rotate();
  for (const w of HERO_WIDTHS) {
    await image
      .clone()
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY_HERO, effort: 5 })
      .toFile(join(outDir, `hero-${w}.webp`));
    results[w] = `/images/${slug}/hero-${w}.webp`;
  }
  return results;
}

async function writeGalleryImage(srcPath, outDir, slug, galleryId, idx) {
  const base = `${galleryId}-${String(idx).padStart(2, '0')}`;
  await sharp(srcPath, { failOn: 'none' })
    .rotate()
    .resize({ width: GALLERY_THUMB_WIDTH, withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY_THUMB, effort: 5 })
    .toFile(join(outDir, `${base}-thumb.webp`));
  await sharp(srcPath, { failOn: 'none' })
    .rotate()
    .resize({ width: GALLERY_FULL_WIDTH, withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY_GALLERY, effort: 5 })
    .toFile(join(outDir, `${base}.webp`));
  return {
    thumb: `/images/${slug}/${base}-thumb.webp`,
    full:  `/images/${slug}/${base}.webp`,
  };
}

function galleryIdFromTitle(title, used) {
  let base = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'gallery';
  let id = base;
  let n = 2;
  while (used.has(id)) { id = `${base}-${n++}`; }
  used.add(id);
  return id;
}

async function processProject({ slug, displayName, sourceDir }) {
  console.log(`\n→ ${displayName} (${slug})`);
  const outDir = join(OUT_IMAGES, slug);
  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });

  const leaves = await collectLeaves(sourceDir);
  if (!leaves.length) { console.log(`  ⚠ no images, skipping`); return null; }

  // Sort leaves by hero-priority so the hero source is first
  const ranked = leaves
    .map(l => ({ ...l, priority: heroPriority(l.folderName) }))
    .sort((a, b) => a.priority - b.priority);

  // Hero = first image of highest-priority leaf (also stays in its gallery)
  const heroSrc = ranked[0].files[0].full;
  const hero = await writeHero(heroSrc, outDir, slug);
  console.log(`  hero ✓`);

  // Process every image into its source gallery
  const galleries = [];
  const usedIds = new Set(['hero']);
  for (const leaf of ranked) {
    const title = prettyTitle(leaf.folderName);
    const galleryId = galleryIdFromTitle(title, usedIds);
    const images = [];
    let idx = 1;
    for (const file of leaf.files) {
      images.push(await writeGalleryImage(file.full, outDir, slug, galleryId, idx++));
    }
    galleries.push({ id: galleryId, title, count: images.length, images });
  }
  const summary = galleries.map(g => `${g.title}:${g.count}`).join(' · ');
  console.log(`  galleries: ${summary}`);

  return { slug, displayName, hero, galleries };
}

// Ano Patisia intentionally excluded.
const PROJECTS = [
  { slug: 'acharnon',          displayName: 'Acharnon',                   sourceDir: join(SOURCE_PROJECTS, 'Acharnon') },
  { slug: 'athens-city-hotel', displayName: 'Benjamin Athens City Hotel', sourceDir: join(SOURCE_PROJECTS, 'Athens City Hotel') },
  { slug: 'chrisopoleos',      displayName: 'Chrisopoleos',               sourceDir: join(SOURCE_PROJECTS, 'Chrisopoleos') },
  { slug: 'egaleo',            displayName: 'Egaleo',                     sourceDir: join(SOURCE_PROJECTS, 'Egaleo') },
  { slug: 'evia',              displayName: 'Evia Hotel',                 sourceDir: join(SOURCE_PROJECTS, 'Evia') },
  { slug: 'gyzi',              displayName: 'Gyzi',                       sourceDir: join(SOURCE_PROJECTS, 'Gyzi') },
  { slug: 'ilioupoli',         displayName: 'Ilioupoli',                  sourceDir: join(SOURCE_PROJECTS, 'Ilioupoli') },
  { slug: 'kypseli',           displayName: 'Kypseli',                    sourceDir: join(SOURCE_PROJECTS, 'Kypseli') },
  { slug: 'nikia',             displayName: 'Nikia N45',                  sourceDir: join(SOURCE_PROJECTS, 'Nikia') },
  { slug: 'pergamou',          displayName: 'Pergamou',                   sourceDir: join(SOURCE_PROJECTS, 'Pergamou') },
  { slug: 'peristeri',         displayName: 'Peristeri',                  sourceDir: join(SOURCE_PROJECTS, 'Peristeri') },
  { slug: 'redestou',          displayName: 'Redestou',                   sourceDir: join(SOURCE_PROJECTS, 'Redestou') },
  { slug: 'sepolia',           displayName: 'Sepolia',                    sourceDir: join(SOURCE_PROJECTS, 'Sepolia') },
  { slug: 'serifou',           displayName: 'Serifou',                    sourceDir: join(SOURCE_PROJECTS, 'Serifou') },
  { slug: 'thermopilon',       displayName: 'Thermopilon',                sourceDir: join(SOURCE_PROJECTS, 'Thermopilon') },
  { slug: 'volou',             displayName: 'Volou',                      sourceDir: join(SOURCE_PROJECTS, 'Volou') },
  { slug: 'vyronas2',          displayName: 'Vyronas',                    sourceDir: join(SOURCE_PROJECTS, 'Vyronas2') },
  { slug: 'zografou',          displayName: 'Zografou',                   sourceDir: join(SOURCE_PROJECTS, 'Zografou') },
];

async function main() {
  await mkdir(OUT_IMAGES, { recursive: true });
  // Clean any projects that were previously imported but shouldn't be now (e.g., Ano Patisia)
  const allowedSlugs = new Set(PROJECTS.map(p => p.slug));
  if (existsSync(OUT_IMAGES)) {
    for (const entry of await readdir(OUT_IMAGES, { withFileTypes: true })) {
      if (entry.isDirectory() && !allowedSlugs.has(entry.name)) {
        await rm(join(OUT_IMAGES, entry.name), { recursive: true, force: true });
        console.log(`(removed stale project dir: ${entry.name})`);
      }
    }
  }

  const results = [];
  for (const p of PROJECTS) {
    const r = await processProject(p);
    if (r) results.push(r);
  }

  const lines = [
    '// AUTO-GENERATED by scripts/import-assets.mjs — do not edit.',
    '// Hand-written copy lives in src/data/projects.js and is merged at import time.',
    '',
    'export const generatedProjects = ' + JSON.stringify(results, null, 2) + ';',
    '',
  ];
  await writeFile(OUT_DATA, lines.join('\n'), 'utf8');
  console.log(`\n✓ Wrote ${results.length} projects to ${OUT_DATA}`);
}

main().catch(err => { console.error(err); process.exit(1); });
