<script lang="ts">
	import type { HealthCheckResponse, HealthStatus } from './health-check-response';

	export let data: HealthCheckResponse | undefined;

	const webClientStatusMessages: Map<HealthStatus, string> = new Map([
		['responded-as-expected', 'The web client is responding as expected'],
		['failed-to-respond', 'The web client failed to respond'],
		['responded-with-an-error', 'The web client responded with an error'],
		['responded-with-invalid-json', 'The web client responded with invalid JSON'],
		['responded-unexpectedly', 'The web client responded unexpectedly']
	]);

	$: webClientStatus = data ? webClientStatusMessages.get(data.webClientCheck) : '...';
</script>

<h1>Internal - Health Checks</h1>

{webClientStatus}
