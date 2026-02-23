
import React from 'react';
import { TrolleyItem } from '../types';

interface TrolleyTableProps {
  items: TrolleyItem[];
}

const TrolleyTable: React.FC<TrolleyTableProps> = ({ items }) => {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <p className="text-lg font-medium">Your trolley is empty</p>
        <p className="text-sm">Scan an item to begin billing</p>
      </div>
    );
  }

  return (
    <table className="w-full text-left border-collapse">
      <thead className="sticky top-0 bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider z-10 border-b border-slate-200">
        <tr>
          <th className="px-6 py-4">Item Name</th>
          <th className="px-6 py-4">Product ID</th>
          <th className="px-6 py-4">Price</th>
          <th className="px-6 py-4">GST %</th>
          <th className="px-6 py-4">GST Amount</th>
          <th className="px-6 py-4">Total Price</th>
          <th className="px-6 py-4">Status</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {items.map((item) => (
          <tr 
            key={item.scanId} 
            className={`transition-all duration-300 ${item.status === 'Removed' ? 'bg-red-50/30' : 'hover:bg-slate-50'}`}
          >
            <td className="px-6 py-4 font-semibold text-slate-800">{item.name}</td>
            <td className="px-6 py-4 text-sm font-medium mono text-slate-400">{item.productId}</td>
            <td className="px-6 py-4 text-slate-600 font-medium">₹{item.price.toFixed(2)}</td>
            <td className="px-6 py-4 text-slate-500 text-sm">{item.gstPercent}%</td>
            <td className="px-6 py-4 text-slate-600">₹{item.gstAmount.toFixed(2)}</td>
            <td className="px-6 py-4 font-bold text-slate-800">₹{item.totalPrice.toFixed(2)}</td>
            <td className="px-6 py-4">
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                item.status === 'Scanned' 
                  ? 'bg-green-100 text-green-700 border border-green-200' 
                  : 'bg-red-100 text-red-700 border border-red-200'
              }`}>
                {item.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TrolleyTable;
