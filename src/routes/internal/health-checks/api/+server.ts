import { json, type RequestHandler } from '@sveltejs/kit';
import { fetchApiHealth } from './fetch-api-health';

export const GET: RequestHandler = async ({ fetch }) => {
	const healthCheck = await fetchApiHealth({ fetch });
	return json({ data: healthCheck });
};
