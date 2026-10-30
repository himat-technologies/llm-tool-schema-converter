import { convertSchema } from './index';
export const convertToAnthropic = (input: unknown, source: 'openai'|'anthropic'|'gemini'|'mcp') => convertSchema(input, source, 'anthropic');
