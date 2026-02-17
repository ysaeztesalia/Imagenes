import React from 'react';
import { AppState, GroundingUrl } from '../types';
import { Sparkles, RefreshCw, Image as ImageIcon } from 'lucide-react';

interface PromptDisplayProps {
  prompt: string;
  setPrompt: (p: string) => void;
  onRegenerate: () => void;
  onGenerateImage: () => void;
  appState: AppState;
  sources: GroundingUrl[];
}

const PromptDisplay: React.FC<PromptDisplayProps> = ({ 
  prompt, 
  setPrompt, 
  onRegenerate, 
  onGenerateImage, 
  appState,
  sources
}) => {
  if (appState === AppState.IDLE || appState === AppState.GENERATING_PROMPT) return null;

  const isGeneratingImage = appState === AppState.GENERATING_IMAGE;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center border-b pb-2 mb-4">
        <h2 className="text-xl font-bold text-gray-800">2. Revisión del Prompt</h2>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">Gemini Thinking Mode</span>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-gray-500">
          Este es el prompt generado. Puedes editarlo si deseas ajustar detalles antes de crear la imagen.
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full h-40 border border-gray-300 rounded-lg p-3 bg-gray-50 text-gray-800 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-y"
          disabled={isGeneratingImage}
        />
      </div>

      {sources.length > 0 && (
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
          <p className="text-xs font-bold text-gray-500 mb-2 uppercase">Fuentes Utilizadas (Grounding)</p>
          <ul className="list-disc list-inside space-y-1">
            {sources.map((source, index) => (
              <li key={index} className="text-xs truncate">
                <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {source.title || source.uri}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 pt-2">
        <button
          onClick={onRegenerate}
          disabled={isGeneratingImage}
          className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
        >
          <RefreshCw size={18} />
          Regenerar Prompt
        </button>
        <button
          onClick={onGenerateImage}
          disabled={isGeneratingImage || !prompt.trim()}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg shadow transition flex items-center justify-center gap-2"
        >
          {isGeneratingImage ? (
             <>
             <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
             Creando Imagen...
           </>
          ) : (
            <>
              <Sparkles size={18} />
              Generar Imagen (1K)
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PromptDisplay;