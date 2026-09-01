import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Pen,
  Highlighter,
  Square,
  Circle as CircleIcon,
  Minus,
  Grid,
  Type,
  Eraser,
  Undo2,
  Redo2,
  Trash2,
  Download,
  Sigma,
  Plus,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { WhiteboardElement } from '../types';
import { KaTeXRenderer } from './KaTeXRenderer';

interface Props {
  className?: string;
  isHost?: boolean;
  onSnapshot?: (dataUrl: string) => void;
}

type ToolType = 'pen' | 'highlighter' | 'line' | 'rect' | 'circle' | 'axes' | 'grid' | 'text' | 'latex' | 'eraser';

const COLOR_PALETTE = [
  { name: 'Charcoal', value: '#1E1B18' },
  { name: 'Terracotta', value: '#E07A5F' },
  { name: 'Emerald', value: '#2A9D8F' },
  { name: 'Teal', value: '#264653' },
  { name: 'Slate', value: '#3D405B' },
  { name: 'Gold', value: '#E9C46A' },
  { name: 'White', value: '#FFFFFF' },
];

const STROKE_SIZES = [2, 4, 8, 16];

export const LiveWhiteboard: React.FC<Props> = ({
  className = '',
  isHost = true,
  onSnapshot,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [tool, setTool] = useState<ToolType>('pen');
  const [selectedColor, setSelectedColor] = useState<string>('#1E1B18');
  const [strokeWidth, setStrokeWidth] = useState<number>(3);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  // History for Undo/Redo
  const [elements, setElements] = useState<WhiteboardElement[]>([]);
  const [redoStack, setRedoStack] = useState<WhiteboardElement[][]>([]);

  // Current drawing element in progress
  const currentElementRef = useRef<WhiteboardElement | null>(null);

  // LaTeX / Text modal insertion state
  const [latexInput, setLatexInput] = useState<string>('f(x) = ax^2 + bx + c');
  const [isLatexModalOpen, setIsLatexModalOpen] = useState<boolean>(false);
  const [latexPos, setLatexPos] = useState<{ x: number; y: number }>({ x: 100, y: 100 });

  // Text insertion state
  const [textInput, setTextInput] = useState<string>('');
  const [isTextModalOpen, setIsTextModalOpen] = useState<boolean>(false);
  const [textPos, setTextPos] = useState<{ x: number; y: number }>({ x: 100, y: 100 });

  // Redraw canvas from element tree
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear with light ivory background
    ctx.fillStyle = '#FAF8F5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle background dot grid for SAT mathematical graphing
    ctx.save();
    ctx.fillStyle = '#E5E0D8';
    const gridSpacing = 30;
    for (let x = gridSpacing; x < canvas.width; x += gridSpacing) {
      for (let y = gridSpacing; y < canvas.height; y += gridSpacing) {
        ctx.beginPath();
        ctx.arc(x, y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();

    // Render all saved elements
    const allToDraw = [...elements];
    if (currentElementRef.current) {
      allToDraw.push(currentElementRef.current);
    }

    allToDraw.forEach((el) => {
      ctx.save();
      ctx.strokeStyle = el.color;
      ctx.fillStyle = el.color;
      ctx.lineWidth = el.strokeWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (el.type === 'highlighter') {
        ctx.globalAlpha = el.opacity ?? 0.35;
        ctx.lineWidth = el.strokeWidth * 3.5;
      } else {
        ctx.globalAlpha = el.opacity ?? 1.0;
      }

      if (el.type === 'pen' || el.type === 'highlighter') {
        if (el.points && el.points.length > 0) {
          ctx.beginPath();
          ctx.moveTo(el.points[0].x, el.points[0].y);
          for (let i = 1; i < el.points.length; i++) {
            ctx.lineTo(el.points[i].x, el.points[i].y);
          }
          ctx.stroke();
        }
      } else if (el.type === 'line') {
        if (el.points && el.points.length >= 2) {
          const p1 = el.points[0];
          const p2 = el.points[el.points.length - 1];
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      } else if (el.type === 'rect') {
        if (el.x !== undefined && el.y !== undefined && el.width && el.height) {
          ctx.beginPath();
          ctx.strokeRect(el.x, el.y, el.width, el.height);
        }
      } else if (el.type === 'circle') {
        if (el.x !== undefined && el.y !== undefined && el.width && el.height) {
          ctx.beginPath();
          const rx = Math.abs(el.width / 2);
          const ry = Math.abs(el.height / 2);
          const cx = el.x + el.width / 2;
          const cy = el.y + el.height / 2;
          ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
      } else if (el.type === 'axes') {
        // Cartesian coordinate plane
        if (el.x !== undefined && el.y !== undefined && el.width && el.height) {
          const cx = el.x + el.width / 2;
          const cy = el.y + el.height / 2;
          ctx.strokeStyle = el.color;
          ctx.lineWidth = Math.max(1.5, el.strokeWidth);

          // X Axis
          ctx.beginPath();
          ctx.moveTo(el.x, cy);
          ctx.lineTo(el.x + el.width, cy);
          ctx.stroke();

          // Y Axis
          ctx.beginPath();
          ctx.moveTo(cx, el.y);
          ctx.lineTo(cx, el.y + el.height);
          ctx.stroke();

          // Axis Arrows
          ctx.fillStyle = el.color;
          // X arrow
          ctx.beginPath();
          ctx.moveTo(el.x + el.width, cy);
          ctx.lineTo(el.x + el.width - 8, cy - 4);
          ctx.lineTo(el.x + el.width - 8, cy + 4);
          ctx.fill();
          // Y arrow
          ctx.beginPath();
          ctx.moveTo(cx, el.y);
          ctx.lineTo(cx - 4, el.y + 8);
          ctx.lineTo(cx + 4, el.y + 8);
          ctx.fill();

          // Labels
          ctx.font = 'bold 12px monospace';
          ctx.fillText('x', el.x + el.width - 4, cy + 14);
          ctx.fillText('y', cx + 8, el.y + 12);
          ctx.fillText('O', cx - 12, cy + 12);
        }
      } else if (el.type === 'grid') {
        // 4x4 Table / Matrix
        if (el.x !== undefined && el.y !== undefined && el.width && el.height) {
          ctx.strokeStyle = el.color;
          ctx.strokeRect(el.x, el.y, el.width, el.height);
          const rows = 3;
          const cols = 3;
          for (let r = 1; r < rows; r++) {
            const y = el.y + (el.height / rows) * r;
            ctx.beginPath();
            ctx.moveTo(el.x, y);
            ctx.lineTo(el.x + el.width, y);
            ctx.stroke();
          }
          for (let c = 1; c < cols; c++) {
            const x = el.x + (el.width / cols) * c;
            ctx.beginPath();
            ctx.moveTo(x, el.y);
            ctx.lineTo(x, el.y + el.height);
            ctx.stroke();
          }
        }
      } else if (el.type === 'text' || el.type === 'latex') {
        if (el.x !== undefined && el.y !== undefined) {
          ctx.font = `${Math.max(14, el.strokeWidth * 5)}px 'Cinzel', serif, sans-serif`;
          ctx.fillStyle = el.color;
          ctx.fillText(el.text || el.latex || '', el.x, el.y);
        }
      }

      ctx.restore();
    });
  }, [elements]);

  // Adjust canvas resolution to parent size
  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;

      const rect = container.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        canvas.width = rect.width;
        canvas.height = rect.height;
        renderCanvas();
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [renderCanvas]);

  useEffect(() => {
    renderCanvas();
  }, [elements, renderCanvas]);

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isHost) return;
    const { x, y } = getCanvasCoords(e);

    if (tool === 'text') {
      setTextPos({ x, y });
      setIsTextModalOpen(true);
      return;
    }

    if (tool === 'latex') {
      setLatexPos({ x, y });
      setIsLatexModalOpen(true);
      return;
    }

    if (tool === 'eraser') {
      // Find and remove elements near click
      setElements((prev) => {
        const threshold = 20;
        return prev.filter((el) => {
          if (el.points) {
            return !el.points.some((p) => Math.hypot(p.x - x, p.y - y) < threshold);
          }
          if (el.x !== undefined && el.y !== undefined) {
            return Math.hypot(el.x - x, el.y - y) >= threshold;
          }
          return true;
        });
      });
      return;
    }

    setIsDrawing(true);
    const newEl: WhiteboardElement = {
      id: `el-${Date.now()}`,
      type: tool,
      color: selectedColor,
      strokeWidth,
      opacity: tool === 'highlighter' ? 0.35 : 1.0,
      points: [{ x, y }],
      x,
      y,
      width: 0,
      height: 0,
    };
    currentElementRef.current = newEl;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentElementRef.current) return;
    const { x, y } = getCanvasCoords(e);
    const current = currentElementRef.current;

    if (current.type === 'pen' || current.type === 'highlighter') {
      if (current.points) {
        current.points.push({ x, y });
      }
    } else if (['line', 'rect', 'circle', 'axes', 'grid'].includes(current.type)) {
      if (current.points && current.points[0]) {
        const start = current.points[0];
        current.width = x - start.x;
        current.height = y - start.y;
        current.points = [start, { x, y }];
      }
    }

    renderCanvas();
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (currentElementRef.current) {
      const finalEl = { ...currentElementRef.current };
      currentElementRef.current = null;
      setElements((prev) => [...prev, finalEl]);
      setRedoStack([]); // Clear redo stack on new action
    }
  };

  const handleUndo = () => {
    if (elements.length === 0) return;
    const last = elements[elements.length - 1];
    setElements((prev) => prev.slice(0, -1));
    setRedoStack((prev) => [...prev, [last]]);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const nextGroup = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, -1));
    setElements((prev) => [...prev, ...nextGroup]);
  };

  const handleClearAll = () => {
    if (window.confirm('Clear all drawings on the live whiteboard?')) {
      setElements([]);
      setRedoStack([]);
    }
  };

  const handleInsertLatex = () => {
    if (!latexInput.trim()) return;
    const newEl: WhiteboardElement = {
      id: `latex-${Date.now()}`,
      type: 'latex',
      color: selectedColor,
      strokeWidth,
      latex: latexInput,
      x: latexPos.x,
      y: latexPos.y,
    };
    setElements((prev) => [...prev, newEl]);
    setIsLatexModalOpen(false);
  };

  const handleInsertText = () => {
    if (!textInput.trim()) return;
    const newEl: WhiteboardElement = {
      id: `text-${Date.now()}`,
      type: 'text',
      color: selectedColor,
      strokeWidth,
      text: textInput,
      x: textPos.x,
      y: textPos.y,
    };
    setElements((prev) => [...prev, newEl]);
    setTextInput('');
    setIsTextModalOpen(false);
  };

  const handleExportImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    if (onSnapshot) {
      onSnapshot(dataUrl);
    }
    const link = document.createElement('a');
    link.download = `SAT_Whiteboard_Lesson_${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className={`relative flex flex-col h-full bg-[#FAF8F5] rounded-2xl overflow-hidden border border-[#E5E0D8] ${className}`}>
      {/* Top Floating Whiteboard Tool Dock */}
      {isHost && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 p-1.5 bg-white/95 backdrop-blur-md rounded-2xl border border-[#E5E0D8] shadow-md">
          {/* Drawing Tools */}
          <div className="flex items-center gap-1 pr-2 border-r border-[#E5E0D8]">
            <button
              onClick={() => setTool('pen')}
              title="Pen Tool"
              className={`p-2 rounded-xl text-xs font-bold transition-all ${
                tool === 'pen'
                  ? 'bg-[#1E1B18] text-white shadow-2xs'
                  : 'text-[#64748B] hover:text-[#1E1B18] hover:bg-[#F5F0EB]'
              }`}
            >
              <Pen size={14} />
            </button>

            <button
              onClick={() => setTool('highlighter')}
              title="Highlighter"
              className={`p-2 rounded-xl text-xs font-bold transition-all ${
                tool === 'highlighter'
                  ? 'bg-[#E07A5F] text-white shadow-2xs'
                  : 'text-[#64748B] hover:text-[#1E1B18] hover:bg-[#F5F0EB]'
              }`}
            >
              <Highlighter size={14} />
            </button>

            <button
              onClick={() => setTool('line')}
              title="Line"
              className={`p-2 rounded-xl text-xs font-bold transition-all ${
                tool === 'line'
                  ? 'bg-[#1E1B18] text-white'
                  : 'text-[#64748B] hover:text-[#1E1B18] hover:bg-[#F5F0EB]'
              }`}
            >
              <Minus size={14} />
            </button>

            <button
              onClick={() => setTool('rect')}
              title="Rectangle"
              className={`p-2 rounded-xl text-xs font-bold transition-all ${
                tool === 'rect'
                  ? 'bg-[#1E1B18] text-white'
                  : 'text-[#64748B] hover:text-[#1E1B18] hover:bg-[#F5F0EB]'
              }`}
            >
              <Square size={14} />
            </button>

            <button
              onClick={() => setTool('circle')}
              title="Circle / Ellipse"
              className={`p-2 rounded-xl text-xs font-bold transition-all ${
                tool === 'circle'
                  ? 'bg-[#1E1B18] text-white'
                  : 'text-[#64748B] hover:text-[#1E1B18] hover:bg-[#F5F0EB]'
              }`}
            >
              <CircleIcon size={14} />
            </button>

            <button
              onClick={() => setTool('axes')}
              title="Cartesian (x,y) Axes"
              className={`p-2 rounded-xl text-xs font-bold transition-all ${
                tool === 'axes'
                  ? 'bg-[#2A9D8F] text-white shadow-2xs'
                  : 'text-[#64748B] hover:text-[#1E1B18] hover:bg-[#F5F0EB]'
              }`}
            >
              <span className="text-[11px] font-mono font-bold leading-none">XY</span>
            </button>

            <button
              onClick={() => setTool('grid')}
              title="Table / Matrix Grid"
              className={`p-2 rounded-xl text-xs font-bold transition-all ${
                tool === 'grid'
                  ? 'bg-[#1E1B18] text-white'
                  : 'text-[#64748B] hover:text-[#1E1B18] hover:bg-[#F5F0EB]'
              }`}
            >
              <Grid size={14} />
            </button>

            <button
              onClick={() => setTool('text')}
              title="Text Tool"
              className={`p-2 rounded-xl text-xs font-bold transition-all ${
                tool === 'text'
                  ? 'bg-[#1E1B18] text-white'
                  : 'text-[#64748B] hover:text-[#1E1B18] hover:bg-[#F5F0EB]'
              }`}
            >
              <Type size={14} />
            </button>

            <button
              onClick={() => setTool('latex')}
              title="Insert LaTeX Math"
              className={`p-2 rounded-xl text-xs font-bold transition-all ${
                tool === 'latex'
                  ? 'bg-[#E07A5F] text-white shadow-2xs'
                  : 'text-[#64748B] hover:text-[#1E1B18] hover:bg-[#F5F0EB]'
              }`}
            >
              <Sigma size={14} />
            </button>

            <button
              onClick={() => setTool('eraser')}
              title="Eraser"
              className={`p-2 rounded-xl text-xs font-bold transition-all ${
                tool === 'eraser'
                  ? 'bg-rose-600 text-white'
                  : 'text-[#64748B] hover:text-rose-600 hover:bg-[#F5F0EB]'
              }`}
            >
              <Eraser size={14} />
            </button>
          </div>

          {/* Color Palette */}
          <div className="flex items-center gap-1 px-1 border-r border-[#E5E0D8]">
            {COLOR_PALETTE.map((c) => (
              <button
                key={c.value}
                onClick={() => setSelectedColor(c.value)}
                title={c.name}
                className={`w-4 h-4 rounded-full border transition-transform ${
                  selectedColor === c.value
                    ? 'scale-125 ring-2 ring-offset-1 ring-[#1E1B18]'
                    : 'hover:scale-110 border-[#E5E0D8]'
                }`}
                style={{ backgroundColor: c.value }}
              />
            ))}
          </div>

          {/* Stroke Width Selector */}
          <div className="flex items-center gap-1 px-1 border-r border-[#E5E0D8]">
            {STROKE_SIZES.map((sz) => (
              <button
                key={sz}
                onClick={() => setStrokeWidth(sz)}
                className={`w-5 h-5 flex items-center justify-center rounded text-[10px] font-bold ${
                  strokeWidth === sz ? 'bg-[#1E1B18] text-white' : 'text-[#64748B] hover:bg-[#F5F0EB]'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>

          {/* Undo / Redo / Clear / Export */}
          <div className="flex items-center gap-1 pl-1">
            <button
              onClick={handleUndo}
              disabled={elements.length === 0}
              title="Undo"
              className="p-1.5 rounded-lg text-[#64748B] hover:text-[#1E1B18] hover:bg-[#F5F0EB] disabled:opacity-30"
            >
              <Undo2 size={13} />
            </button>
            <button
              onClick={handleRedo}
              disabled={redoStack.length === 0}
              title="Redo"
              className="p-1.5 rounded-lg text-[#64748B] hover:text-[#1E1B18] hover:bg-[#F5F0EB] disabled:opacity-30"
            >
              <Redo2 size={13} />
            </button>
            <button
              onClick={handleClearAll}
              title="Clear Canvas"
              className="p-1.5 rounded-lg text-[#64748B] hover:text-rose-600 hover:bg-rose-50"
            >
              <Trash2 size={13} />
            </button>
            <button
              onClick={handleExportImage}
              title="Export Snapshot (PNG)"
              className="p-1.5 rounded-lg text-[#2A9D8F] hover:bg-[#EBF8F5]"
            >
              <Download size={13} />
            </button>
          </div>
        </div>
      )}

      {/* Main Canvas Surface */}
      <div ref={containerRef} className="relative flex-1 w-full h-full cursor-crosshair">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="absolute inset-0 w-full h-full block"
        />
      </div>

      {/* LaTeX Math Formula Modal */}
      {isLatexModalOpen && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/30 backdrop-blur-xs p-4">
          <div className="w-full max-w-md p-6 bg-white rounded-3xl border border-[#E5E0D8] shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#E07A5F] flex items-center gap-1.5">
                <Sigma size={14} /> Insert LaTeX Math Formula
              </span>
              <button
                onClick={() => setIsLatexModalOpen(false)}
                className="text-[#64748B] hover:text-[#1E1B18] text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[#1E1B18]">LaTeX Code</label>
              <input
                type="text"
                value={latexInput}
                onChange={(e) => setLatexInput(e.target.value)}
                placeholder="e.g. \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}"
                className="w-full p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] text-xs font-mono text-[#1E1B18] focus:outline-none focus:ring-2 focus:ring-[#E07A5F]"
              />
            </div>

            {/* Instant KaTeX Preview */}
            <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E5E0D8]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">
                Live Formula Preview:
              </span>
              <div className="text-sm font-serif text-[#1E1B18]">
                <KaTeXRenderer text={`$$${latexInput}$$`} />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsLatexModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#64748B] hover:bg-[#FAF8F5]"
              >
                Cancel
              </button>
              <button
                onClick={handleInsertLatex}
                className="px-5 py-2 rounded-xl bg-[#1E1B18] hover:bg-[#3D405B] text-white text-xs font-bold shadow-2xs"
              >
                Insert onto Board
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simple Text Modal */}
      {isTextModalOpen && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/30 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm p-6 bg-white rounded-3xl border border-[#E5E0D8] shadow-xl space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E1B18] flex items-center gap-1.5">
              <Type size={14} /> Add Text Note
            </h4>

            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Type note or theorem..."
              rows={3}
              className="w-full p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] text-xs text-[#1E1B18] focus:outline-none focus:ring-2 focus:ring-[#1E1B18]"
            />

            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setIsTextModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#64748B] hover:bg-[#FAF8F5]"
              >
                Cancel
              </button>
              <button
                onClick={handleInsertText}
                className="px-5 py-2 rounded-xl bg-[#1E1B18] text-white text-xs font-bold shadow-2xs"
              >
                Place Text
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
