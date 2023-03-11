import { test as base } from '@playwright/test';

type User = {
	id: string;
	emailAddress: string;
	createdAt: string;
	updatedAt: string;
};

type UserFixture = {
	user: User;
};

export const test = base.extend<UserFixture>({
	user: async ({ playwright, baseURL }, use) => {
		const createUserRequest = await fetch(`${baseURL}/internal/users`, {
			method: 'POST',
			body: JSON.stringify({ user: { emailAddress: `some.email${Math.random()}@something.org` } })
		});

		const { data } = await createUserRequest.json();

		use(data);

		const deleteUserRequest = await fetch(`${baseURL}/internal/users/${data.id}`, {
			method: 'DELETE'
		});
	}
});

export { expect } from '@playwright/test';
