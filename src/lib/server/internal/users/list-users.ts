import { PUBLIC_API_BASE_URL } from '$env/static/public';
import Ajv from 'ajv';

type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface User {
	id: string;
	emailAddress: string;
	createdAt: string;
	updatedAt: string;
}

export interface ApiSuccessResponse<T> {
	data: T;
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

const isSuccessResponseBody = (responseBody: any): responseBody is ApiSuccessResponse<User[]> => {
	const ajv = new Ajv();

	const userSchema = {
		type: 'object',
		properties: {
			id: { type: 'string' },
			emailAddress: { type: 'string' },
			createdAt: { type: 'string' },
			updatedAt: { type: 'string' }
		},
		required: ['id', 'emailAddress', 'createdAt', 'updatedAt'],
		additionalProperties: false
	};

	const responseSchema = {
		type: 'object',
		properties: {
			data: { type: 'array', items: userSchema }
		},
		required: ['data'],
		additionalProperties: false
	};

	const validateUserResponse = ajv.compile(responseSchema);
	return !!validateUserResponse(responseBody);
};

const ensureCorrectSuccessResponse = (responseBody: any): ListUsersResponse =>
	isSuccessResponseBody(responseBody)
		? responseBody
		: {
				status: 500,
				errors: [
					{
						title: 'response does not include a user',
						detail: 'The response from the API did not contain a user',
						source: {
							pointer: '/response/body'
						}
					}
				]
		  };

export type ListUsersResponse = ApiErrorResponse | ApiResponse<User[]>;

const fetchUsers = ({ fetch }: any): Promise<Response> =>
	fetch(`${PUBLIC_API_BASE_URL}/api/v1/administration/users`);

const buildResponseFromExpectedBody = (response: Response): Promise<ListUsersResponse> =>
	response.ok ? response.json().then(ensureCorrectSuccessResponse) : Promise.resolve(serverError);

export async function listUsers({ fetch }: any): Promise<ListUsersResponse> {
	try {
		const response = await fetchUsers({ fetch });
		return buildResponseFromExpectedBody(response).catch(() => invalidJSONError);
	} catch {
		return requestFailedError;
	}
}
