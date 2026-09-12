
import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { TrolleyItem, BillingSummary } from '../types';

interface ReceiptModalProps {
  items: TrolleyItem[];
  summary: BillingSummary;
  onClose: () => void;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ items, summary, onClose }) => {
  const [paymentMethod, setPaymentMethod] = useState<'digital' | 'cash'>('digital');
  const invoiceId = `INV-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  const qrValue = JSON.stringify({
    invoiceId,
    total: summary.grandTotal,
    itemsCount: items.length,
    timestamp: new Date().toISOString(),
    method: paymentMethod
  });

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
          <div className="text-center mb-6">
            <p className="text-slate-400 text-sm mb-1 uppercase tracking-widest">Checkout Summary</p>
            <h4 className="text-4xl font-bold text-slate-800">₹{summary.grandTotal.toFixed(2)}</h4>
            <p className="text-xs text-slate-400 mt-2 mono">{invoiceId}</p>
          </div>

          <div className="flex gap-2 mb-8 p-1 bg-slate-100 rounded-xl">
            <button 
              onClick={() => setPaymentMethod('digital')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${paymentMethod === 'digital' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
              Digital
            </button>
            <button 
              onClick={() => setPaymentMethod('cash')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${paymentMethod === 'cash' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              Cash
            </button>
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
             {paymentMethod === 'digital' ? (
               <>
                 <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                    <QRCodeCanvas 
                      value={qrValue} 
                      size={128}
                      level="H"
                      includeMargin={false}
                    />
                 </div>
                 <p className="text-center text-xs text-slate-400">Scan this QR code at the exit gate to finish your journey.</p>
               </>
             ) : (
               <div className="w-full p-6 bg-blue-50 border border-blue-100 rounded-2xl text-center">
                 <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                 </div>
                 <h5 className="font-bold text-blue-900 mb-1">Cash Payment Required</h5>
                 <p className="text-xs text-blue-700 leading-relaxed">
                   Please proceed to <strong>Counter #4</strong> (Express Cashier). 
                   Show this screen or the invoice ID to the cashier to complete your payment.
                 </p>
               </div>
             )}
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
