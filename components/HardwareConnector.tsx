
import React, { useState, useEffect, useRef } from 'react';

interface HardwareConnectorProps {
  onScan: (productId: string) => void;
}

const HardwareConnector: React.FC<HardwareConnectorProps> = ({ onScan }) => {
  const [isSerialSupported, setIsSerialSupported] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [port, setPort] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Keyboard buffer for keyboard-wedge scanners
  const bufferRef = useRef<string>('');
  const lastKeyTimeRef = useRef<number>(0);

  useEffect(() => {
    setIsSerialSupported('serial' in navigator);

    const handleKeyDown = (e: KeyboardEvent) => {
      const now = Date.now();
      
      // If there's a long pause, reset the buffer (assuming manual typing vs scanner)
      if (now - lastKeyTimeRef.current > 100) {
        bufferRef.current = '';
      }
      lastKeyTimeRef.current = now;

      if (e.key === 'Enter') {
        if (bufferRef.current.length > 2) {
          console.log('Scanned via Keyboard:', bufferRef.current);
          onScan(bufferRef.current.trim());
        }
        bufferRef.current = '';
      } else if (e.key.length === 1) {
        bufferRef.current += e.key;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onScan]);

  const connectSerial = async () => {
    try {
      setError(null);
      const nav = navigator as any;
      const selectedPort = await nav.serial.requestPort();
      await selectedPort.open({ baudRate: 9600 });
      
      setPort(selectedPort);
      setIsConnected(true);
      
      const reader = selectedPort.readable.getReader();
      
      let serialBuffer = '';
      
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          reader.releaseLock();
          break;
        }
        
        // Convert Uint8Array to string
        const textChunk = new TextDecoder().decode(value);
        serialBuffer += textChunk;
        
        // If we find a newline, we have a complete tag ID
        if (serialBuffer.includes('\n') || serialBuffer.includes('\r')) {
          const lines = serialBuffer.split(/\r?\n/);
          // The last element might be an incomplete line
          serialBuffer = lines.pop() || '';
          
          for (const line of lines) {
            const cleanLine = line.trim();
            if (cleanLine) {
              console.log('Scanned via Serial:', cleanLine);
              onScan(cleanLine);
            }
          }
        }
      }
    } catch (err: any) {
      console.error('Serial connection error:', err);
      setError(err.message || 'Failed to connect');
      setIsConnected(false);
    }
  };

  return (
    <div className="p-4 bg-slate-800 rounded-xl border border-slate-700 space-y-3 mt-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Physical Device</h3>
        <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-slate-600'}`}></span>
      </div>

      {!isConnected ? (
        <div className="space-y-2">
          {isSerialSupported ? (
            <button 
              onClick={connectSerial}
              className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold rounded uppercase tracking-widest transition-all"
            >
              Connect RFID via Serial
            </button>
          ) : (
            <p className="text-[10px] text-amber-400 italic">
              Web Serial not supported in this browser. Use keyboard-wedge scanner.
            </p>
          )}
          <p className="text-[9px] text-slate-500">
            Keyboard listener active. Scan with a wedge reader anytime.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          <p className="text-[10px] text-green-400 font-medium">Hardware Connected</p>
          <button 
            onClick={() => {
              if (port) port.close();
              setIsConnected(false);
              setPort(null);
            }}
            className="text-[9px] text-slate-400 hover:text-white underline text-left"
          >
            Disconnect
          </button>
        </div>
      )}

      {error && <p className="text-[9px] text-red-400">{error}</p>}
    </div>
  );
};

export default HardwareConnector;
