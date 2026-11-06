import { maintenanceResponse } from '../../src/lib/maintenance.mjs';

export default function () {
  if (Netlify.env.get('MAINTENANCE_MODE')?.toLowerCase() === 'true') {
    return maintenanceResponse();
  }
}

export const config = { path: '/*' };
