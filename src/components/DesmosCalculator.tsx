import React, { useState, useRef, useEffect } from 'react';
import { X, Maximize2, Minimize2, Plus, Trash2, Calculator, Play } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isFloating?: boolean;
}

interface Expression {
  id: string;
  text: string;
  color: string;
}

export const DesmosCalculator: React.FC<Props> = ({ isOpen, onClose, isFloating = true }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expressions, setExpressions] = useState<Expression[]>([
    { id: '1', text: 'y = 2x^2 - 8x + 8', color: '#f59e0b' },
    { id: '2', text: 'y = -x + 4', color: '#38bdf8' },
  ]);
  const [activeExpId, setActiveExpId] = useState('1');
  const [calcDisplay, setCalcDisplay] = useState('0');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const colors = ['#f59e0b', '#38bdf8', '#10b981', '#ec4899', '#a855f7'];

  // Add expression
  const addExpression = () => {
    const newId = String(Date.now());
    const nextColor = colors[expressions.length % colors.length];
    setExpressions([...expressions, { id: newId, text: 'y = x', color: nextColor }]);
    setActiveExpId(newId);
  };

  const removeExpression = (id: string) => {
    if (expressions.length <= 1) return;
    setExpressions(expressions.filter((e) => e.id !== id));
  };

  const updateExpression = (id: string, text: string) => {
    setExpressions(expressions.map((e) => (e.id === id ? { ...e, text } : e)));
  };

  // Graph Canvas Renderer
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const originX = width / 2;
    const originY = height / 2;
    const scale = 25; // 25px per unit

    // Clear background
    ctx.fillStyle = '#0c0a09';
    ctx.fillRect(0, 0, width, height);

    // Draw Grid lines
    ctx.strokeStyle = '#292524';
    ctx.lineWidth = 1;

    for (let x = originX % scale; x < width; x += scale) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = originY % scale; y < height; y += scale) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#78716c';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, height);
    ctx.stroke();

    // Axis Labels
    ctx.fillStyle = '#a8a29e';
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillText('0', originX + 4, originY + 12);
    for (let i = -10; i <= 10; i += 2) {
      if (i === 0) continue;
      const posX = originX + i * scale;
      const posY = originY - i * scale;
      if (posX > 0 && posX < width) ctx.fillText(String(i), posX - 4, originY + 12);
      if (posY > 0 && posY < height) ctx.fillText(String(i), originX + 4, posY + 4);
    }

    // Evaluate and plot each expression
    expressions.forEach((exp) => {
      ctx.strokeStyle = exp.color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();

      let isStarting = true;
      const cleanExpr = exp.text.replace(/y\s*=\s*/, '').trim();

      for (let px = 0; px < width; px += 2) {
        const x = (px - originX) / scale;
        let y = 0;

        try {
          // Simple math evaluator for basic equations
          if (cleanExpr.includes('x^2')) {
            // quadratic
            const parts = cleanExpr.split('x^2');
            const a = parseFloat(parts[0]) || (parts[0] === '-' ? -1 : 1);
            let rest = parts[1] || '';
            let b = 0;
            let c = 0;
            if (rest.includes('x')) {
              const bParts = rest.split('x');
              b = parseFloat(bParts[0].replace(/\s+/g, '')) || 0;
              c = parseFloat(bParts[1]?.replace(/\s+/g, '') || '0') || 0;
            } else {
              c = parseFloat(rest.replace(/\s+/g, '') || '0') || 0;
            }
            y = a * x * x + b * x + c;
          } else if (cleanExpr.includes('x')) {
            // linear: mx + b
            const parts = cleanExpr.split('x');
            const m = parseFloat(parts[0]) || (parts[0] === '-' ? -1 : (parts[0] === '' ? 1 : 0));
            const b = parseFloat(parts[1]?.replace(/\s+/g, '') || '0') || 0;
            y = m * x + b;
          } else if (cleanExpr.includes('sin')) {
            y = Math.sin(x);
          } else if (cleanExpr.includes('cos')) {
            y = Math.cos(x);
          } else {
            y = parseFloat(cleanExpr) || 0;
          }

          const py = originY - y * scale;
          if (py >= -200 && py <= height + 200) {
            if (isStarting) {
              ctx.moveTo(px, py);
              isStarting = false;
            } else {
              ctx.lineTo(px, py);
            }
          } else {
            isStarting = true;
          }
        } catch {
          // ignore expression parsing error during live typing
        }
      }
      ctx.stroke();
    });
  }, [expressions, isOpen, isExpanded]);

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Keypad actions
  const handleKeypad = (val: string) => {
    if (val === 'C') {
      setCalcDisplay('0');
    } else if (val === '=') {
      try {
        const sanitized = calcDisplay.replace(/\^/g, '**').replace(/(\d+)\(/g, '$1*(');
        // eslint-disable-next-line no-eval
        const res = eval(sanitized);
        setCalcDisplay(String(Number(res.toFixed(6))));
      } catch {
        setCalcDisplay('Error');
      }
    } else if (val === 'DEL') {
      setCalcDisplay((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
    } else {
      setCalcDisplay((prev) => (prev === '0' || prev === 'Error' ? val : prev + val));
    }
  };

  return (
    <div
      className={`fixed z-50 bg-[#111111] border border-[#1F2937] rounded-2xl shadow-2xl overflow-hidden flex flex-col text-[#F3F4F6] transition-all duration-300 font-sans ${
        isExpanded
          ? 'inset-3 sm:inset-6 max-w-none max-h-none'
          : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-32px)] sm:w-full max-w-xl h-[520px] max-h-[85vh]'
      }`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0A0A0A] border-b border-[#1F2937] select-none">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
          <span className="font-bold text-xs tracking-wider uppercase text-white">
            Official Desmos Graphing Suite
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-600/20 text-blue-300 font-mono font-bold border border-blue-500/30">
            SAT Edition
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-white hover:bg-[#1A1A1A] transition-colors cursor-pointer"
            title={isExpanded ? 'Restore window' : 'Maximize window'}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-rose-400 hover:bg-[#1A1A1A] transition-colors cursor-pointer"
            title="Close Desmos"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main split: Left Equations & Keypad, Right Graph */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#111111]">
        {/* Left Side: Expressions & Keypad */}
        <div className="w-full md:w-64 border-r border-[#1F2937] flex flex-col bg-[#0A0A0A]">
          <div className="p-3 border-b border-[#1F2937] flex items-center justify-between">
            <span className="text-xs font-bold text-white">Functions</span>
            <button
              onClick={addExpression}
              className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg bg-[#1A1A1A] hover:bg-[#222222] border border-[#1F2937] text-white font-bold cursor-pointer transition-colors"
            >
              <Plus className="w-3 h-3 text-blue-400" /> Add
            </button>
          </div>

          {/* Expressions list */}
          <div className="flex-1 p-2 space-y-1.5 overflow-y-auto max-h-48 md:max-h-none">
            {expressions.map((exp) => (
              <div
                key={exp.id}
                onClick={() => setActiveExpId(exp.id)}
                className={`flex items-center gap-2 p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                  activeExpId === exp.id
                    ? 'bg-[#1A1A1A] border-blue-500'
                    : 'bg-[#111111] border-[#1F2937]'
                }`}
              >
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: exp.color }}
                />
                <input
                  type="text"
                  value={exp.text}
                  onChange={(e) => updateExpression(exp.id, e.target.value)}
                  className="flex-1 bg-transparent font-mono text-xs text-white focus:outline-none"
                  placeholder="y = mx + b"
                />
                {expressions.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeExpression(exp.id);
                    }}
                    className="text-[#6B7280] hover:text-rose-400 p-0.5 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Quick Arithmetic Display */}
          <div className="p-2.5 border-t border-[#1F2937] bg-[#0A0A0A]">
            <div className="p-2 bg-[#111111] rounded-lg border border-[#1F2937] font-mono text-right text-sm text-blue-400 font-bold tracking-wider overflow-x-auto">
              {calcDisplay}
            </div>
            {/* Keypad Grid */}
            <div className="grid grid-cols-4 gap-1 mt-2 text-xs">
              {['7', '8', '9', 'DEL', '4', '5', '6', '/', '1', '2', '3', '*', '0', '.', '=', '+'].map(
                (btn) => (
                  <button
                    key={btn}
                    onClick={() => handleKeypad(btn)}
                    className={`py-1.5 rounded-lg font-mono font-bold transition-colors cursor-pointer ${
                      btn === '='
                        ? 'bg-blue-600 hover:bg-blue-500 text-white'
                        : btn === 'DEL' || btn === 'C'
                        ? 'bg-[#1A1A1A] text-rose-400 hover:bg-[#222222] border border-[#1F2937]'
                        : ['+', '-', '*', '/'].includes(btn)
                        ? 'bg-[#1A1A1A] text-blue-400 hover:bg-[#222222] border border-[#1F2937]'
                        : 'bg-[#161616] text-white hover:bg-[#202020] border border-[#1F2937]'
                    }`}
                  >
                    {btn}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Graph Canvas */}
        <div className="flex-1 relative bg-[#0A0A0A] flex items-center justify-center p-1">
          <canvas
            ref={canvasRef}
            width={isExpanded ? 800 : 420}
            height={isExpanded ? 600 : 360}
            className="w-full h-full rounded-xl border border-[#1F2937] cursor-crosshair"
          />
          <div className="absolute top-3 right-3 bg-[#111111]/90 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[11px] font-mono text-[#9CA3AF] border border-[#1F2937]">
            Grid: [-10, 10]
          </div>
        </div>
      </div>
    </div>
  );
};
