import React, { useRef } from 'react';
import { ProductData, AppState } from '../types';
import { Camera, Link, Type } from 'lucide-react';

interface InputSectionProps {
  data: ProductData;
  setData: React.Dispatch<React.SetStateAction<ProductData>>;
  onGeneratePrompt: () => void;
  appState: AppState;
}

const InputSection: React.FC<InputSectionProps> = ({ data, setData, onGeneratePrompt, appState }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // Extract base64 part
        const base64Data = result.split(',')[1];
        setData(prev => ({
          ...prev,
          referenceImage: base64Data,
          referenceMimeType: file.type
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const isGenerating = appState === AppState.GENERATING_PROMPT || appState === AppState.GENERATING_IMAGE;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
      <h2 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">1. Detalles del Producto</h2>
      
      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <Type size={16} /> Descripción
        </label>
        <textarea
          value={data.description}
          onChange={(e) => setData(prev => ({ ...prev, description: e.target.value }))}
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition h-24 resize-none"
          placeholder="Ej: Zapatillas deportivas rojas con suela blanca, estilo urbano..."
          disabled={isGenerating}
        />
      </div>

      {/* URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <Link size={16} /> Enlace / URL (Lector de enlaces)
        </label>
        <input
          type="text"
          value={data.url}
          onChange={(e) => setData(prev => ({ ...prev, url: e.target.value }))}
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          placeholder="https://..."
          disabled={isGenerating}
        />
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <Camera size={16} /> Imagen de Referencia
        </label>
        <div className="flex items-center gap-4">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            disabled={isGenerating}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg border border-gray-300 transition text-sm disabled:opacity-50"
            disabled={isGenerating}
          >
            Subir Imagen
          </button>
          {data.referenceImage && (
            <span className="text-sm text-green-600 font-medium flex items-center gap-1">
              ✓ Imagen cargada
              <button 
                onClick={() => setData(prev => ({ ...prev, referenceImage: null, referenceMimeType: null }))}
                className="ml-2 text-red-500 text-xs hover:underline"
              >
                (Eliminar)
              </button>
            </span>
          )}
        </div>
      </div>

      <button
        onClick={onGeneratePrompt}
        disabled={isGenerating || (!data.description && !data.url && !data.referenceImage)}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold py-3 px-6 rounded-lg shadow transition duration-200 mt-4 flex justify-center items-center gap-2"
      >
        {appState === AppState.GENERATING_PROMPT ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            Analizando y Creando Prompt...
          </>
        ) : (
          "Generar Prompt"
        )}
      </button>
    </div>
  );
};

export default InputSection;