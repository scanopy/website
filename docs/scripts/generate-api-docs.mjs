import { generateFiles } from 'fumadocs-openapi';
import { createOpenAPI } from 'fumadocs-openapi/server';
import { resolve } from 'path';
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';

// Preprocess spec to convert text/plain to application/json (fumadocs doesn't support text/plain)
function preprocessSpec() {
  const specPath = resolve('./openapi.json');
  const spec = JSON.parse(readFileSync(specPath, 'utf-8'));

  function convertMediaTypes(obj) {
    if (obj && typeof obj === 'object') {
      if (obj['text/plain'] && !obj['application/json']) {
        obj['application/json'] = obj['text/plain'];
        delete obj['text/plain'];
      }
      for (const key of Object.keys(obj)) {
        convertMediaTypes(obj[key]);
      }
    }
  }

  convertMediaTypes(spec);

  // Flatten allOf schemas to merge required arrays (fumadocs doesn't handle nested required well)
  flattenAllOfSchemas(spec);

  // Sort properties with required fields first
  sortPropertiesRequiredFirst(spec);

  const processedPath = resolve('./openapi-processed.json');
  writeFileSync(processedPath, JSON.stringify(spec, null, 2));
  return { spec, processedPath };
}

// Recursively resolve a $ref to its target schema
function resolveRef(spec, ref) {
  if (!ref || !ref.startsWith('#/')) return null;
  const parts = ref.slice(2).split('/');
  let current = spec;
  for (const part of parts) {
    current = current?.[part];
  }
  return current;
}

// Flatten allOf schemas by merging properties and required arrays
function flattenAllOfSchemas(spec) {
  const schemas = spec.components?.schemas;
  if (!schemas) return;

  for (const [name, schema] of Object.entries(schemas)) {
    if (schema.allOf) {
      flattenAllOf(spec, schema);
    }
  }
}

function flattenAllOf(spec, schema) {
  if (!schema.allOf) return;

  const mergedProperties = {};
  const mergedRequired = new Set();
  let description = schema.description;
  let oneOf = null;

  for (const member of schema.allOf) {
    let resolved = member;

    // Resolve $ref if present
    if (member.$ref) {
      resolved = resolveRef(spec, member.$ref);
      if (!resolved) continue;

      // Recursively flatten nested allOf first
      if (resolved.allOf) {
        flattenAllOf(spec, resolved);
      }
    }

    // Capture oneOf (we'll handle it specially)
    if (resolved.oneOf) {
      oneOf = resolved.oneOf;
    }

    // Merge properties
    if (resolved.properties) {
      Object.assign(mergedProperties, resolved.properties);
    }

    // Merge required arrays
    if (resolved.required) {
      for (const field of resolved.required) {
        mergedRequired.add(field);
      }
    }
  }

  // Replace allOf with flattened structure
  delete schema.allOf;
  schema.type = 'object';

  if (Object.keys(mergedProperties).length > 0) {
    schema.properties = mergedProperties;
  }
  if (mergedRequired.size > 0) {
    schema.required = [...mergedRequired];
  }
  if (description) {
    schema.description = description;
  }

  // If there was a oneOf, we need to distribute the common properties/required into each variant
  if (oneOf) {
    schema.oneOf = oneOf.map(variant => {
      const merged = {
        ...variant,
        properties: { ...mergedProperties, ...variant.properties },
      };
      // Merge required arrays for each variant
      const variantRequired = new Set(mergedRequired);
      if (variant.required) {
        for (const field of variant.required) {
          variantRequired.add(field);
        }
      }
      merged.required = [...variantRequired];
      return merged;
    });
    // Remove top-level properties/required since they're now in oneOf variants
    delete schema.properties;
    delete schema.required;
    delete schema.type;
  }
}

// Sort properties so required fields come first, then alphabetically
function sortPropertiesRequiredFirst(spec) {
  function sortSchema(schema) {
    if (!schema || typeof schema !== 'object') return;

    // Sort properties if this schema has them
    if (schema.properties && typeof schema.properties === 'object') {
      const required = new Set(schema.required || []);
      const entries = Object.entries(schema.properties);

      // Sort: required first (alphabetically), then optional (alphabetically)
      entries.sort(([keyA], [keyB]) => {
        const aRequired = required.has(keyA);
        const bRequired = required.has(keyB);
        if (aRequired && !bRequired) return -1;
        if (!aRequired && bRequired) return 1;
        return keyA.localeCompare(keyB);
      });

      schema.properties = Object.fromEntries(entries);

      // Recursively sort nested schemas
      for (const prop of Object.values(schema.properties)) {
        sortSchema(prop);
      }
    }

    // Handle oneOf/anyOf/allOf
    for (const key of ['oneOf', 'anyOf', 'allOf']) {
      if (Array.isArray(schema[key])) {
        for (const variant of schema[key]) {
          sortSchema(variant);
        }
      }
    }

    // Handle items (for arrays)
    if (schema.items) {
      sortSchema(schema.items);
    }

    // Handle additionalProperties
    if (schema.additionalProperties && typeof schema.additionalProperties === 'object') {
      sortSchema(schema.additionalProperties);
    }
  }

  // Sort all component schemas
  if (spec.components?.schemas) {
    for (const schema of Object.values(spec.components.schemas)) {
      sortSchema(schema);
    }
  }

  // Sort schemas in request/response bodies throughout paths
  if (spec.paths) {
    for (const pathItem of Object.values(spec.paths)) {
      for (const operation of Object.values(pathItem)) {
        if (typeof operation !== 'object') continue;

        // Request body schemas
        const requestContent = operation.requestBody?.content;
        if (requestContent) {
          for (const mediaType of Object.values(requestContent)) {
            if (mediaType.schema) sortSchema(mediaType.schema);
          }
        }

        // Response schemas
        if (operation.responses) {
          for (const response of Object.values(operation.responses)) {
            const responseContent = response.content;
            if (responseContent) {
              for (const mediaType of Object.values(responseContent)) {
                if (mediaType.schema) sortSchema(mediaType.schema);
              }
            }
          }
        }
      }
    }
  }
}

