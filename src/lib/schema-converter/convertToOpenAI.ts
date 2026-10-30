import { convertSchema } from './index';
export const convertToOpenAI = (input: unknown, source: 'openai'|'anthropic'|'gemini'|'mcp') => convertSchema(input, source, 'openai');
