import React from 'react';
import { AppState } from '../types';
import { Download, CheckCircle } from 'lucide-react';

interface ImageResultProps {
  imageUrl: string | null;
  appState: AppState;
}

const ImageResult: React.FC<ImageResultProps> = ({ imageUrl, appState }) => {
  if (!imageUrl || appState !== AppState.IMAGE_READY) return null;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 animate-fade-in border-2 border-indigo-100">
      <div className="flex items-center gap-2 mb-4 border-b pb-2">
         <CheckCircle className="text-green-500" size={24} />
         <h2 className="text-xl font-bold text-gray-800">3. Resultado Final</h2>
      </div>

      <div className="flex flex-col items-center space-y-6">
        <div className="relative group">
           <img 
            src={imageUrl} 
            alt="Generated Result" 
            className="rounded-lg shadow-lg max-w-full h-auto border border-gray-200"
            style={{ maxHeight: '500px' }}
          />
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
            1000 x 1000 px
          </div>
        </div>

        <a 
          href={imageUrl} 
          download="mercado-genai-producto.png"
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition flex items-center gap-2 transform hover:scale-105"
        >
          <Download size={20} />
          Descargar PNG
        </a>
      </div>
    </div>
  );
};

export default ImageResult;