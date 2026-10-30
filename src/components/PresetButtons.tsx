import { presets } from '../data/presetSchemas';
interface Props { onSelect: (key: keyof typeof presets) => void; }
export function PresetButtons({ onSelect }: Props) { return <div className="presets"><span className="selector-label">Try a sample</span>{(Object.keys(presets) as (keyof typeof presets)[]).map(key => <button key={key} className="preset-button" onClick={() => onSelect(key)}>{presets[key].label}<span>↗</span></button>)}</div>; }
