import type { PageLoad } from './$types';
import { fetchHealthChecks } from './fetch-health-checks';

export const load: PageLoad = fetchHealthChecks;
