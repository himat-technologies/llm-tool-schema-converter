export const presets = {
  weather: {
    label: 'Weather API · OpenAI', provider: 'openai' as const,
    schema: { tools: [{ type: 'function', function: { name: 'get_weather_forecast', description: 'Retrieve a weather forecast for a location.', parameters: { type: 'object', properties: { location: { type: 'string', description: 'City or location to look up.' }, units: { type: 'string', enum: ['celsius', 'fahrenheit'], description: 'Temperature unit.' }, include_hourly: { type: 'boolean', description: 'Include an hourly forecast.' } }, required: ['location'], additionalProperties: false } } }] }
  },
  sql: {
    label: 'SQL Query · Claude', provider: 'anthropic' as const,
    schema: { tools: [{ name: 'run_readonly_query', description: 'Prepare a read-only SQL query for an approved analytics source.', input_schema: { type: 'object', properties: { query: { type: 'string', description: 'A SELECT statement to review.' }, max_rows: { type: 'integer', minimum: 1, maximum: 500, default: 100 } }, required: ['query'], additionalProperties: false } }] }
  },
  filesystem: {
    label: 'File System · MCP', provider: 'mcp' as const,
    schema: { tools: [{ name: 'list_files', description: 'List files in a permitted directory. This is a schema example only.', inputSchema: { type: 'object', properties: { path: { type: 'string', description: 'Directory path within the permitted workspace.' }, recursive: { type: 'boolean', default: false } }, required: ['path'], additionalProperties: false } }] }
  }
};
