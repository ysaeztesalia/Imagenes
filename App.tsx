import React, { useState } from 'react';
import { ProductData, AppState, GroundingUrl } from './types';
import InputSection from './components/InputSection';
import PromptDisplay from './components/PromptDisplay';
import ImageResult from './components/ImageResult';
import ApiKeySelector from './components/ApiKeySelector';
import { generateProductPrompt, generateMarketingImage } from './services/geminiService';
import { ShoppingBag, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [productData, setProductData] = useState<ProductData>({
    description: '',
    url: '',
    referenceImage: null,
    referenceMimeType: null,
  });

  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [groundingSources, setGroundingSources] = useState<GroundingUrl[]>([]);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isKeyReady, setIsKeyReady] = useState(false);

  const handleGeneratePrompt = async () => {
    setAppState(AppState.GENERATING_PROMPT);
    setErrorMsg(null);
    setGeneratedImageUrl(null); // Reset previous image
    
    try {
      const { prompt, sources } = await generateProductPrompt(productData);
      setGeneratedPrompt(prompt);
      setGroundingSources(sources);
      setAppState(AppState.PROMPT_REVIEW);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Error al generar el prompt. Verifica tu conexión o intenta nuevamente.");
      setAppState(AppState.ERROR);
    }
  };

  const handleGenerateImage = async () => {
    setAppState(AppState.GENERATING_IMAGE);
    setErrorMsg(null);

    try {
      const imgUrl = await generateMarketingImage(generatedPrompt);
      setGeneratedImageUrl(imgUrl);
      setAppState(AppState.IMAGE_READY);
    } catch (err: any) {
      console.error(err);
      let msg = "Error al generar la imagen.";
      if (err.message?.includes('API key')) {
        msg = "Error de API Key. Asegúrate de haber seleccionado una Key válida con acceso al modelo Image Pro.";
      }
      setErrorMsg(msg);
      setAppState(AppState.PROMPT_REVIEW); // Return to review state to try again
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      {/* Header */}
      <header className="bg-yellow-400 shadow-md py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="text-blue-900" size={28} />
            <h1 className="text-2xl font-bold text-blue-900 tracking-tight">MercadoGen AI</h1>
          </div>
          <div className="text-xs font-semibold text-blue-900 opacity-80 hidden sm:block">
            Powered by Gemini 2.5 & 3.0 Pro
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Crea imágenes de producto perfectas</h2>
          <p className="text-gray-600">
            Genera imágenes profesionales de 1000x1000px para tus publicaciones a partir de una descripción o enlace.
          </p>
        </div>

        <ApiKeySelector onKeySelected={() => setIsKeyReady(true)} />

        <div className={`space-y-8 transition-opacity duration-300 ${isKeyReady ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
          {/* Step 1: Input */}
          <InputSection 
            data={productData} 
            setData={setProductData} 
            onGeneratePrompt={handleGeneratePrompt}
            appState={appState}
          />

          {/* Error Message */}
          {errorMsg && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded flex items-center gap-2">
              <AlertCircle size={20} />
              <p>{errorMsg}</p>
            </div>
          )}

          {/* Step 2: Prompt Review */}
          <PromptDisplay 
            prompt={generatedPrompt} 
            setPrompt={setGeneratedPrompt} 
            onRegenerate={handleGeneratePrompt}
            onGenerateImage={handleGenerateImage}
            appState={appState}
            sources={groundingSources}
          />

          {/* Step 3: Result */}
          <ImageResult imageUrl={generatedImageUrl} appState={appState} />
        </div>
      </main>
    </div>
  );
};

export default App;