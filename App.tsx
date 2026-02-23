
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TrolleyItem, BillingSummary } from './types';
import { MOCK_PRODUCTS } from './constants';
import { getSmartSuggestions } from './services/geminiService';
import TrolleyTable from './components/TrolleyTable';
import SummaryCards from './components/SummaryCards';
import ReceiptModal from './components/ReceiptModal';
import LiveFeed from './components/LiveFeed';
import HardwareSimulator from './components/HardwareSimulator';

const App: React.FC = () => {
  const [items, setItems] = useState<TrolleyItem[]>([]);
  const [summary, setSummary] = useState<BillingSummary>({ subtotal: 0, totalGst: 0, grandTotal: 0 });
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [lastScannedItem, setLastScannedItem] = useState<TrolleyItem | null>(null);

  // Calculate summary whenever items change
  useEffect(() => {
    const activeItems = items.filter(item => item.status === 'Scanned');
    const subtotal = activeItems.reduce((acc, item) => acc + item.price, 0);
    const totalGst = activeItems.reduce((acc, item) => acc + item.gstAmount, 0);
    const grandTotal = subtotal + totalGst;

    setSummary({ subtotal, totalGst, grandTotal });
  }, [items]);

  // Handle incoming RFID data simulation
  const handleProductScan = useCallback((productId: string) => {
    const product = MOCK_PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    // Simulate RFID scanning logic: 
    // If the exact same scan was already 'Scanned', we remove it.
    // In a real RFID system, each physical item has a unique Tag ID. 
    // Here we simulate this by looking at existing items with same ID.
    const existingIndex = items.findIndex(i => i.productId === productId && i.status === 'Scanned');

    if (existingIndex !== -1) {
      // Toggle to removed
      const updatedItems = [...items];
      updatedItems[existingIndex] = {
        ...updatedItems[existingIndex],
        status: 'Removed',
        timestamp: new Date()
      };
      setItems(updatedItems);
      setLastScannedItem(updatedItems[existingIndex]);
    } else {
      // Add new scan
      const gstAmount = product.price * (product.gstPercent / 100);
      const newItem: TrolleyItem = {
        scanId: Math.random().toString(36).substr(2, 9).toUpperCase(),
        productId: product.id,
        name: product.name,
        price: product.price,
        gstPercent: product.gstPercent,
        gstAmount,
        totalPrice: product.price + gstAmount,
        status: 'Scanned',
        timestamp: new Date()
      };
      setItems(prev => [newItem, ...prev]);
      setLastScannedItem(newItem);
    }
  }, [items]);

  const handleFetchAiSuggestions = async () => {
    setIsAiLoading(true);
    const suggestion = await getSmartSuggestions(items);
    setAiSuggestion(suggestion);
    setIsAiLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Sidebar / Live Feed Area */}
      <aside className="lg:w-80 w-full bg-slate-900 text-white p-6 flex flex-col border-r border-slate-800">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl">ST</div>
          <h1 className="text-xl font-bold tracking-tight">SmartTrolley<span className="text-blue-400 font-normal">Live</span></h1>
        </div>

        <LiveFeed lastItem={lastScannedItem} />

        <div className="mt-auto space-y-4">
          <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Device Status</h3>
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              RFID Scanner Active
            </div>
            <div className="flex items-center gap-2 text-green-400 text-sm mt-1">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              API Gateway Online
            </div>
          </div>
          
          {/* Simulation Controls - Strictly for demo/hardware simulation purposes */}
          <HardwareSimulator onScan={handleProductScan} />
        </div>
      </aside>

      {/* Main Dashboard */}
      <main className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Billing Dashboard</h2>
            <p className="text-slate-500 text-sm">Real-time cart analysis & tax calculation</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleFetchAiSuggestions}
              disabled={isAiLoading || items.length === 0}
              className="px-4 py-2 bg-indigo-50 text-indigo-700 font-medium rounded-lg border border-indigo-100 hover:bg-indigo-100 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isAiLoading ? 'Analyzing...' : 'AI Suggestions'}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </button>
            <button 
              onClick={() => setIsReceiptOpen(true)}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center gap-2"
            >
              Proceed to Pay
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </button>
          </div>
        </div>

        {aiSuggestion && (
          <div className="mb-8 p-5 bg-white border border-indigo-100 rounded-2xl shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 text-indigo-200">
               <svg className="w-12 h-12 opacity-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
            </div>
            <h4 className="text-sm font-bold text-indigo-900 mb-2 flex items-center gap-2">
              <span className="bg-indigo-600 w-1.5 h-4 rounded-full"></span>
              Smart Assistant Recommendation
            </h4>
            <div className="text-slate-600 text-sm whitespace-pre-wrap">
              {aiSuggestion}
            </div>
            <button onClick={() => setAiSuggestion(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        )}

        <SummaryCards summary={summary} />

        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-8 flex flex-col">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="font-bold text-slate-800">Trolley Items ({items.filter(i => i.status === 'Scanned').length})</h3>
            <span className="text-xs text-slate-500 uppercase font-bold tracking-widest">Live Syncing</span>
          </div>
          <div className="flex-1 overflow-auto">
            <TrolleyTable items={items} />
          </div>
        </div>
      </main>

      {isReceiptOpen && (
        <ReceiptModal 
          items={items.filter(i => i.status === 'Scanned')} 
          summary={summary} 
          onClose={() => setIsReceiptOpen(false)} 
        />
      )}
    </div>
  );
};

export default App;
