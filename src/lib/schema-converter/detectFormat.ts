import type { DetectionResult, JsonObject, Provider } from './types';
const obj = (v: unknown): v is JsonObject => !!v && typeof v === 'object' && !Array.isArray(v);
export function detectFormat(value: unknown): DetectionResult {
  const candidates: Provider[] = [];
  const entries = Array.isArray(value) ? value : obj(value) ? [value] : [];
  if (obj(value) && Array.isArray(value.function_declarations)) candidates.push('gemini');
  if (obj(value) && Array.isArray(value.tools)) {
    const tools = value.tools;
    if (tools.length && tools.every(t => obj(t) && 'inputSchema' in t)) candidates.push('mcp');
    if (tools.length && tools.every(t => obj(t) && 'input_schema' in t)) candidates.push('anthropic');
    if (tools.length && tools.every(t => obj(t) && (t.type === 'function' || obj(t.function)))) candidates.push('openai');
  }
  if (entries.length) {
    const all = (fn: (v: JsonObject) => boolean) => entries.every(obj) && entries.every(v => fn(v as JsonObject));
    if (all(v => 'input_schema' in v)) candidates.push('anthropic');
    if (all(v => 'inputSchema' in v)) candidates.push('mcp');
    if (all(v => 'function_declarations' in v)) candidates.push('gemini');
    if (all(v => v.type === 'function' || obj(v.function))) candidates.push('openai');
  }
  const unique = [...new Set(candidates)];
  if (unique.length === 1) return { provider: unique[0], confidence: 'high' };
  if (unique.length > 1) return { provider: 'unknown', confidence: 'low', message: 'This JSON matches more than one provider pattern. Select the source format manually.' };
  if (obj(value) && typeof value.name === 'string' && obj(value.parameters)) return { provider: 'unknown', confidence: 'medium', message: 'This resembles a function declaration, but its provider cannot be identified confidently.' };
  return { provider: 'unknown', confidence: 'low', message: 'Could not detect a supported provider format. Check the JSON structure or choose a source format.' };
}
