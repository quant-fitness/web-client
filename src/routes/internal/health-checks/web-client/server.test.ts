import { GET } from './+server';

it('returns pong', async () => {
	const requestEvent = {};
	const response = await GET(requestEvent as any);
	const { data } = await response.json();
	expect(data).toEqual('pong');
});
