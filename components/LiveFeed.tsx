
import React from 'react';
import { TrolleyItem } from '../types';

interface LiveFeedProps {
  lastItem: TrolleyItem | null;
}

const LiveFeed: React.FC<LiveFeedProps> = ({ lastItem }) => {
  return (
    <div className="space-y-6">
      <div className="relative aspect-video bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 group">
        {/* Scanner Simulation Graphics */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3/4 h-3/4 border-2 border-blue-500/30 rounded-xl flex items-center justify-center">
             <div className="w-1/2 h-1/2 border border-blue-400/20 rounded-lg animate-pulse"></div>
          </div>
          {/* Scanning Line Animation */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-[bounce_2s_infinite]"></div>
          
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent"></div>
        </div>

        <div className="absolute top-4 left-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Live Camera</span>
        </div>

        <div className="absolute bottom-4 left-4 right-4 bg-slate-900/80 backdrop-blur-md p-3 rounded-xl border border-slate-700">
          <p className="text-[9px] uppercase font-bold text-blue-400 tracking-widest mb-1">Status</p>
          <p className="text-xs font-medium text-white truncate">
            {lastItem ? `Detected: ${lastItem.name}` : 'Waiting for RFID input...'}
          </p>
        </div>
      </div>

      <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Last Activity</h4>
        {lastItem ? (
           <div className="flex gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${lastItem.status === 'Scanned' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {lastItem.status === 'Scanned' ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" /></svg>
                )}
              </div>
              <div>
                 <p className="text-sm font-bold text-white">{lastItem.status === 'Scanned' ? 'Added' : 'Removed'}</p>
                 <p className="text-xs text-slate-400 truncate w-32">{lastItem.name}</p>
                 <p className="text-[10px] text-slate-500 mt-1">{lastItem.timestamp.toLocaleTimeString()}</p>
              </div>
           </div>
        ) : (
          <p className="text-xs text-slate-500 italic">No activity detected yet.</p>
        )}
      </div>
    </div>
  );
};

export default LiveFeed;
