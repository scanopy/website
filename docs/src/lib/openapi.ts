import { createOpenAPI } from 'fumadocs-openapi/server';
import path from 'path';

// OpenAPI spec (preprocessed to convert text/plain to application/json)
export const openapi = createOpenAPI({
  input: [path.resolve('./openapi-processed.json')],
});
