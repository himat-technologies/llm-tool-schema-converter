import { detectFormat } from './detectFormat';
import { normalizeTools, schemaForProvider } from './normalizeSchema';
import type { ConversionResult, Provider } from './types';
export { detectFormat };
export function convertSchema(input: unknown, source: Provider, target: Provider): ConversionResult {
  const tools = normalizeTools(input, source);
  const warnings: string[] = [];
  const converted = tools.map(tool => {
    const schema = schemaForProvider(tool.inputSchema, target, warnings);
    if (target === 'openai') return { type: 'function', function: { name: tool.name, description: tool.description, parameters: schema, ...tool.metadata } };
    if (target === 'anthropic') return { name: tool.name, description: tool.description, input_schema: schema, ...tool.metadata };
    if (target === 'gemini') return { name: tool.name, description: tool.description, parameters: schema, ...tool.metadata };
    return { name: tool.name, description: tool.description, inputSchema: schema, ...tool.metadata };
  });
  let output: unknown;
  if (target === 'openai') output = { tools: converted };
  else if (target === 'anthropic') output = { tools: converted };
  else if (target === 'gemini') output = { function_declarations: converted };
  else output = { tools: converted };
  return { output, warnings: [...new Set(warnings)], toolsConverted: converted.length };
}
export function parseAndConvert(text: string, source: Provider | 'auto', target: Provider): ConversionResult & { source: Provider } {
  let parsed: unknown;
  try { parsed = JSON.parse(text); } catch (error) {
    const e = error as SyntaxError;
    throw new Error(`Invalid JSON: ${e.message}. Check commas, quotation marks, and brackets.`);
  }
  let actual = source;
  if (actual === 'auto') {
    const detected = detectFormat(parsed);
    if (detected.provider === 'unknown') throw new Error(detected.message || 'Select a source format manually.');
    actual = detected.provider;
  }
  return { ...convertSchema(parsed, actual, target), source: actual };
}
export function validateJson(text: string): { valid: boolean; error?: string } {
  if (!text.trim()) return { valid: false, error: 'Enter a tool schema or choose a preset to begin.' };
  try { JSON.parse(text); return { valid: true }; }
  catch (error) { return { valid: false, error: `Invalid JSON: ${(error as Error).message}` }; }
}
