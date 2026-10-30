const items = [
  ['Why do LLM providers use different tool schema formats?', 'Each provider defines its own request structure and naming conventions. This converter normalizes the shared tool semantics and maps them into the selected provider structure.'],
  ['Are my schemas sent to Himat servers?', 'No. Parsing and conversion run in your browser. The application does not send the schema text to a conversion backend, and it does not persist your input in browser storage.'],
  ['Can I convert multiple tools at once?', 'Yes. Use the provider tools collection or the supported array input. The converter processes each tool and preserves the tool names, descriptions, and represented parameter schema.'],
  ['What if a target provider does not support a schema feature?', 'Some provider formats are not fully equivalent. The converter reports known transformations and compatibility warnings. Review the output against the target provider documentation before using it in production.'],
  ['Does the converter execute tools?', 'No. It only parses and transforms JSON definitions. It does not invoke functions, execute SQL, access files, or connect to MCP servers.'],
  ['Do I need an API key?', 'No. Conversion is local and does not call provider APIs.']
];
export function FAQ() { return <section className="content-section"><div className="section-kicker">QUESTIONS</div><h2>Frequently asked questions</h2><p className="section-lead">A few details about compatibility, privacy and how the converter works.</p><div className="faq-grid">{items.map(([q,a]) => <details key={q} className="faq-item"><summary>{q}</summary><p>{a}</p></details>)}</div></section>; }
