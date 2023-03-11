// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { expect, test } from '../../fixtures.ts';

test('GET /internal/users lists the users', async ({ user, baseURL }: any) => {
	const listUsersRequest = await fetch(`${baseURL}/internal/users`);

	const { data } = await listUsersRequest.json();

	expect(data).toContainEqual(user);
});
