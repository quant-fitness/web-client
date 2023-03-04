import type { HealthCheckResponse, HealthStatus } from '$lib/health-check-response';

const initialHealthCheckStatuses: HealthCheckResponse = {
	webClientCheck: 'skipped',
	apiCheck: 'skipped',
	databaseCheck: 'skipped'
};

const checkWebClientHealthBody = async (response: Response): Promise<HealthStatus> =>
	response
		.json()
		.then(({ data }) => (data === 'pong' ? 'responded-as-expected' : 'responded-unexpectedly'))
		.catch(() => 'responded-with-invalid-json');

const fetchWebClientHealth = async (fetch: any): Promise<HealthCheckResponse> => {
	try {
		const healthCheckResponse = await fetch('/internal/health-checks/web-client');

		if (!healthCheckResponse.ok) {
			return { ...initialHealthCheckStatuses, webClientCheck: 'responded-with-an-error' };
		}

		return checkWebClientHealthBody(healthCheckResponse).then((webClientCheck: HealthStatus) => ({
			...initialHealthCheckStatuses,
			webClientCheck
		}));
	} catch {
		return Promise.resolve({ ...initialHealthCheckStatuses, webClientCheck: 'failed-to-respond' });
	}
};

const fetchApiHealth = async (
	_fetch: any,
	responseSoFar: HealthCheckResponse
): Promise<HealthCheckResponse> => Promise.resolve(responseSoFar);

const fetchDatabaseHealth = async (
	_fetch: any,
	responseSoFar: HealthCheckResponse
): Promise<HealthCheckResponse> => Promise.resolve(responseSoFar);

export const fetchHealthChecks = async ({ fetch }: any): Promise<HealthCheckResponse> =>
	fetchWebClientHealth(fetch)
		.then(fetchApiHealth.bind(null, fetch))
		.then(fetchDatabaseHealth.bind(null, fetch));
