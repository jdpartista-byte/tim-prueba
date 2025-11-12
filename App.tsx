
import React, { useState, useCallback } from 'react';
import { LoyaltyCard } from './components/LoyaltyCard';
import { ScannerView } from './components/ScannerView';
import { useLocalStorage } from './hooks/useLocalStorage';
import { View } from './types';

const MAX_VISITS = 6;
const REWARD_VISIT_COUNT = 7;

function App() {
  const [view, setView] = useState<View>(View.CUSTOMER);
  const [visits, setVisits] = useLocalStorage<number>('loyalty-visits', 0);

  const rewardAvailable = visits >= MAX_VISITS;

  const handleAddVisit = useCallback(() => {
    if (visits < MAX_VISITS) {
      setVisits(prev => prev + 1);
    }
  }, [visits, setVisits]);

  const handleRedeemReward = useCallback(() => {
    if (rewardAvailable) {
      setVisits(0);
      alert('¡Recompensa de 50k aplicada! La tarjeta ha sido reiniciada.');
    }
  }, [rewardAvailable, setVisits]);

  const toggleView = () => {
    setView(prev => (prev === View.CUSTOMER ? View.SCANNER : View.CUSTOMER));
  };
  
  const SwitchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-4 antialiased">
      <div className="w-full max-w-md mx-auto bg-gray-800 rounded-3xl shadow-2xl overflow-hidden relative">
        <header className="p-4 bg-gray-900/50 flex justify-between items-center border-b border-yellow-400/20">
          <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a2 2 0 100-4V6z" />
            </svg>
            <h1 className="text-2xl font-bold tracking-wider text-white uppercase font-display">
              Tiempo <span className="text-yellow-400">Extra</span>
            </h1>
          </div>
          <button
            onClick={toggleView}
            className="p-2 rounded-full hover:bg-yellow-400/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-yellow-400"
            aria-label="Toggle view"
          >
            <SwitchIcon />
          </button>
        </header>

        <main className="p-6 transition-all duration-500">
          {view === View.CUSTOMER && (
            <LoyaltyCard 
              visits={visits} 
              maxVisits={MAX_VISITS} 
              rewardVisitCount={REWARD_VISIT_COUNT}
            />
          )}
          {view === View.SCANNER && (
            <ScannerView 
              visits={visits}
              rewardAvailable={rewardAvailable}
              onAddVisit={handleAddVisit}
              onRedeemReward={handleRedeemReward}
            />
          )}
        </main>
         <footer className="bg-gray-900/50 text-center p-3 text-xs text-gray-400 border-t border-yellow-400/20">
          <p>Modo actual: {view === View.CUSTOMER ? 'Cliente' : 'Negocio'}</p>
        </footer>
      </div>
       <div className="text-center mt-6 text-gray-500 text-sm max-w-md">
            <h3 className="font-bold text-gray-300 mb-2 font-display uppercase tracking-wider">¿Cómo funciona?</h3>
            <p className="mb-2"><strong>Cliente:</strong> Muestra tu tarjeta (con el código QR) al personal para registrar tu visita (+50k de consumo).</p>
            <p><strong>Negocio:</strong> Cambia a la vista de negocio, escanea el QR del cliente para añadir una visita o canjear el premio de 50k en la 7ª visita.</p>
        </div>
    </div>
  );
}

export default App;
