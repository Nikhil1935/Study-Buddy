import React, { useState, useEffect } from 'react';
import { Play, HelpCircle, RefreshCw, Terminal } from 'lucide-react';
import { getCodeHint } from '../services/geminiService';

interface CodeSandboxProps {
  initialCode?: string;
  question: string;
  concept: string;
}

export const CodeSandbox: React.FC<CodeSandboxProps> = ({ initialCode = "", question, concept }) => {
  const [code, setCode] = useState(initialCode);
  const [hint, setHint] = useState<string | null>(null);
  const [loadingHint, setLoadingHint] = useState(false);
  const [output, setOutput] = useState<string | null>(null);

  useEffect(() => {
    if (initialCode) setCode(initialCode);
  }, [initialCode]);

  const handleGetHint = async () => {
    setLoadingHint(true);
    const newHint = await getCodeHint(question, code, concept);
    setHint(newHint);
    setLoadingHint(false);
  };

  // Mock run function - since we can't execute Python in browser easily without Pyodide (heavy),
  // we will simulate an output or explain that this is a conceptual sandbox.
  const handleRunCode = () => {
    setOutput("Note: This is a conceptual sandbox. Code execution requires a backend runtime. \n\nHowever, your syntax logic appears structured!");
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-gray-500" />
          <h3 className="font-semibold text-gray-700 text-sm">Python Sandbox</h3>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleGetHint}
            disabled={loadingHint}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-iitm-red bg-iitm-red-light rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
          >
            {loadingHint ? <RefreshCw className="w-3 h-3 animate-spin" /> : <HelpCircle className="w-3 h-3" />}
            Get Hint
          </button>
          <button 
            onClick={handleRunCode}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-iitm-red rounded-lg hover:bg-iitm-red-dark transition-colors"
          >
            <Play className="w-3 h-3" />
            Run (Mock)
          </button>
        </div>
      </div>

      <div className="flex-1 relative">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-full p-4 font-mono text-sm bg-[#1e1e1e] text-gray-200 resize-none focus:outline-none leading-6"
          spellCheck={false}
          placeholder="# Write your Python code here..."
        />
      </div>

      {hint && (
        <div className="bg-yellow-50 border-t border-yellow-100 p-3 animate-in slide-in-from-bottom-2">
          <p className="text-sm text-yellow-800 flex gap-2">
            <span className="font-bold">Hint:</span> {hint}
          </p>
        </div>
      )}

      {output && (
        <div className="bg-black text-green-400 font-mono text-xs p-3 border-t border-gray-700 max-h-32 overflow-y-auto">
          <pre>{output}</pre>
        </div>
      )}
    </div>
  );
};