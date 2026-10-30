import { convertSchema } from './index';
export const convertToGemini = (input: unknown, source: 'openai'|'anthropic'|'gemini'|'mcp') => convertSchema(input, source, 'gemini');
