import { describe, expect, it } from 'vitest';
import { validateJson, parseAndConvert } from '../lib/schema-converter';
import { presets } from '../data/presetSchemas';
describe('validation', () => {
  it('rejects empty and malformed JSON', () => { expect(validateJson('').valid).toBe(false); expect(validateJson('{').valid).toBe(false); });
  it('accepts valid JSON', () => { expect(validateJson(JSON.stringify(presets.weather.schema)).valid).toBe(true); });
  it('rejects missing names and missing parameter schemas', () => {
    expect(() => parseAndConvert('{"tools":[{"type":"function","function":{"parameters":{"type":"object"}}}]}', 'openai', 'mcp')).toThrow(/name is required/);
    expect(() => parseAndConvert('{"tools":[{"type":"function","function":{"name":"x"}}]}', 'openai', 'mcp')).toThrow(/requires an object schema/);
  });
});
