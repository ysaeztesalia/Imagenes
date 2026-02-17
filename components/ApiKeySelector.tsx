import React, { useEffect, useState } from 'react';

const ApiKeySelector: React.FC<{ onKeySelected: () => void }> = ({ onKeySelected }) => {
  const [hasKey, setHasKey] = useState<boolean>(false);

  const checkKey = async () => {
    if (window.aistudio) {
      const selected = await window.aistudio.hasSelectedApiKey();
      setHasKey(selected);
      if (selected) {
        onKeySelected();
      }
    } else {
        // Fallback for dev environments where window.aistudio might not exist
        // We assume process.env.API_KEY works there.
        onKeySelected(); 
        setHasKey(true);
    }
  };

  useEffect(() => {
    checkKey();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      await checkKey();
    }
  };

  if (hasKey) return null;

  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded shadow-sm">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-bold">Acceso Premium Requerido</p>
          <p className="text-sm">Para generar imágenes en alta definición (1000x1000), necesitas seleccionar una API Key válida.</p>
        </div>
        <button
          onClick={handleSelectKey}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded transition duration-200"
        >
          Conectar API Key
        </button>
      </div>
      <div className="mt-2 text-xs text-yellow-800">
        <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="underline">
          Ver documentación de facturación
        </a>
      </div>
    </div>
  );
};

export default ApiKeySelector;