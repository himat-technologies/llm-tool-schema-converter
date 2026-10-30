import { useMemo, useState } from 'react';
import { ArrowRight, ShieldCheck, Github, ExternalLink, Sparkles, Copy, Download, RefreshCw, Check, AlertTriangle, Code2, LockKeyhole, Zap, FileJson, ArrowDownUp } from 'lucide-react';
import { SchemaEditor } from './components/SchemaEditor';
import { ProviderSelector } from './components/ProviderSelector';
import { PresetButtons } from './components/PresetButtons';
import { FAQ } from './components/FAQ';
import { presets } from './data/presetSchemas';
import { detectFormat, parseAndConvert, validateJson } from './lib/schema-converter';
import { PROVIDERS, type Provider } from './lib/schema-converter/types';
import './index.css';
const initial = JSON.stringify(presets.weather.schema, null, 2);
export default function App() {
  const [sourceText, setSourceText] = useState(initial);
  const [sourceProvider, setSourceProvider] = useState<Provider | 'auto'>('auto');
  const [targetProvider, setTargetProvider] = useState<Provider>('anthropic');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [warnings, setWarnings] = useState<string[]>([]);
  const [notice, setNotice] = useState('');
  const parsed = useMemo(() => { try { return sourceText.trim() ? JSON.parse(sourceText) as unknown : null; } catch { return null; } }, [sourceText]);
  const validation = useMemo(() => validateJson(sourceText), [sourceText]);
  const detection = useMemo(() => parsed === null ? { provider: 'unknown' as const, confidence: 'low' as const } : detectFormat(parsed), [parsed]);
  const inferred = sourceProvider === 'auto' ? detection.provider : sourceProvider;
  const toolCount = useMemo(() => {
    if (!parsed || typeof parsed !== 'object') return 0;
    if (Array.isArray(parsed)) return parsed.length;
    const value = parsed as Record<string, unknown>;
    for (const key of ['tools','function_declarations']) if (Array.isArray(value[key])) return (value[key] as unknown[]).length;
    return typeof value.name === 'string' ? 1 : value.type === 'function' ? 1 : 0;
  }, [parsed]);
  const perform = (text = sourceText, source: Provider | 'auto' = sourceProvider, target = targetProvider) => {
    try { const result = parseAndConvert(text, source, target); setOutput(JSON.stringify(result.output, null, 2)); setWarnings(result.warnings); setError(''); }
    catch (e) { setOutput(''); setWarnings([]); setError((e as Error).message); }
  };
  const onInput = (value: string) => { setSourceText(value); setNotice(''); if (!value.trim()) { setOutput(''); setError(''); setWarnings([]); return; } try { JSON.parse(value); perform(value); } catch (e) { setOutput(''); setWarnings([]); setError((e as Error).message); } };
  const chooseTarget = (provider: Provider) => { setTargetProvider(provider); if (sourceText.trim() && validation.valid) perform(sourceText, sourceProvider, provider); };
  const chooseSource = (provider: Provider | 'auto') => { setSourceProvider(provider); if (sourceText.trim() && validation.valid) perform(sourceText, provider, targetProvider); };
  const loadPreset = (key: keyof typeof presets) => { const item = presets[key]; const text = JSON.stringify(item.schema, null, 2); setSourceProvider('auto'); setSourceText(text); setError(''); setWarnings([]); perform(text, 'auto', targetProvider); };
  const copy = async () => { if (!output) return; try { await navigator.clipboard.writeText(output); setNotice('Output copied to clipboard.'); } catch { try { const el = document.createElement('textarea'); el.value = output; document.body.appendChild(el); el.select(); const ok = document.execCommand('copy'); el.remove(); setNotice(ok ? 'Output copied to clipboard.' : 'Clipboard access failed. Select and copy the output manually.'); } catch { setNotice('Clipboard access failed. Select and copy the output manually.'); } } };
  const download = () => { if (!output) return; try { const blob = new Blob([output], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `llm-tool-schema-${targetProvider}.json`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); setNotice('JSON file downloaded.'); } catch { setNotice('Download failed. Please copy the output instead.'); } };
  const detectedName = detection.provider === 'unknown' ? 'Not detected' : PROVIDERS.find(p => p.id === detection.provider)?.name || 'Not detected';
  return <div className="app-shell">
    <header className="topbar"><a className="brand" href="https://himat.tech/" target="_blank" rel="noreferrer"><span className="brand-symbol">H</span><span className="brand-text">HIMAT<span> TECHNOLOGIES</span></span></a><nav><a href="https://himat.tech/">Home</a><a href="https://himat.tech/free-tools/">Free Tools</a><span className="nav-current">Schema Converter</span></nav><a className="top-link" href="https://github.com/himat-technologies/llm-tool-schema-converter" target="_blank" rel="noreferrer"><Github size={16}/> Source <ExternalLink size={12}/></a></header>
    <main>
      <div className="breadcrumb"><a href="https://himat.tech/">Home</a><span>/</span><a href="https://himat.tech/free-tools/">Free Tools</a><span>/</span><b>LLM Tool Schema Converter</b></div>
      <section className="hero"><div className="hero-copy"><div className="eyebrow"><span className="eyebrow-dot"/> DEVELOPER UTILITY <span className="eyebrow-line"/> HIMAT FREE TOOLS</div><h1>One schema.<br/><span>Every LLM provider.</span></h1><p className="hero-description">Move tool and function definitions between OpenAI, Anthropic Claude, Google Gemini and MCP. Normalize once, convert in your browser, keep control of your data.</p><div className="hero-meta"><span><ShieldCheck size={15}/> Privacy-first · 100% client-side</span><span><Zap size={14}/> No API keys required</span><span><Code2 size={14}/> JSON in, JSON out</span></div></div><div className="hero-art"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="core-card"><div className="core-top"><span className="core-dot"/><span className="core-dot"/><span className="core-dot"/><i>schema.json</i></div><div className="core-code"><span>{'{'}</span><span className="code-indent"><b>"tools"</b>: [</span><span className="code-indent-two">{'{'}</span><span className="code-indent-three"><b>"name"</b>: <em>"your_tool"</em></span><span className="code-indent-two">{'}'}</span><span className="code-indent">]</span><span>{'}'}</span></div><div className="core-footer"><span>STRUCTURED DATA</span><span>● READY</span></div></div><div className="float-provider float-openai">◎ <span>OpenAI</span></div><div className="float-provider float-claude">✳ <span>Claude</span></div><div className="float-provider float-gemini">✦ <span>Gemini</span></div><div className="float-provider float-mcp">⌘ <span>MCP</span></div></div></section>
      <section className="workspace-section"><div className="workspace-heading"><div><div className="section-kicker">SCHEMA WORKSPACE</div><h2>Convert your tool definitions</h2><p>Choose a source, select a target, and get a provider-ready schema instantly.</p></div><span className="local-badge"><LockKeyhole size={13}/> Runs locally in your browser</span></div>
        <PresetButtons onSelect={loadPreset}/>
        <div className="workspace-grid"><div className="workspace-panel"><div className="panel-step"><span>01</span><div><b>Source schema</b><small>Input definition</small></div></div><div className="source-select-row"><span className="selector-label">Source format</span><select value={sourceProvider} onChange={e => chooseSource(e.target.value as Provider | 'auto')}><option value="auto">Auto-detect format</option>{PROVIDERS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select><span className={`detected ${detection.provider === 'unknown' ? 'muted' : ''}`}>Detected: {detectedName}</span></div>
          <SchemaEditor title="Source Tool Schema (JSON)" value={sourceText} onChange={onInput} status={validation.valid ? 'Valid JSON' : 'Needs attention'} error={!validation.valid} count={validation.valid ? toolCount : undefined} onClear={() => onInput('')}/>
          {error && <div className="message message-error"><AlertTriangle size={15}/><span>{error}</span></div>}
        </div><div className="direction-mark"><ArrowDownUp size={18}/></div><div className="workspace-panel"><div className="panel-step"><span>02</span><div><b>Target schema</b><small>Converted output</small></div></div><ProviderSelector value={targetProvider} onChange={chooseTarget} label="Convert to provider"/><SchemaEditor title="Generated Provider Schema" value={output} readOnly status={output ? 'Conversion complete' : 'Waiting for valid input'} error={false} onCopy={copy} onDownload={download} onClear={() => {setOutput('');setNotice('Output cleared.')}}/>
          {warnings.map(w => <div className="message message-warning" key={w}><AlertTriangle size={15}/><span>{w}</span></div>)}
          {notice && <div className="message message-success"><Check size={15}/><span>{notice}</span></div>}
          <div className="output-actions"><button className="button-secondary" onClick={copy} disabled={!output}><Copy size={15}/> Copy output</button><button className="button-primary" onClick={download} disabled={!output}><Download size={15}/> Download JSON</button></div>
        </div></div>
        <div className="workspace-foot"><span><ShieldCheck size={14}/> Your schema never leaves this browser.</span><button onClick={() => {setSourceProvider('auto');setTargetProvider('anthropic');onInput(initial);setNotice('Workspace reset to the weather preset.');}}><RefreshCw size={13}/> Reset example</button></div>
      </section>
      <section className="content-section intro-section"><div><div className="section-kicker">WHY CONVERT?</div><h2>Different APIs. Shared intent.</h2></div><p className="section-lead">Tools let language models interact with software and data. But each provider describes those tools differently. This converter maps the common function name, description and input schema between formats—without making an API call.</p><div className="feature-grid"><article><div className="feature-icon mint"><ArrowDownUp/></div><h3>Bidirectional conversion</h3><p>Move between four common tool formats with a normalized conversion engine.</p></article><article><div className="feature-icon blue"><LockKeyhole/></div><h3>In-browser processing</h3><p>JSON parsing and transformation happen locally. No schema payload is sent to a server.</p></article><article><div className="feature-icon amber"><Sparkles/></div><h3>Useful presets</h3><p>Start with practical weather, SQL schema and filesystem examples.</p></article><article><div className="feature-icon violet"><FileJson/></div><h3>Copy and export</h3><p>Copy generated JSON or download a clean, formatted .json file.</p></article></div></section>
      <FAQ/>
      <section className="related-section"><div><div className="section-kicker">KEEP BUILDING</div><h2>More tools for your workflow</h2><p>Explore other developer utilities from Himat Technologies.</p></div><a href="https://himat.tech/free-tools/" target="_blank" rel="noreferrer">Explore all free tools <ArrowRight size={16}/></a><div className="related-grid"><a href="https://himat.tech/free-tools/ai-function-calling-tool-schema-generator" target="_blank" rel="noreferrer">AI Function Calling Schema Generator <ExternalLink size={13}/></a><a href="https://himat.tech/free-tools/mcp-server-config-generator" target="_blank" rel="noreferrer">MCP Server Config Generator <ExternalLink size={13}/></a><a href="https://himat.tech/free-tools/openapi-to-mcp-tool-generator" target="_blank" rel="noreferrer">OpenAPI to MCP Tool Generator <ExternalLink size={13}/></a><a href="https://himat.tech/free-tools/llm-structured-output-json-schema-generator" target="_blank" rel="noreferrer">LLM Structured Output JSON Schema Generator <ExternalLink size={13}/></a></div></section>
    </main><footer className="footer"><a className="brand" href="https://himat.tech/"><span className="brand-symbol">H</span><span className="brand-text">HIMAT<span> TECHNOLOGIES</span></span></a><p>Build systems, not just websites.</p><div className="footer-links"><a href="https://himat.tech/">Website</a><a href="https://himat.tech/free-tools/">Free Tools</a><a href="https://github.com/himat-technologies/llm-tool-schema-converter">Source code</a></div><small>© {new Date().getFullYear()} Himat Technologies. Schema conversion runs locally in your browser.</small></footer>
  </div>;
}
