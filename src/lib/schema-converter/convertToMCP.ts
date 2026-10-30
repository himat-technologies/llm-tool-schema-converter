import { convertSchema } from './index';
export const convertToMCP = (input: unknown, source: 'openai'|'anthropic'|'gemini'|'mcp') => convertSchema(input, source, 'mcp');
