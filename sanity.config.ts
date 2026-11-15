import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './sanity/schemaTypes';
import { LeadStatistics } from './sanity/LeadStatistics';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET;
if (!projectId || !dataset) throw new Error('Uzupełnij SANITY_STUDIO_PROJECT_ID i SANITY_STUDIO_DATASET w .env.');

export default defineConfig({
  name: 'ecotech', title: 'Eco Tech Group', projectId, dataset,
  plugins: [structureTool({ structure: S => S.list().title('Treści').items(S.documentTypeListItems().filter(item => item.getId() !== 'leadStatistic')) })],
  schema: { types: schemaTypes, templates: templates => templates.filter(template => template.schemaType !== 'leadStatistic') },
  document: { actions: (actions, context) => context.schemaType === 'leadStatistic' ? [] : actions },
  tools: [{ name: 'lead-statistics', title: 'Statystyki formularzy', component: LeadStatistics }],
});
