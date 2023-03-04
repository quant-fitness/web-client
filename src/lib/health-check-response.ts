export type HealthStatus =
	| 'skipped'
	| 'responded-as-expected'
	| 'failed-to-respond'
	| 'responded-with-an-error'
	| 'responded-with-invalid-json'
	| 'responded-unexpectedly';

export interface HealthCheckResponse {
	webClientCheck: HealthStatus;
	apiCheck: HealthStatus;
	databaseCheck: HealthStatus;
}
