// Hand-written English copy for each project.
// Image paths come from projects.generated.js (produced by scripts/import-assets.mjs).

import { generatedProjects } from './projects.generated.js';

const COPY = {
  acharnon:           { name: 'Acharnon',                   location: 'Athens',  units: 60,  sqm: 3000,   status: 'completed',    description: '' },
  'athens-city-hotel':{ name: 'Benjamin Athens City Hotel', location: 'Athens',  units: 45,  sqm: 200,    status: 'completed',    description: '', unitLabel: 'Rooms' },
  chrisopoleos:       { name: 'Chrisopoleos',               location: 'Athens',  units: 13,  sqm: 500,    status: 'completed',    description: '' },
  egaleo:             { name: 'Egaleo',                     location: 'Athens',  units: 8,   sqm: 500,    status: 'completed',    description: '', rented: true },
  evia:               { name: 'Evia Hotel',                 location: 'Evia',    units: 200, sqm: 10000,  status: 'completed',    description: 'Private beach · 10,000 sqm plot', unitLabel: 'Rooms' },
  gyzi:               { name: 'Gyzi',                       location: 'Athens',  units: 10,  sqm: 400,    status: 'completed',    description: '' },
  ilioupoli:          { name: 'Ilioupoli',                  location: 'Athens',  units: 25,  sqm: 1000,   status: 'construction', description: '' },
  kypseli:            { name: 'Kypseli',                    location: 'Athens',  units: 11,  sqm: 1000,   status: 'completed',    description: '', rented: true },
  nikia:              { name: 'Nikia N45',                  location: 'Piraeus', units: 7,   sqm: 200,    status: 'construction', description: '' },
  pergamou:           { name: 'Pergamou',                   location: 'Athens',  units: 10,  sqm: 700,    status: 'completed',    description: '', goldenVisa: true },
  peristeri:          { name: 'Peristeri',                  location: 'Athens',  units: 11,  sqm: 1000,   status: 'completed',    description: '', rented: true, mixedUse: true },
  redestou:           { name: 'Redestou',                   location: 'Athens',  units: 20,  sqm: 1000,   status: 'completed',    description: '' },
  sepolia:            { name: 'Sepolia',                    location: 'Athens',  units: 28,  sqm: 1500,   status: 'construction', description: '' },
  serifou:            { name: 'Serifou',                    location: 'Athens',  units: 20,  sqm: 1000,   status: 'completed',    description: '' },
  thermopilon:        { name: 'Thermopilon',                location: 'Athens',  units: 10,  sqm: 350,    status: 'completed',    description: '' },
  volou:              { name: 'Volou',                      location: 'Athens',  units: 10,  sqm: 350,    status: 'completed',    description: '' },
  vyronas2:           { name: 'Vyronas',                    location: 'Athens',  units: 10,  sqm: 400,    status: 'completed',    description: '' },
  zografou:           { name: 'Zografou',                   location: 'Athens',  units: 10,  sqm: 500,    status: 'completed',    description: '' },
};

export const STATUS_LABELS = {
  'completed':    'Completed',
  'construction': 'Under Construction',
  'planning':     'In Planning',
  'for-sale':     'For Sale',
};

// Company-level stats shown on the intro hero
export const COMPANY_STATS = [
  { value: '40+',   label: 'Projects' },
  { value: '500+',  label: 'Apartments Delivered' },
  { value: '250',   label: 'Owned Apartments' },
  { value: '3',     label: 'Hotels' },
  { value: '€100M+', label: 'Invested' },
];

export const PROJECTS = generatedProjects.map(g => ({
  ...COPY[g.slug],
  slug: g.slug,
  hero: g.hero,
  galleries: g.galleries,
}));
