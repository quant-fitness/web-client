<script lang="ts">
	// TODO: Test this
	import SignInLink from '$lib/sign-in-link.svelte';
</script>

<main class="grid min-h-full place-items-center bg-white py-24 px-6 sm:py-32 lg:px-8">
	<div class="text-center">
		<h1 class="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
			Signing in failed
		</h1>
		<p class="mt-6 text-base leading-7 text-gray-600">
			Something unexpected happened and prevented you from signing in
		</p>
		<div class="mt-10 flex items-center justify-center gap-x-6">
			<SignInLink
				class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
			>
				Try Again
			</SignInLink>
			<a href="/" class="text-sm font-semibold text-gray-900"
				>Go back home <span aria-hidden="true">&rarr;</span></a
			>
		</div>
	</div>
</main>
