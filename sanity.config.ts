import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './sanity/schemaTypes';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET;
if (!projectId || !dataset) throw new Error('Uzupełnij SANITY_STUDIO_PROJECT_ID i SANITY_STUDIO_DATASET w .env.');

export default defineConfig({
  name: 'ecotech', title: 'Eco Tech Group', projectId, dataset,
  plugins: [structureTool()], schema: { types: schemaTypes },
});
