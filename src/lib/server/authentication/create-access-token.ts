import {
	PUBLIC_API_BASE_URL,
	PUBLIC_OAUTH_APPLICATION_ID,
	PUBLIC_OAUTH_REDIRECT_URI
} from '$env/static/public';
import { OAUTH_APPLICATION_SECRET } from '$env/static/private';
import Ajv from 'ajv';

export interface CreateAccessTokenPayload {
	code: string;
}

export interface ApiError {
	title: string;
	detail: string;
	source: {
		pointer: string;
	};
}

export interface ApiErrorResponse {
	status: number;
	errors: ApiError[];
}

const requestFailedError: ApiErrorResponse = {
	status: 502,
	errors: [
		{
			title: 'request failed',
			detail: 'the API did not respond',
			source: {
				pointer: '/response'
			}
		}
	]
};

const serverError: ApiErrorResponse = {
	status: 500,
	errors: [
		{
			title: 'server error',
			detail: 'Something unexpected happened',
			source: {
				pointer: '/response'
			}
		}
	]
};

const invalidJSONError: ApiErrorResponse = {
	status: 500,
	errors: [
		{
			title: 'response is not JSON',
			detail: 'response is not JSON',
			source: {
				pointer: '/response/body'
			}
		}
	]
};

export const isErrorResponseBody = (responseBody: any): responseBody is ApiErrorResponse => {
	const ajv = new Ajv();

	const errorSchema = {
		type: 'object',
		properties: {
			title: { type: 'string' },
			detail: { type: 'string' },
			source: {
				type: 'object',
				properties: {
					pointer: { type: 'string' }
				},
				required: ['pointer'],
				additionalProperties: false
			}
		},
		required: ['title', 'source', 'detail'],
		additionalProperties: false
	};

	const errorResponseSchema = {
		type: 'object',
		properties: {
			status: { type: 'integer' },
			errors: { type: 'array', items: errorSchema }
		},
		required: ['errors', 'status'],
		additionalProperties: false
	};

	const validateApiErrorResponse = ajv.compile(errorResponseSchema);
	return !!validateApiErrorResponse(responseBody);
};

type CreateAccessTokenSuccess = object;

const isSuccessResponseBody = (responseBody: any): responseBody is CreateAccessTokenSuccess => {
	const ajv = new Ajv();

	const responseSchema = {
		type: 'object',
		properties: {
			access_token: { type: 'string' },
			token_type: { type: 'string' },
			expires_in: { type: 'integer' },
			refresh_token: { type: 'string' },
			scope: { type: 'string' },
			created_at: { type: 'integer' }
		},
		required: ['scope', 'access_token', 'token_type', 'expires_in', 'refresh_token', 'created_at'],
		additionalProperties: false
	};

	const validateUserResponse = ajv.compile(responseSchema);
	return !!validateUserResponse(responseBody);
};

export type CreateAccessTokenResponse = CreateAccessTokenSuccess | ApiErrorResponse;

const ensureCorrectSuccessResponse = (responseBody: any): CreateAccessTokenResponse =>
	isSuccessResponseBody(responseBody)
		? responseBody
		: {
				status: 500,
				errors: [
					{
						title: 'response does not include a token',
						detail: 'The response from the API did not contain a token',
						source: {
							pointer: '/response/body'
						}
					}
				]
		  };

const postAccessToken = ({ fetch }: any, payload: CreateAccessTokenPayload): Promise<Response> =>
	fetch(`${PUBLIC_API_BASE_URL}/oauth/token`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			client_id: PUBLIC_OAUTH_APPLICATION_ID,
			client_secret: OAUTH_APPLICATION_SECRET,
			grant_type: 'authorization_code',
			code: payload.code,
			redirect_uri: PUBLIC_OAUTH_REDIRECT_URI
		})
	});

const buildResponseFromExpectedBody = (response: Response): Promise<CreateAccessTokenResponse> =>
	response.ok ? response.json().then(ensureCorrectSuccessResponse) : Promise.resolve(serverError);

export const createAccessToken = async (
	{ fetch }: any,
	payload: CreateAccessTokenPayload
): Promise<CreateAccessTokenResponse> => {
	try {
		const response: Response = await postAccessToken({ fetch }, payload);
		return buildResponseFromExpectedBody(response).catch(() => invalidJSONError);
	} catch {
		return requestFailedError;
	}
};
