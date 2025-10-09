import React, { useState, useEffect, useRef } from 'react';
import { RotateCw } from 'lucide-react';
import ColorInput from '../ColorInput';

interface GradientPickerProps {
  value: string | undefined;
  onChange: (value: string) => void;
}

const parseGradient = (value: string) => {
  const defaultState = { type: 'linear', angle: 90, stops: [{ color: '#64748b', pos: 0 }, { color: '#F0F0F0', pos: 100 }] };
  if (!value || !value.includes('gradient')) return defaultState;

  const type = value.includes('linear') ? 'linear' : 'radial';
  const stopsMatch = value.match(/rgba?\(.+?\) \d+%/g) || value.match(/#([a-f\d]{3,8}) \d+%/gi);
  const stops = (stopsMatch || []).map(s => {
    const parts = s.split(' ');
    return { color: parts[0], pos: parseInt(parts[1], 10) };
  });

  let angle = 90;
  if (type === 'linear') {
    const angleMatch = value.match(/(\d+)deg/);
    if (angleMatch) angle = parseInt(angleMatch[1], 10);
  }

  return { type, angle, stops };
};

const generateGradientString = (state: { type: string; angle: number; stops: { color: string; pos: number }[] }) => {
  const sortedStops = [...state.stops].sort((a, b) => a.pos - b.pos);
  const stopsString = sortedStops.map(s => `${s.color} ${s.pos}%`).join(', ');
  if (state.type === 'linear') {
    return `linear-gradient(${state.angle}deg, ${stopsString})`;
  }
  return `radial-gradient(circle, ${stopsString})`;
};

const GradientPicker: React.FC<GradientPickerProps> = ({ value, onChange }) => {
  const [state, setState] = useState(parseGradient(value || ''));
  const [activeStop, setActiveStop] = useState(0);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onChange(generateGradientString(state));
  }, [state]);

  const handleStopColorChange = (color: string) => {
    const newStops = [...state.stops];
    newStops[activeStop].color = color;
    setState({ ...state, stops: newStops });
  };

  return (
    <div className="space-y-4">
      <div className="relative h-10 w-full rounded-md" ref={barRef} style={{ background: generateGradientString(state) }}>
        {state.stops.map((stop, index) => (
          <div
            key={index}
            onClick={() => setActiveStop(index)}
            className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 cursor-pointer ${index === activeStop ? 'border-primary-slate scale-125' : 'border-white'}`}
            style={{ left: `${stop.pos}%`, backgroundColor: stop.color }}
          />
        ))}
      </div>
      <div>
        <ColorInput label="Stop Color" value={state.stops[activeStop].color} onChange={handleStopColorChange} />
        <label className="text-xs text-text-secondary mt-2 mb-1.5 block font-medium">Stop Position</label>
        <input
          type="range"
          min="0" max="100"
          value={state.stops[activeStop].pos}
          onChange={e => {
            const newStops = [...state.stops];
            newStops[activeStop].pos = parseInt(e.target.value, 10);
            setState({ ...state, stops: newStops });
          }}
          className="w-full h-2 bg-border-color rounded-lg appearance-none cursor-pointer accent-primary-slate"
        />
      </div>
      <div className="flex items-center gap-4">
        <label className="text-xs text-text-secondary">Angle</label>
        <input
          type="number"
          value={state.angle}
          onChange={e => setState({ ...state, angle: parseInt(e.target.value, 10) })}
          className="w-20 pl-2 pr-7 py-2 bg-background border border-border-color rounded-lg focus:ring-2 focus:ring-primary-slate focus:outline-none transition-all text-sm"
        />
        <RotateCw size={16} />
      </div>
    </div>
  );
};

export default GradientPicker;
