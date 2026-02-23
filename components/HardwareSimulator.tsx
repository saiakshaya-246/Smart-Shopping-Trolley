
import React, { useState } from 'react';
import { MOCK_PRODUCTS } from '../constants';

interface HardwareSimulatorProps {
  onScan: (productId: string) => void;
}

const HardwareSimulator: React.FC<HardwareSimulatorProps> = ({ onScan }) => {
  const [isOpen, setIsOpen] = useState(false);

  const simulateRandomScan = () => {
    const randomProduct = MOCK_PRODUCTS[Math.floor(Math.random() * MOCK_PRODUCTS.length)];
    onScan(randomProduct.id);
  };

  return (
    <div className="pt-4 border-t border-slate-700">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-xs font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-widest mb-3"
      >
        <span>Hardware Simulator</span>
        <svg className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
      </button>

      {isOpen && (
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <p className="text-[10px] text-slate-400 leading-relaxed italic">
            Normally, these actions are triggered by the physical RFID gate. For this demo, click a product to simulate a real-time scan event.
          </p>
          
          <button 
            onClick={simulateRandomScan}
            className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold rounded uppercase tracking-widest transition-all mb-2 shadow-inner"
          >
            Trigger Random Scan
          </button>

          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
            {MOCK_PRODUCTS.map(product => (
              <button
                key={product.id}
                onClick={() => onScan(product.id)}
                className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-left transition-colors"
              >
                <p className="text-[10px] font-bold text-white truncate">{product.name}</p>
                <p className="text-[9px] text-slate-500 mono">{product.id}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HardwareSimulator;
