import { GET } from './+server';

it('returns pong', async () => {
	const requestEvent = {} as any;
	const response = await GET(requestEvent);
	const { data } = await response.json();
	expect(data).toEqual('pong');
});
