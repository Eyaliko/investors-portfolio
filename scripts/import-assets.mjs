// Import source project images from "new excellent-april2026/Projects"
// into public/images/<slug>/ as optimized WebPs.
// Emits src/data/projects.generated.js with hero + phase-grouped gallery paths.

import { readdir, stat, mkdir, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname, basename } from 'node:path';
import sharp from 'sharp';

const SOURCE_ROOT = 'C:/Users/User/new excellent-april2026';
const SOURCE_PROJECTS = join(SOURCE_ROOT, 'Projects');
const SOURCE_ANO_PATISIA = join(SOURCE_ROOT, 'Ano Patisia');

const OUT_ROOT = 'C:/Users/User/investors-portfolio';
const OUT_IMAGES = join(OUT_ROOT, 'public/images');
const OUT_DATA = join(OUT_ROOT, 'src/data/projects.generated.js');

const IMG_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

// Hero: 3 widths for responsive <picture>. Gallery: single 1280w for lightbox.
const HERO_WIDTHS = [640, 1280, 1920];
const GALLERY_WIDTH = 1280;
const WEBP_QUALITY_HERO = 80;
const WEBP_QUALITY_GALLERY = 78;

// Cap per phase to keep initial load small; user can expand later.
const MAX_PER_PHASE = 4;

function phaseFor(folderName) {
  const s = folderName.toLowerCase();
  // Hebrew keywords
  if (s.includes('הדמיות') || s.includes('הדמיה')) return 'renderings';
  if (s.includes('לפני')) return 'before';
  if (s.includes('אחרי')) return 'after';
  if (s.includes('רחפן')) return 'drone';
  if (s.includes('במהלך') || s.includes('בזמן')) return 'during';
  // English keywords
  if (s.includes('before')) return 'before';
  if (s.includes('middle')) return 'during';
  if (s.includes('renovation') || s.includes('construction')) return 'during';
  if (s.includes('drone after') || s.includes('drone finished') || s.includes('drone ready')) return 'after';
  if (s.includes('rendering') || s.includes('rednering') || s.includes('design') || s.includes('placement')) return 'renderings';
  if (s.includes('drone')) return 'drone';
  return 'after';
}

// Hero priority: drone-after > after > exterior > anything
function heroPriority(folderName) {
  const s = folderName.toLowerCase();
  if (s.includes('drone after') || s.includes('drone finished') || s.includes('drone ready')) return 1;
  if (s === 'after' || s.includes('ready')) return 2;
  if (s.includes('external') || s.includes('exterior')) return 3;
  if (phaseFor(folderName) === 'renderings' && (s.includes('exterior') || s.includes('external'))) return 4;
  if (phaseFor(folderName) === 'renderings') return 5;
  return 6;
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
  files.sort((a, b) => b.size - a.size); // biggest first
  return files;
}

async function listSubfolders(dir) {
  if (!existsSync(dir)) return [];
  const entries = await readdir(dir, { withFileTypes: true });
  return entries.filter(e => e.isDirectory()).map(e => e.name);
}

// Collect (folderName, imageFiles) pairs walking up to 2 levels deep.
// If a folder contains no images but has subfolders, walk into those.
// The folder name used for phase classification is the deepest non-empty
// folder's name, combined with its parent name (so "Rendering/Exteriors"
// still classifies correctly via either keyword).
async function collectLeaves(rootDir) {
  const leaves = [];
  const topFolders = await listSubfolders(rootDir);
  for (const top of topFolders) {
    const topPath = join(rootDir, top);
    const files = await listImages(topPath);
    if (files.length) {
      leaves.push({ folderName: top, files });
      continue;
    }
    // Recurse one level
    const nested = await listSubfolders(topPath);
    for (const inner of nested) {
      const innerPath = join(topPath, inner);
      const innerFiles = await listImages(innerPath);
      if (innerFiles.length) {
        // Combine names so phaseFor() and heroPriority() can see both keywords
        leaves.push({ folderName: `${top} ${inner}`, files: innerFiles });
      }
    }
  }
  return leaves;
}

async function writeHero(srcPath, outDir) {
  await mkdir(outDir, { recursive: true });
  const results = {};
  const image = sharp(srcPath, { failOn: 'none' }).rotate();
  for (const w of HERO_WIDTHS) {
    const out = join(outDir, `hero-${w}.webp`);
    await image
      .clone()
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY_HERO, effort: 5 })
      .toFile(out);
    results[w] = `/images/${basename(outDir)}/hero-${w}.webp`;
  }
  return results;
}

