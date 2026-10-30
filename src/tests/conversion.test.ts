import { describe, expect, it } from 'vitest';
import { convertSchema, detectFormat, parseAndConvert } from '../lib/schema-converter';
import { presets } from '../data/presetSchemas';
const providers = ['openai','anthropic','gemini','mcp'] as const;
describe('provider schema conversion', () => {
  it('converts every provider to every other provider', () => {
    for (const source of providers) for (const target of providers) {
      const result = convertSchema(presets[source === 'openai' ? 'weather' : source === 'anthropic' ? 'sql' : 'filesystem'].schema, source === 'gemini' ? 'gemini' : source, target);
      expect(result.toolsConverted).toBe(1);
      expect(result.output).toBeTruthy();
    }
  });
  it('preserves nested fields, enums, arrays and required properties', () => {
    const input = { tools: [{ type: 'function', function: { name: 'nested', parameters: { type: 'object', properties: { rows: { type: 'array', items: { type: 'object', properties: { id: { type: 'integer', minimum: 1 } } } }, mode: { type: 'string', enum: ['a','b'] } }, required: ['rows'] } } }] };
    const output = convertSchema(input, 'openai', 'mcp').output as { tools: Array<{ inputSchema: { properties: Record<string, any>; required: string[] } }> };
    expect(output.tools[0].inputSchema.properties.rows.items.properties.id.type).toBe('integer');
    expect(output.tools[0].inputSchema.properties.mode.enum).toEqual(['a','b']);
    expect(output.tools[0].inputSchema.required).toEqual(['rows']);
  });
  it('normalizes Gemini type names to lowercase on input and uppercase on output', () => {
    const converted = convertSchema(presets.weather.schema, 'openai', 'gemini').output as any;
    expect(converted.function_declarations[0].parameters.type).toBe('OBJECT');
    expect(converted.function_declarations[0].parameters.properties.location.type).toBe('STRING');
  });
  it('detects all four provider structures', () => {
    expect(detectFormat(presets.weather.schema).provider).toBe('openai');
    expect(detectFormat(presets.sql.schema).provider).toBe('anthropic');
    expect(detectFormat(presets.filesystem.schema).provider).toBe('mcp');
    expect(detectFormat({ function_declarations: [{ name: 'x', parameters: { type: 'OBJECT' } }] }).provider).toBe('gemini');
  });
  it('reports ambiguous or unsupported input', () => {
    expect(detectFormat({ hello: 'world' }).provider).toBe('unknown');
    expect(() => parseAndConvert('{bad', 'auto', 'mcp')).toThrow(/Invalid JSON/);
  });
  it('supports multi-tool conversion', () => {
    const data = presets.weather.schema as any;
    const multi = { tools: [...data.tools, { ...data.tools[0], function: { ...data.tools[0].function, name: 'another_tool' } }] };
    expect(convertSchema(multi, 'openai', 'anthropic').toolsConverted).toBe(2);
  });
  it('reports known lossy Gemini compatibility features', () => {
    const input = { tools: [{ type: 'function', function: { name: 'x', parameters: { $schema: 'draft', type: 'object', properties: {} } } }] };
    expect(convertSchema(input, 'openai', 'gemini').warnings.length).toBeGreaterThan(0);
  });
});
