import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UploadCloud,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Download,
  Plus,
  Edit2,
  Check,
  X,
  Layers,
  ArrowRight
} from 'lucide-react';
import { VocabularyWord } from '../types';

interface Props {
  existingWords: VocabularyWord[];
  onIngestWords: (newWords: VocabularyWord[]) => void;
}

export const AdminVocabPDFIngest: React.FC<Props> = ({
  existingWords,
  onIngestWords,
}) => {
  const [pastedText, setPastedText] = useState('');
  const [fileName, setFileName] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedList, setExtractedList] = useState<VocabularyWord[]>([]);
  const [selectedWordIds, setSelectedWordIds] = useState<Set<string>>(new Set());
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Sample Raw SAT Book Text for one-click testing
  const sampleSATRawText = `1. Fastidious (adj.) - Very attentive to and concerned about accuracy and detail; scrupulous.
2. Ineffable (adj.) - Too great or extreme to be expressed or described in words.
3. Loquacious (adj.) - Tending to talk a great deal; talkative.
4. Munificent (adj.) - More generous than is usual or necessary; lavish.
5. Novice (noun) - A person new to or inexperienced in a field or situation.
6. Obdurate (adj.) - Stubbornly refusing to change one's opinion or course of action.
7. Parsimonious (adj.) - Unwilling to spend money or use resources; stingy or frugal.
8. Querulous (adj.) - Complaining in a petulant or whining manner.
9. Rancor (noun) - Bitterness or resentfulness, especially when long-standing.
10. Sagacious (adj.) - Having or showing keen mental discernment and good judgment; shrewd.`;

  const handleLoadSample = () => {
    setPastedText(sampleSATRawText);
    setFileName('CollegePanda_Vocab_Supplement.pdf');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      setPastedText(text || '');
    };
    reader.readAsText(file);
  };

  const handleExtractWithAI = async () => {
    if (!pastedText.trim()) {
      setStatusMessage({ type: 'error', text: 'Please paste vocabulary text or upload a PDF/text file.' });
      return;
    }

    setIsExtracting(true);
    setStatusMessage({ type: 'info', text: 'Gemini Lexicographer AI parsing vocabulary entries...' });

    try {
      const res = await fetch('/api/vocab/extract-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText: pastedText, fileName: fileName || 'Vocabulary_Ingest.txt' }),
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.extractedWords)) {
        const existingWordSet = new Set(existingWords.map((w) => w.word.toLowerCase().trim()));

        const formatted: VocabularyWord[] = data.extractedWords.map((item: any, idx: number) => {
          const cleanWord = (item.word || '').toLowerCase().trim();
          const isDuplicate = existingWordSet.has(cleanWord);

          return {
            id: `ingested-${Date.now()}-${idx}`,
            wordNumber: existingWords.length + idx + 1,
            word: cleanWord,
            partOfSpeech: item.partOfSpeech || 'noun',
            definition: item.definition || 'Definition pending review.',
            synonyms: Array.isArray(item.synonyms) ? item.synonyms : ['equivalent'],
            sampleSentence: item.sampleSentence || `The professor analyzed the ${cleanWord} context of the text.`,
            difficulty: item.difficulty || 'MEDIUM',
            bookSource: fileName ? `Extracted from ${fileName}` : 'Admin Ingestion Batch',
            tone: item.tone || 'Neutral',
            etymology: item.etymology || 'Standard etymological roots.',
            createdAt: new Date().toISOString(),
          };
        });

        setExtractedList(formatted);
        // Default select all non-duplicates
        const nonDupIds = formatted
          .filter((w) => !existingWordSet.has(w.word))
          .map((w) => w.id);
        setSelectedWordIds(new Set(nonDupIds));

        setStatusMessage({
          type: 'success',
          text: `Successfully parsed ${formatted.length} words via ${data.engine || 'AI Engine'}. Review and approve below.`,
        });
      } else {
        throw new Error(data.error || 'Failed to extract words');
      }
    } catch (err: any) {
      console.error('Extraction error:', err);
      setStatusMessage({ type: 'error', text: err.message || 'Error occurred during extraction.' });
    } finally {
      setIsExtracting(false);
    }
  };

  const handleToggleSelectWord = (id: string) => {
    setSelectedWordIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedWordIds.size === extractedList.length) {
      setSelectedWordIds(new Set());
    } else {
      setSelectedWordIds(new Set(extractedList.map((w) => w.id)));
    }
  };

  const handleUpdateWordField = (id: string, field: keyof VocabularyWord, value: any) => {
    setExtractedList((prev) =>
      prev.map((w) => (w.id === id ? { ...w, [field]: value } : w))
    );
  };

  const handleApproveAndIngest = () => {
    const toIngest = extractedList.filter((w) => selectedWordIds.has(w.id));
    if (toIngest.length === 0) {
      setStatusMessage({ type: 'error', text: 'No words selected for ingestion.' });
      return;
    }

    onIngestWords(toIngest);
    setStatusMessage({
      type: 'success',
      text: `Approved and ingested ${toIngest.length} words into the Global SAT Vocab Bank!`,
    });
    setExtractedList([]);
    setSelectedWordIds(new Set());
    setPastedText('');
    setFileName('');
  };

  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(extractedList, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SAT_Vocab_Extracted_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 text-[#1E1B18] font-sans">
      {/* CMS Header */}
      <div className="p-6 rounded-3xl bg-white border border-[#E5E0D8] shadow-2xs space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-[#FFF4F0] border border-[#FCD9CE] text-[#E07A5F]">
            Admin CMS
          </span>
          <span className="text-xs text-[#64748B]">Digital SAT Lexicography Ingestion Pipeline</span>
        </div>
        <h2 className="text-2xl font-black text-[#1E1B18]">PDF Vocabulary Extractor</h2>
        <p className="text-xs text-[#64748B] max-w-2xl leading-relaxed">
          Upload or paste text from SAT prep books (College Panda, Erica Meltzer, Barron's). Our Gemini AI
          lexicographer parses words, definitions, synonyms, and parts of speech directly into your interactive study decks.
        </p>
      </div>

      {/* Input / Dropzone Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Paste or Upload */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-[#E5E0D8] shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#1E1B18] uppercase tracking-wider">
                Raw Vocab Text or PDF OCR Transcript
              </label>
              <button
                onClick={handleLoadSample}
                className="text-[11px] font-bold text-[#E07A5F] hover:underline cursor-pointer"
              >
                + Load 10-Word Sample Batch
              </button>
            </div>

            <textarea
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              rows={8}
              placeholder="Paste raw text here (e.g. '1. Fastidious (adj.) - Very attentive to detail...')"
              className="w-full p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] text-xs font-mono text-[#1E1B18] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#E07A5F] leading-relaxed resize-y"
            />

            {/* File dropzone button */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <label className="px-4 py-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F5F0EB] border border-[#E5E0D8] text-xs font-bold text-[#1E1B18] flex items-center gap-2 cursor-pointer transition-all">
                <UploadCloud size={15} />
                <span>Upload TXT / OCR File</span>
                <input type="file" accept=".txt,.json,.md,.csv" onChange={handleFileUpload} className="hidden" />
              </label>

              {fileName && (
                <span className="text-xs font-mono text-[#64748B] flex items-center gap-1.5">
                  <FileText size={13} />
                  <span>{fileName}</span>
                </span>
              )}

              <button
                onClick={handleExtractWithAI}
                disabled={isExtracting}
                className="px-6 py-2.5 rounded-xl bg-[#1E1B18] hover:bg-[#3D405B] text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-all shadow-2xs disabled:opacity-50 ml-auto"
              >
                <Sparkles size={14} className={isExtracting ? 'animate-spin' : 'text-[#E07A5F]'} />
                <span>{isExtracting ? 'Extracting with Gemini AI...' : 'Parse Vocabulary Entries'}</span>
              </button>
            </div>
          </div>

          {/* Status Alert */}
          {statusMessage && (
            <div
              className={`p-4 rounded-2xl border text-xs font-medium flex items-center gap-3 ${
                statusMessage.type === 'success'
                  ? 'bg-[#EBF8F5] border-[#BCE8DE] text-[#2A9D8F]'
                  : statusMessage.type === 'error'
                  ? 'bg-rose-50 border-rose-200 text-rose-700'
                  : 'bg-[#FFF9E6] border-[#FBE39D] text-[#B78103]'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 size={16} className="shrink-0" />
              ) : (
                <AlertTriangle size={16} className="shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}
        </div>

        {/* Right 1 Col: Ingest Stats & Controls */}
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-[#E5E0D8] shadow-2xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
              Bank Status Summary
            </h3>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#64748B]">Active Vocab Words:</span>
                <span className="font-mono font-bold text-[#1E1B18]">{existingWords.length} words</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#64748B]">Parsed in Queue:</span>
                <span className="font-mono font-bold text-[#E07A5F]">{extractedList.length} words</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#64748B]">Selected for Ingest:</span>
                <span className="font-mono font-bold text-[#2A9D8F]">{selectedWordIds.size} words</span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E5E0D8] space-y-2">
              <button
                onClick={handleApproveAndIngest}
                disabled={selectedWordIds.size === 0}
                className="w-full py-3 rounded-2xl bg-[#2A9D8F] hover:bg-[#21867a] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-2xs disabled:opacity-40 transition-all"
              >
                <Check size={14} />
                <span>Approve & Ingest Selected ({selectedWordIds.size})</span>
              </button>

              {extractedList.length > 0 && (
                <button
                  onClick={handleExportJSON}
                  className="w-full py-2.5 rounded-2xl bg-[#FAF8F5] hover:bg-[#F5F0EB] border border-[#E5E0D8] text-[#1E1B18] text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Download size={13} />
                  <span>Export Batch to JSON</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Review Table for Parsed Words */}
      {extractedList.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-[#1E1B18]">
              Review & Validate Parsed Words ({extractedList.length})
            </h3>
            <button
              onClick={handleSelectAll}
              className="text-xs font-bold text-[#3D405B] hover:text-[#1E1B18] cursor-pointer"
            >
              {selectedWordIds.size === extractedList.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          <div className="overflow-x-auto rounded-3xl bg-white border border-[#E5E0D8] shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#E5E0D8] text-[#64748B] font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-3.5 w-10 text-center">Select</th>
                  <th className="p-3.5">Word</th>
                  <th className="p-3.5">POS</th>
                  <th className="p-3.5">Definition</th>
                  <th className="p-3.5">Difficulty</th>
                  <th className="p-3.5">Sample Sentence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E0D8]">
                {extractedList.map((w) => {
                  const isSelected = selectedWordIds.has(w.id);
                  const isDuplicate = existingWords.some(
                    (ew) => ew.word.toLowerCase() === w.word.toLowerCase()
                  );

                  return (
                    <tr
                      key={w.id}
                      className={`hover:bg-[#FAF8F5] transition-colors ${
                        isDuplicate ? 'bg-amber-50/40' : ''
                      }`}
                    >
                      <td className="p-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectWord(w.id)}
                          className="rounded border-[#E5E0D8] text-[#E07A5F] focus:ring-[#E07A5F] cursor-pointer"
                        />
                      </td>

                      <td className="p-3.5 font-bold text-[#1E1B18]">
                        <input
                          type="text"
                          value={w.word}
                          onChange={(e) => handleUpdateWordField(w.id, 'word', e.target.value)}
                          className="w-full bg-transparent font-bold text-[#1E1B18] border-b border-transparent focus:border-[#E07A5F] focus:outline-none"
                        />
                        {isDuplicate && (
                          <span className="inline-block mt-0.5 text-[9px] font-mono font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">
                            Duplicate
                          </span>
                        )}
                      </td>

                      <td className="p-3.5 font-mono text-[#3D405B]">
                        <input
                          type="text"
                          value={w.partOfSpeech}
                          onChange={(e) => handleUpdateWordField(w.id, 'partOfSpeech', e.target.value)}
                          className="w-16 bg-transparent text-[11px] font-mono border-b border-transparent focus:border-[#E07A5F] focus:outline-none"
                        />
                      </td>

                      <td className="p-3.5 text-[#1E1B18] min-w-[240px]">
                        <textarea
                          value={w.definition}
                          onChange={(e) => handleUpdateWordField(w.id, 'definition', e.target.value)}
                          rows={2}
                          className="w-full bg-transparent text-xs leading-relaxed border-b border-transparent focus:border-[#E07A5F] focus:outline-none resize-none"
                        />
                      </td>

                      <td className="p-3.5">
                        <select
                          value={w.difficulty}
                          onChange={(e) => handleUpdateWordField(w.id, 'difficulty', e.target.value)}
                          className="text-[10px] font-bold rounded-lg bg-[#FAF8F5] border border-[#E5E0D8] p-1 text-[#1E1B18] focus:outline-none"
                        >
                          <option value="EASY">EASY</option>
                          <option value="MEDIUM">MEDIUM</option>
                          <option value="HARD">HARD</option>
                        </select>
                      </td>

                      <td className="p-3.5 text-[#64748B] italic min-w-[260px]">
                        <textarea
                          value={w.sampleSentence}
                          onChange={(e) => handleUpdateWordField(w.id, 'sampleSentence', e.target.value)}
                          rows={2}
                          className="w-full bg-transparent text-xs leading-relaxed border-b border-transparent focus:border-[#E07A5F] focus:outline-none resize-none italic"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