async function writeGalleryImage(srcPath, outDir, phase, idx) {
  const out = join(outDir, `${phase}-${String(idx).padStart(2, '0')}.webp`);
  await sharp(srcPath, { failOn: 'none' })
    .rotate()
    .resize({ width: GALLERY_WIDTH, withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY_GALLERY, effort: 5 })
    .toFile(out);
  return `/images/${basename(outDir)}/${phase}-${String(idx).padStart(2, '0')}.webp`;
}

async function processProject({ slug, displayName, sourceDir }) {
  console.log(`\n→ ${displayName} (${slug})`);
  const outDir = join(OUT_IMAGES, slug);
  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });

  const leaves = await collectLeaves(sourceDir);
  if (!leaves.length) {
    console.log(`  ⚠ no images found, skipping`);
    return null;
  }

  // Group files by phase
  const byPhase = { before: [], during: [], after: [], renderings: [], drone: [] };
  const ranked = leaves
    .map(l => ({ ...l, priority: heroPriority(l.folderName), phase: phaseFor(l.folderName) }))
    .sort((a, b) => a.priority - b.priority);

  for (const { files, phase } of ranked) {
    for (const file of files) byPhase[phase].push(file);
  }

  // Hero = first image of highest-priority leaf
  const heroSrc = ranked[0].files[0].full;

  const hero = await writeHero(heroSrc, outDir);
  console.log(`  hero ✓`);

  // Gallery: up to MAX_PER_PHASE per phase. Skip the hero file to avoid duplication.
  const gallery = {};
  for (const phase of ['before', 'during', 'after', 'renderings', 'drone']) {
    const items = [];
    let idx = 1;
    for (const file of byPhase[phase]) {
      if (file.full === heroSrc) continue;
      if (items.length >= MAX_PER_PHASE) break;
      const p = await writeGalleryImage(file.full, outDir, phase, idx++);
      items.push(p);
    }
    if (items.length) gallery[phase] = items;
  }
  const summary = Object.entries(gallery).map(([k, v]) => `${k}:${v.length}`).join(' ');
  console.log(`  gallery: ${summary || '(none)'}`);

  return { slug, displayName, hero, gallery };
}

const PROJECTS = [
  { slug: 'acharnon',     displayName: 'Acharnon',     sourceDir: join(SOURCE_PROJECTS, 'Acharnon') },
  { slug: 'ano-patisia',  displayName: 'Ano Patisia',  sourceDir: SOURCE_ANO_PATISIA },
  { slug: 'chrisopoleos', displayName: 'Chrisopoleos', sourceDir: join(SOURCE_PROJECTS, 'Chrisopoleos') },
  { slug: 'gyzi',         displayName: 'Gyzi',         sourceDir: join(SOURCE_PROJECTS, 'Gyzi') },
  { slug: 'ilioupoli',    displayName: 'Ilioupoli',    sourceDir: join(SOURCE_PROJECTS, 'Ilioupoli') },
  { slug: 'nikia',        displayName: 'Nikia',        sourceDir: join(SOURCE_PROJECTS, 'Nikia') },
  { slug: 'pergamou',     displayName: 'Pergamou',     sourceDir: join(SOURCE_PROJECTS, 'Pergamou') },
  { slug: 'redestou',     displayName: 'Redestou',     sourceDir: join(SOURCE_PROJECTS, 'Redestou') },
  { slug: 'sepolia',      displayName: 'Sepolia',      sourceDir: join(SOURCE_PROJECTS, 'Sepolia') },
  { slug: 'serifou',      displayName: 'Serifou',      sourceDir: join(SOURCE_PROJECTS, 'Serifou') },
  { slug: 'thermopilon',  displayName: 'Thermopilon',  sourceDir: join(SOURCE_PROJECTS, 'Thermopilon') },
  { slug: 'volou',        displayName: 'Volou',        sourceDir: join(SOURCE_PROJECTS, 'Volou') },
  { slug: 'vyronas2',     displayName: 'Vyronas',      sourceDir: join(SOURCE_PROJECTS, 'Vyronas2') },
  { slug: 'zografou',     displayName: 'Zografou',     sourceDir: join(SOURCE_PROJECTS, 'Zografou') },
];

async function main() {
  await mkdir(OUT_IMAGES, { recursive: true });
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
