
import React from 'react';
import { BillingSummary } from '../types';

interface SummaryCardsProps {
  summary: BillingSummary;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Subtotal</p>
          <p className="text-2xl font-bold text-slate-800">₹{summary.subtotal.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
        <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
        </div>
        <div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Total GST</p>
          <p className="text-2xl font-bold text-slate-800">₹{summary.totalGst.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-blue-600 p-6 rounded-2xl shadow-lg shadow-blue-200 flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-500/30 text-white rounded-xl flex items-center justify-center">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
        </div>
        <div>
          <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-1">Grand Total</p>
          <p className="text-2xl font-bold text-white">₹{summary.grandTotal.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
