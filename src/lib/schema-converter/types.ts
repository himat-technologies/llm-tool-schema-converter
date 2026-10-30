export type Provider = 'openai' | 'anthropic' | 'gemini' | 'mcp';
export type JsonObject = Record<string, unknown>;
export interface NormalizedTool { name: string; description: string; inputSchema: JsonObject; metadata: JsonObject; }
export interface DetectionResult { provider: Provider | 'unknown'; confidence: 'high' | 'medium' | 'low'; message?: string; }
export interface ConversionResult { output: unknown; warnings: string[]; toolsConverted: number; }
export interface ValidationResult { valid: boolean; error?: string; path?: string; }
export const PROVIDERS: { id: Provider; name: string; short: string; color: string }[] = [
  { id: 'openai', name: 'OpenAI', short: 'OpenAI', color: '#16866d' },
  { id: 'anthropic', name: 'Anthropic Claude', short: 'Claude', color: '#c47c4c' },
  { id: 'gemini', name: 'Google Gemini', short: 'Gemini', color: '#5276d9' },
  { id: 'mcp', name: 'Model Context Protocol', short: 'MCP', color: '#8062c5' }
];
