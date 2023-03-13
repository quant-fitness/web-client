import { redirect } from '@sveltejs/kit';
import { createAuthenticationToken } from './create-authentication-token';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, fetch }: any) => {
	const searchParams = url.searchParams;
	const code = searchParams.get('code');

	const response = await createAuthenticationToken({ fetch }, code);

	if (response.ok) {
		throw redirect(302, '/');
	}
};
