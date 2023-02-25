import type { HealthStatus } from '../health-check-response';
import { API_BASE_URL } from '$env/static/private';

const checkApiHealthBody = async (response: Response): Promise<HealthStatus> =>
	response
		.json()
		.then(({ data }) => (data === 'pong' ? 'responded-as-expected' : 'responded-unexpectedly'))
		.catch(() => 'responded-with-invalid-json');

export const fetchApiHealth = async ({ fetch }: any) => {
	try {
		const healthCheckResponse = await fetch(`${API_BASE_URL}/api/v1/ping`);
		return !healthCheckResponse.ok
			? 'responded-with-an-error'
			: checkApiHealthBody(healthCheckResponse);
	} catch (e) {
		return 'failed-to-respond';
	}
};
