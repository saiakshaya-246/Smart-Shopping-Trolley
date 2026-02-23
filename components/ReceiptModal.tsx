
import React from 'react';
import { TrolleyItem, BillingSummary } from '../types';

interface ReceiptModalProps {
  items: TrolleyItem[];
  summary: BillingSummary;
  onClose: () => void;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ items, summary, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="bg-slate-50 px-6 py-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">ST</div>
            <h3 className="font-bold text-lg">Digital Receipt</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-1 p-8 overflow-y-auto">
          <div className="text-center mb-8">
            <p className="text-slate-400 text-sm mb-1 uppercase tracking-widest">Transaction Successful</p>
            <h4 className="text-4xl font-bold text-slate-800">₹{summary.grandTotal.toFixed(2)}</h4>
            <p className="text-xs text-slate-400 mt-2 mono">INV-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
          </div>

          <div className="space-y-4 mb-8">
            <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">Itemized Breakdown</p>
            {items.map(item => (
              <div key={item.scanId} className="flex justify-between items-center text-sm">
                <div className="flex-1">
                  <p className="font-semibold text-slate-800">{item.name}</p>
                  <p className="text-xs text-slate-400">1 x ₹{item.price.toFixed(2)} + {item.gstPercent}% GST</p>
                </div>
                <p className="font-bold text-slate-800">₹{item.totalPrice.toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-dashed border-slate-200 pt-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Subtotal</span>
              <span className="font-medium">₹{summary.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Total Tax (GST)</span>
              <span className="font-medium">₹{summary.totalGst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-slate-800 pt-2 border-t border-slate-100">
              <span>Grand Total</span>
              <span>₹{summary.grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center gap-4">
             <div className="w-32 h-32 bg-slate-100 rounded-xl flex items-center justify-center text-slate-300">
                <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24"><path d="M3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2zm12 4c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-3 8c-1.91 0-3.53-1.03-4.43-2.56.39-.41.81-.73 1.25-.93.58.91 1.58 1.49 2.68 1.49s2.1-.58 2.68-1.49c.44.2.86.52 1.25.93C15.53 15.97 13.91 17 12 17z"/></svg>
             </div>
             <p className="text-center text-xs text-slate-400">Scan this QR code at the exit gate to finish your journey.</p>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100">
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-4 bg-slate-800 text-white font-bold rounded-2xl hover:bg-slate-900 transition-all shadow-lg shadow-slate-200"
          >
            Done & Reset Trolley
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
