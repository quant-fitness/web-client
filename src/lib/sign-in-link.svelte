<script lang="ts">
	import {
		PUBLIC_API_BASE_URL,
		PUBLIC_OAUTH_APPLICATION_ID,
		PUBLIC_OAUTH_REDIRECT_URI
	} from '$env/static/public';

	const signInURI = `${PUBLIC_API_BASE_URL}/oauth/authorize?client_id=${PUBLIC_OAUTH_APPLICATION_ID}&redirect_uri=${PUBLIC_OAUTH_REDIRECT_URI}&response_type=code`;
	let className = '';
	export { className as class };
</script>

<a href={signInURI} class={className || ''}>
	<slot />
</a>
