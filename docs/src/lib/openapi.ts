import { createOpenAPI } from 'fumadocs-openapi/server';

// OpenAPI spec (preprocessed to convert text/plain to application/json)
// Use relative path so it works in any environment (local, CI, etc.)
export const openapi = createOpenAPI({
	input: ['./openapi-processed.json']
});
