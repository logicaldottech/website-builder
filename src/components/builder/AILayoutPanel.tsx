import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { useBuilderStore } from '../../store/builderStore';

const AILayoutPanel: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ notes: string[], unsupported: string[] } | null>(null);
  const { generateLayoutFromPrompt } = useBuilderStore();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setFeedback(null);
    try {
      const result = await generateLayoutFromPrompt(prompt);
      // Defer feedback update to prevent race condition with main store update
      setTimeout(() => {
        setFeedback(result);
        setIsLoading(false);
      }, 0);
    } catch (error) {
      console.error(error);
      setTimeout(() => {
        setFeedback({ notes: [], unsupported: ['An error occurred during generation.'] });
        setIsLoading(false);
      }, 0);
    }
  };

  return (
    <div className="p-4 space-y-4 border-b border-border">
      <h3 className="flex items-center gap-2 px-1 text-xs font-semibold text-text-muted uppercase tracking-wider">
        <Sparkles size={14} className="text-primary" />
        Generate with AI
      </h3>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g., 'A hero section with a 3 column feature grid below'"
        className="w-full h-24 p-2 bg-surface-alt border border-border rounded-md text-sm resize-none focus:border-primary"
      />
      <button
        onClick={handleGenerate}
        disabled={isLoading}
        className="w-full h-10 flex items-center justify-center gap-2 bg-primary text-white rounded-md text-sm font-semibold disabled:bg-opacity-70"
      >
        {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
        <span>Generate</span>
      </button>
      {feedback && (
        <div className="text-xs space-y-2 mt-3">
          {feedback.notes.length > 0 && (
            <div className="p-2 bg-success/10 text-success rounded-md">
              <p className="font-semibold">Notes:</p>
              <ul className="list-disc list-inside">
                {feedback.notes.map((note, i) => <li key={i}>{note}</li>)}
              </ul>
            </div>
          )}
          {feedback.unsupported.length > 0 && (
            <div className="p-2 bg-danger/10 text-danger rounded-md">
              <p className="font-semibold">Could not generate:</p>
              <ul className="list-disc list-inside">
                {feedback.unsupported.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AILayoutPanel;
