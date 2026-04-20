// Hand-written Hebrew copy for each project.
// Image paths come from projects.generated.js (produced by scripts/import-assets.mjs).
// Merge happens at runtime — edit names, locations, units, year, status, description here.

import { generatedProjects } from './projects.generated.js';

// Order: mirrors generated order (alphabetical). Edit to reorder the reel.
const COPY = {
  acharnon:     { name: 'אחרנון',       location: 'אתונה',        units: null, year: null, status: 'הושלם',      description: '[תיאור ממוקם יתווסף]' },
  'ano-patisia':{ name: 'אנו פאטיסיה',  location: 'אתונה',        units: null, year: null, status: 'בתכנון',     description: '[תיאור ממוקם יתווסף]' },
  chrisopoleos: { name: 'חריסופוליאוס', location: 'אתונה',        units: null, year: null, status: 'בתכנון',     description: '[תיאור ממוקם יתווסף]' },
  gyzi:         { name: 'גיזי',         location: 'אתונה',        units: null, year: null, status: 'הושלם',      description: '[תיאור ממוקם יתווסף]' },
  ilioupoli:    { name: 'איליופולי',    location: 'אתונה',        units: null, year: null, status: 'בבנייה',     description: '[תיאור ממוקם יתווסף]' },
  nikia:        { name: 'ניקייה N45',   location: 'פיראוס',       units: null, year: null, status: 'למכירה',    description: '[תיאור ממוקם יתווסף]' },
  pergamou:     { name: 'פרגאמו',       location: 'אתונה',        units: null, year: null, status: 'הושלם',      description: '[תיאור ממוקם יתווסף]' },
  redestou:     { name: 'רדסטו',        location: 'אתונה',        units: null, year: null, status: 'בתכנון',     description: '[תיאור ממוקם יתווסף]' },
  sepolia:      { name: 'ספוליה',       location: 'אתונה',        units: null, year: null, status: 'בבנייה',     description: '[תיאור ממוקם יתווסף]' },
  serifou:      { name: 'סריפו',        location: 'אתונה',        units: null, year: null, status: 'בבנייה',     description: '[תיאור ממוקם יתווסף]' },
  thermopilon:  { name: 'ת׳רמופילון',   location: 'אתונה',        units: null, year: null, status: 'הושלם',      description: '[תיאור ממוקם יתווסף]' },
  volou:        { name: 'וולו',         location: 'אתונה',        units: null, year: null, status: 'בתכנון',     description: '[תיאור ממוקם יתווסף]' },
  vyronas2:     { name: 'וירונאס',      location: 'אתונה',        units: null, year: null, status: 'בתכנון',     description: '[תיאור ממוקם יתווסף]' },
  zografou:     { name: 'זוגרפו',       location: 'אתונה',        units: null, year: null, status: 'הושלם',      description: '[תיאור ממוקם יתווסף]' },
};

export const PROJECTS = generatedProjects.map(g => ({
  ...COPY[g.slug],
  slug: g.slug,
  hero: g.hero,     // { 640, 1280, 1920 }
  gallery: g.gallery,
}));

// Aggregate stats for the closing slide
export const STATS = {
  projects: PROJECTS.length,
  neighborhoods: new Set(PROJECTS.map(p => p.location)).size,
  yearsActive: 10,   // [update when you have actual data]
};

export const CONTACT = {
  phone: '+972-0-000-0000',   // [update]
  email: 'info@excl-group.com',
  whatsapp: '972000000000',   // [update — international format without +]
};
