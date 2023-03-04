import { API_BASE_URL } from '$env/static/private';
import Ajv from 'ajv';

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

type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export type DeleteUserResponse = ApiResponse<User>;

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

const isSuccessResponseBody = (responseBody: any): responseBody is ApiSuccessResponse<User> => {
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
			data: userSchema
		},
		required: ['data'],
		additionalProperties: false
	};

	const validateUserResponse = ajv.compile(responseSchema);
	return !!validateUserResponse(responseBody);
};

const ensureCorrectSuccessResponse = (responseBody: any): DeleteUserResponse =>
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

const ensureCorrectErrorResponse = (responseBody: any): DeleteUserResponse =>
	isErrorResponseBody(responseBody)
		? responseBody
		: {
				status: 500,
				errors: [
					{
						title: 'response does not include errors',
						detail: 'The response from the API was an error but did not contain errors',
						source: {
							pointer: '/response/body'
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

const sendDeleteUserRequest = ({ fetch }: any, id: string): Promise<Response> =>
	fetch(`${API_BASE_URL}/api/v1/administration/users/${id}`, { method: 'DELETE' });

const buildResponseFromExpectedBody = (response: Response): Promise<DeleteUserResponse> =>
	response.ok
		? response.json().then(ensureCorrectSuccessResponse)
		: response.status === 404
		? response.json().then(ensureCorrectErrorResponse)
		: Promise.resolve(serverError);

export const deleteUser = async ({ fetch }: any, id: string): Promise<DeleteUserResponse> => {
	try {
		const response: Response = await sendDeleteUserRequest({ fetch }, id);
		return buildResponseFromExpectedBody(response).catch(() => invalidJSONError);
	} catch (e) {
		return requestFailedError;
	}
};
