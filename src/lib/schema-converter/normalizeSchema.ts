import type { JsonObject, NormalizedTool, Provider } from './types';
const isObject = (v: unknown): v is JsonObject => !!v && typeof v === 'object' && !Array.isArray(v);
const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));
function normalizeTypes(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(normalizeTypes);
  if (!isObject(value)) return value;
  const out: JsonObject = {};
  for (const [key, child] of Object.entries(value)) {
    if (key === 'type' && typeof child === 'string') out[key] = child.toLowerCase();
    else out[key] = normalizeTypes(child);
  }
  return out;
}
function asTools(input: unknown, provider: Provider): unknown[] {
  if (Array.isArray(input)) return input;
  if (!isObject(input)) throw new Error('Expected a tool object or an array of tools.');
  if (provider === 'openai') {
    if (Array.isArray(input.tools)) return input.tools;
    if (input.type === 'function' || isObject(input.function)) return [input];
  }
  if (provider === 'anthropic') {
    if (Array.isArray(input.tools)) return input.tools;
    if (typeof input.name === 'string' && 'input_schema' in input) return [input];
  }
  if (provider === 'gemini') {
    if (Array.isArray(input.function_declarations)) return input.function_declarations;
    if (typeof input.name === 'string' && 'parameters' in input) return [input];
  }
  if (provider === 'mcp') {
    if (Array.isArray(input.tools)) return input.tools;
    if (typeof input.name === 'string' && 'inputSchema' in input) return [input];
  }
  throw new Error(`The JSON does not contain a recognizable ${provider} tool definition.`);
}
export function normalizeTools(input: unknown, provider: Provider): NormalizedTool[] {
  const entries = asTools(input, provider);
  if (!entries.length) throw new Error('The tool collection is empty. Add at least one tool.');
  return entries.map((entry, index) => {
    if (!isObject(entry)) throw new Error(`tools[${index}] must be an object.`);
    let name: unknown, description: unknown, schema: unknown, metadata: JsonObject = {};
    if (provider === 'openai') {
      const fn = isObject(entry.function) ? entry.function : entry;
      name = fn.name; description = fn.description; schema = fn.parameters;
      metadata = Object.fromEntries(Object.entries(fn).filter(([k]) => !['name','description','parameters'].includes(k)));
    } else if (provider === 'anthropic') {
      name = entry.name; description = entry.description; schema = entry.input_schema;
      metadata = Object.fromEntries(Object.entries(entry).filter(([k]) => !['name','description','input_schema'].includes(k)));
    } else if (provider === 'gemini') {
      name = entry.name; description = entry.description; schema = entry.parameters;
      metadata = Object.fromEntries(Object.entries(entry).filter(([k]) => !['name','description','parameters'].includes(k)));
    } else {
      name = entry.name; description = entry.description; schema = entry.inputSchema;
      metadata = Object.fromEntries(Object.entries(entry).filter(([k]) => !['name','description','inputSchema'].includes(k)));
    }
    if (typeof name !== 'string' || !name.trim()) throw new Error(`tools[${index}].name is required and must be a non-empty string.`);
    if (!isObject(schema)) throw new Error(`tools[${index}] (${name}) requires an object schema for its parameters.`);
    const normalized = normalizeTypes(clone(schema)) as JsonObject;
    if (normalized.type !== 'object') throw new Error(`tools[${index}].${provider === 'anthropic' ? 'input_schema' : 'parameters'}.type must be "object".`);
    if (normalized.required !== undefined && (!Array.isArray(normalized.required) || normalized.required.some(v => typeof v !== 'string'))) {
      throw new Error(`tools[${index}].required must be an array of strings.`);
    }
    return { name, description: typeof description === 'string' ? description : '', inputSchema: normalized, metadata };
  });
}
export function schemaForProvider(schema: JsonObject, provider: Provider, warnings: string[]): JsonObject {
  const result = clone(schema);
  if (provider !== 'gemini') return result;
  const transform = (v: unknown): unknown => {
    if (Array.isArray(v)) return v.map(transform);
    if (!isObject(v)) return v;
    const out: JsonObject = {};
    for (const [k, child] of Object.entries(v)) {
      if (k === 'type' && typeof child === 'string') out[k] = child.toUpperCase();
      else if (k === '$schema' || k === '$id' || k === '$defs' || k === 'definitions') {
        warnings.push(`Gemini schema compatibility: ${k} is not represented in the generated function declaration.`);
      } else out[k] = transform(child);
    }
    return out;
  };
  return transform(result) as JsonObject;
}