// Add HTTP method prefix to MDX file titles
function addMethodToTitles(apiDir) {
  const folders = readdirSync(apiDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  for (const folder of folders) {
    const folderPath = resolve(apiDir, folder);
    const files = readdirSync(folderPath).filter(f => f.endsWith('.mdx'));

    for (const file of files) {
      const filePath = resolve(folderPath, file);
      let content = readFileSync(filePath, 'utf-8');

      // Extract method from _openapi.method
      const methodMatch = content.match(/_openapi:\s*\n\s*method:\s*(\w+)/);
      if (!methodMatch) continue;

      const method = methodMatch[1].toUpperCase();

      // Add icon field for the method badge (no need to add method to title since icon shows it)
      if (!content.includes('icon:')) {
        content = content.replace(
          /^(---\s*\ntitle:.+\n)/m,
          `$1icon: ${method}\n`
        );
      }

      writeFileSync(filePath, content);
    }
  }
  console.log('Added method prefixes to API page titles');
}

// Generate meta.json files for each API tag folder
function generateMetaFiles(spec, apiDir) {
  // Method sort order
  const methodOrder = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

  // Get all folders in the API directory
  const folders = readdirSync(apiDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  for (const folder of folders) {
    const folderPath = resolve(apiDir, folder);

    // Get all .mdx files with their methods for sorting
    const files = readdirSync(folderPath)
      .filter(f => f.endsWith('.mdx'))
      .map(f => {
        const name = f.replace('.mdx', '');
        const content = readFileSync(resolve(folderPath, f), 'utf-8');
        const methodMatch = content.match(/_openapi:\s*\n\s*method:\s*(\w+)/);
        const method = methodMatch ? methodMatch[1].toUpperCase() : 'GET';
        return { name, method };
      })
      // Sort by method order, then alphabetically by name
      .sort((a, b) => {
        const orderA = methodOrder.indexOf(a.method);
        const orderB = methodOrder.indexOf(b.method);
        if (orderA !== orderB) return orderA - orderB;
        return a.name.localeCompare(b.name);
      })
      .map(f => f.name);

    // Convert folder_name to Title Case, with special handling for acronyms
    const acronyms = ['api', 'id', 'oidc', 'url', 'uri'];
    let title = folder
      .split('_')
      .map(word => {
        if (acronyms.includes(word.toLowerCase())) {
          return word.toUpperCase();
        }
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');

    const meta = {
      title,
      pages: files,
    };

    writeFileSync(
      resolve(folderPath, 'meta.json'),
      JSON.stringify(meta, null, 2)
    );
    console.log(`Generated meta.json for ${folder}`);
  }
}

const { spec, processedPath } = preprocessSpec();
console.log('Preprocessed OpenAPI spec (converted text/plain to application/json)');

const openapi = createOpenAPI({
  input: [processedPath],
});

async function main() {
  const apiDir = './content/docs/api';

  await generateFiles({
    input: openapi,
    output: apiDir,
    per: 'operation',
    groupBy: 'tag',
  });

  console.log('API docs generated successfully');

  // Add method prefixes to page titles
  addMethodToTitles(apiDir);

  // Generate meta.json files for each tag folder
  generateMetaFiles(spec, apiDir);
  console.log('Meta files generated successfully');

  // Update root meta.json with API folders
  updateRootMeta(apiDir);
  console.log('Root meta.json updated with API folders');
}

// Update the root meta.json to include all API folders
function updateRootMeta(apiDir) {
  const rootMetaPath = './content/docs/meta.json';
  const rootMeta = JSON.parse(readFileSync(rootMetaPath, 'utf-8'));

  // Get all API folders
  const apiFolders = readdirSync(apiDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => `api/${d.name}`)
    .sort();

  // Find the API Reference separator and replace everything after it
  const apiIndex = rootMeta.pages.indexOf('---API Reference---');
  if (apiIndex !== -1) {
    rootMeta.pages = [...rootMeta.pages.slice(0, apiIndex + 1), ...apiFolders];
  }

  writeFileSync(rootMetaPath, JSON.stringify(rootMeta, null, 2) + '\n');
}

main().catch(console.error);
