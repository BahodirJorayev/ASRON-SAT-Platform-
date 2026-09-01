import React, { useEffect } from 'react';
import { X, BookOpen } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const FormulaReferenceSheet: React.FC<Props> = ({ isOpen, onClose }) => {
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

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-2 sm:p-4 animate-in fade-in duration-200 font-sans overflow-y-auto overscroll-contain"
    >
      <div className="bg-[#111111] border border-[#1F2937] rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] sm:max-h-[85vh] my-auto flex flex-col text-[#F3F4F6] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#1F2937] bg-[#0A0A0A] shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold tracking-wide text-white">College Board SAT Reference Sheet</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-white hover:bg-[#1A1A1A] transition-colors cursor-pointer border border-[#374151]"
            title="Yopish (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 2D Geometry */}
            <div className="bg-[#0A0A0A] p-5 rounded-xl border border-[#1F2937] space-y-4">
              <h3 className="font-bold text-blue-400 text-xs tracking-wider uppercase border-b border-[#1F2937] pb-2 font-mono">
                2D Shapes & Circles
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-[#111111] rounded-lg border border-[#1F2937]">
                  <div className="font-bold text-white text-xs">Circle Area & Circ.</div>
                  <div className="text-blue-300 font-mono text-xs mt-1">$A = \pi r^2$</div>
                  <div className="text-blue-300 font-mono text-xs">$C = 2\pi r$</div>
                </div>
                <div className="p-3 bg-[#111111] rounded-lg border border-[#1F2937]">
                  <div className="font-bold text-white text-xs">Rectangle</div>
                  <div className="text-blue-300 font-mono text-xs mt-1">$A = \ell w$</div>
                  <div className="text-[#9CA3AF] text-xs font-mono">$P = 2\ell + 2w$</div>
                </div>
                <div className="p-3 bg-[#111111] rounded-lg border border-[#1F2937]">
                  <div className="font-bold text-white text-xs">Triangle Area</div>
                  <div className="text-blue-300 font-mono text-xs mt-1">$A = \frac{1}{2} b h$</div>
                </div>
                <div className="p-3 bg-[#111111] rounded-lg border border-[#1F2937]">
                  <div className="font-bold text-white text-xs">Pythagorean Thm</div>
                  <div className="text-blue-300 font-mono text-xs mt-1">$c^2 = a^2 + b^2$</div>
                </div>
              </div>
            </div>

            {/* Special Right Triangles & Trig */}
            <div className="bg-[#0A0A0A] p-5 rounded-xl border border-[#1F2937] space-y-4">
              <h3 className="font-bold text-blue-400 text-xs tracking-wider uppercase border-b border-[#1F2937] pb-2 font-mono">
                Special Right Triangles
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-[#111111] rounded-lg border border-[#1F2937]">
                  <div className="font-bold text-white text-xs">30°-60°-90° Triangle</div>
                  <div className="text-xs text-[#9CA3AF] mt-1">Sides opposite 30°, 60°, 90°:</div>
                  <div className="text-blue-300 font-mono text-xs mt-1">$x, \; x\sqrt{3}, \; 2x$</div>
                </div>
                <div className="p-3 bg-[#111111] rounded-lg border border-[#1F2937]">
                  <div className="font-bold text-white text-xs">45°-45°-90° Triangle</div>
                  <div className="text-xs text-[#9CA3AF] mt-1">Sides opposite 45°, 45°, 90°:</div>
                  <div className="text-blue-300 font-mono text-xs mt-1">$s, \; s, \; s\sqrt{2}$</div>
                </div>
              </div>
              <div className="p-3 bg-[#111111] rounded-lg border border-[#1F2937] text-xs">
                <div className="font-bold text-white mb-1">Trigonometric Definitions (SOH-CAH-TOA)</div>
                <div className="text-blue-300 font-mono">
                  {'sin(\u03B8) = opp/hyp,  cos(\u03B8) = adj/hyp,  tan(\u03B8) = opp/adj'}
                </div>
              </div>
            </div>

            {/* 3D Solids & Volumes */}
            <div className="bg-[#0A0A0A] p-5 rounded-xl border border-[#1F2937] space-y-4">
              <h3 className="font-bold text-blue-400 text-xs tracking-wider uppercase border-b border-[#1F2937] pb-2 font-mono">
                3D Volume & Surface Formulas
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 bg-[#111111] rounded-lg border border-[#1F2937]">
                  <span className="text-[#D1D5DB] block font-bold">Rectangular Prism</span>
                  <span className="text-blue-300 font-mono">V = &ell; &times; w &times; h</span>
                </div>
                <div className="p-2.5 bg-[#111111] rounded-lg border border-[#1F2937]">
                  <span className="text-[#D1D5DB] block font-bold">Right Circular Cylinder</span>
                  <span className="text-blue-300 font-mono">{'V = \u03C0r\u00B2h'}</span>
                </div>
                <div className="p-2.5 bg-[#111111] rounded-lg border border-[#1F2937]">
                  <span className="text-[#D1D5DB] block font-bold">Sphere Volume</span>
                  <span className="text-blue-300 font-mono">{'V = (4/3)\u03C0r\u00B3'}</span>
                </div>
                <div className="p-2.5 bg-[#111111] rounded-lg border border-[#1F2937]">
                  <span className="text-[#D1D5DB] block font-bold">Right Circular Cone</span>
                  <span className="text-blue-300 font-mono">{'V = (1/3)\u03C0r\u00B2h'}</span>
                </div>
                <div className="p-2.5 bg-[#111111] rounded-lg border border-[#1F2937] col-span-2">
                  <span className="text-[#D1D5DB] block font-bold">Pyramid</span>
                  <span className="text-blue-300 font-mono">V = (1/3)Bh (where B is base area)</span>
                </div>
              </div>
            </div>

            {/* Essential Constants & Properties */}
            <div className="bg-[#0A0A0A] p-5 rounded-xl border border-[#1F2937] space-y-4">
              <h3 className="font-bold text-blue-400 text-xs tracking-wider uppercase border-b border-[#1F2937] pb-2 font-mono">
                Angle Properties & Coordinate Rules
              </h3>
              <ul className="list-disc list-inside space-y-2 text-[#D1D5DB] text-xs">
                <li>The number of degrees of arc in a circle is <strong className="text-blue-400">360°</strong>.</li>
                <li>The number of radians of arc in a circle is <strong className="text-blue-400">{'2\u03C0'}</strong>.</li>
                <li>The sum of the measures in degrees of the angles of a triangle is <strong className="text-blue-400">180°</strong>.</li>
                <li>Equation of a circle centered at (h, k) with radius r: <strong className="text-blue-400 font-mono">{'(x - h)² + (y - k)² = r²'}</strong></li>
                <li>Quadratic formula: <strong className="text-blue-400 font-mono">{'x = (-b \u00B1 \u221A(b\u00B2 - 4ac)) / (2a)'}</strong></li>
                <li>Vertex x-coordinate: <strong className="text-blue-400 font-mono">{'x = -b / (2a)'}</strong></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#1F2937] bg-[#0A0A0A] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs tracking-wide transition-colors cursor-pointer"
          >
            Close Reference Sheet
          </button>
        </div>
      </div>
    </div>
  );
};
