export const createAuthenticationToken = ({ fetch }: any, code: string) =>
	fetch('/authentication/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ code })
	});
