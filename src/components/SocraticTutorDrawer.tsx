import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  BrainCircuit,
  Sparkles,
  Send,
  Loader2,
  Bot,
  User as UserIcon,
  Lightbulb,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Calculator,
  Compass,
  CheckCircle2,
  MessageSquare
} from 'lucide-react';
import katex from 'katex';
import { Question } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  question: Question | null;
  userWrongAnswer?: string;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

// Math Formatter helper
const renderMathInText = (text: string) => {
  if (!text) return '';
  if (!text.includes('$') && !text.includes('\\')) return text;

  try {
    let formatted = text;
    // Replace block math $$...$$
    formatted = formatted.replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => {
      try {
        return `<div class="my-1.5 py-0.5 overflow-x-auto text-center font-mono">${katex.renderToString(math.trim(), {
          displayMode: true,
          throwOnError: false,
        })}</div>`;
      } catch {
        return `$$${math}$$`;
      }
    });

    // Replace inline math $...$
    formatted = formatted.replace(/\$([^\$\n]+?)\$/g, (_, math) => {
      try {
        return katex.renderToString(math.trim(), {
          displayMode: false,
          throwOnError: false,
        });
      } catch {
        return `$${math}$`;
      }
    });

    return formatted;
  } catch {
    return text;
  }
};

export const SocraticTutorDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  question,
  userWrongAnswer,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize tutor message when question changes
  useEffect(() => {
    if (question && isOpen) {
      const wrongContext = userWrongAnswer ? ` You selected choice **${userWrongAnswer}**.` : '';
      setMessages([
        {
          role: 'model',
          text: `Greetings! I am your Socratic SAT Coach.${wrongContext}\n\nLet's analyze this **${question.skill}** question together without spoiling the answer. What was your thought process when you read the prompt?`,
        },
      ]);
    }
  }, [question, isOpen, userWrongAnswer]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Speech Recognition setup (Voice Input)
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputMessage((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser environment. You can type your question directly.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Speech recognition error:', err);
        setIsListening(false);
      }
    }
  };

  // Text to Speech (Audio voice synthesis)
  const handleToggleSpeak = (text: string, index: number) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    if (isSpeaking && speakingIndex === index) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeakingIndex(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Strip markdown formatting for cleaner speech
    const cleanText = text.replace(/[*#$`_]/g, '').replace(/\n+/g, ' ');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeakingIndex(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setSpeakingIndex(null);
    };

    setIsSpeaking(true);
    setSpeakingIndex(index);
    window.speechSynthesis.speak(utterance);
  };

  // Stop speaking when drawer closes
  useEffect(() => {
    if (!isOpen && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeakingIndex(null);
    }
  }, [isOpen]);

  if (!isOpen || !question) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const userText = textToSend || inputMessage;
    if (!userText.trim() || isLoading) return;

    const newMessages: Message[] = [...messages, { role: 'user', text: userText }];
    setMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/socratic-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          chatHistory: newMessages.map((m) => ({ role: m.role, text: m.text })),
          userMessage: userText,
          userWrongAnswer,
        }),
      });

      let replyText = '';
      if (res.ok) {
        try {
          const data = await res.json();
          replyText = data.reply || '';
        } catch {
          replyText = await res.text();
        }
      }

      if (!replyText) {
        if (question.section === 'READING_AND_WRITING') {
          replyText = `Let's focus on the grammatical core of **${question.skill}**:\n\n1. **Identify the Core Argument:** Read the sentence before and after the blank or highlighted section.\n2. **Look for Transition Logic:** Is there contrast (however, although), continuation (furthermore, specifically), or cause-and-effect (therefore)?\n\nWhat relationship do you see between these ideas?`;
        } else {
          replyText = `Let's examine this **${question.skill}** question:\n\n1. **Structure:** What form is the given equation or geometric constraint?\n2. **Desmos Shortcut:** Try entering the equations directly into Desmos or creating sliders for constants to locate roots and vertices.\n\nWhat are the given boundary conditions?`;
        }
      }

      const updated = [...newMessages, { role: 'model' as const, text: replyText }];
      setMessages(updated);
    } catch (err) {
      console.error('Error in socratic tutor:', err);
      const fallback = question.section === 'READING_AND_WRITING'
        ? `Let's analyze this **${question.skill}** item Socratically:\n\n1. Check the subject-verb agreement or clause punctuation rule.\n2. Eliminate choices that create comma splices or run-on sentences.\n\nWhich option correctly connects the two independent clauses?`
        : `Notice how the algebraic relationship can be modeled step-by-step:\n\n1. For quadratic or system equations, what happens when you substitute one expression into another or graph them in Desmos?\n\nWhat is the specific value or coefficient you need to isolate?`;
      setMessages([
        ...newMessages,
        {
          role: 'model',
          text: fallback,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    'Give me a scaffolded hint for Step 1',
    userWrongAnswer ? `Why was choice ${userWrongAnswer} a trap?` : 'Why might the common trap answer be tempting?',
    question.section === 'MATH' ? 'What is the fastest Desmos shortcut here?' : 'What is the exact transition relationship?',
    'Explain the fundamental concept simply',
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-[#FAF8F5] border-l border-[#E5E0D8] shadow-2xl flex flex-col text-[#1E1B18] animate-in slide-in-from-right duration-200 font-sans">
      {/* Drawer Header (Executive Palette) */}
      <div className="px-5 py-4 bg-white border-b border-[#E5E0D8] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-[#E07A5F]/10 text-[#E07A5F] flex items-center justify-center border border-[#E07A5F]/25 shadow-xs">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm text-[#1E1B18]">Socratic SAT AI Coach</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#3D405B]/10 text-[#3D405B] font-mono font-bold border border-[#3D405B]/20">
                Gemini 3.7 Flash
              </span>
            </div>
            <p className="text-[11px] text-[#78716C]">
              Scaffolded Step-by-Step Guidance • Audio & Voice Enabled
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-xl text-[#78716C] hover:text-[#1E1B18] hover:bg-[#FAF8F5] border border-[#E5E0D8] transition-colors cursor-pointer"
          title="Close (Esc)"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Target Question Preview Card */}
      <div className="px-5 py-3 bg-[#F5F0EB] border-b border-[#E5E0D8] text-xs space-y-1 shrink-0">
        <div className="flex items-center justify-between">
          <div className="font-bold text-[#E07A5F] font-mono text-[11px]">
            Target: {question.skill} ({question.domain})
          </div>
          {userWrongAnswer && (
            <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
              Missed: Choice {userWrongAnswer}
            </span>
          )}
        </div>
        <p className="text-[#57534E] line-clamp-2 text-[11px] leading-relaxed">
          {question.passage || question.questionText}
        </p>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs leading-relaxed bg-[#FAF8F5]">
        {messages.map((m, idx) => {
          const isModel = m.role === 'model';
          const isCurrentlySpeaking = isSpeaking && speakingIndex === idx;

          return (
            <div
              key={idx}
              className={`flex items-start gap-2.5 ${isModel ? 'justify-start' : 'justify-end'}`}
            >
              {isModel && (
                <div className="w-7 h-7 rounded-xl bg-[#3D405B] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className="max-w-[85%] space-y-1.5">
                <div
                  className={`p-4 rounded-2xl whitespace-pre-line leading-relaxed ${
                    isModel
                      ? 'bg-white border border-[#E5E0D8] text-[#1E1B18] rounded-tl-xs shadow-xs font-sans'
                      : 'bg-[#1E1B18] text-white font-medium rounded-tr-xs shadow-md'
                  }`}
                  dangerouslySetInnerHTML={{
                    __html: isModel ? renderMathInText(m.text) : m.text,
                  }}
                />

                {/* Audio Read-Aloud Action for AI Coach */}
                {isModel && (
                  <div className="flex items-center gap-2 px-1">
                    <button
                      onClick={() => handleToggleSpeak(m.text, idx)}
                      className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all cursor-pointer ${
                        isCurrentlySpeaking
                          ? 'bg-[#E07A5F] text-white border-[#E07A5F] animate-pulse shadow-xs'
                          : 'bg-white text-[#78716C] hover:text-[#1E1B18] border-[#E5E0D8]'
                      }`}
                    >
                      {isCurrentlySpeaking ? (
                        <>
                          <VolumeX className="w-3 h-3" />
                          <span>Stop Audio</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3 h-3 text-[#E07A5F]" />
                          <span>Listen (TTS)</span>
                        </>
                      )}
                    </button>
                    {isCurrentlySpeaking && (
                      <span className="flex items-center gap-0.5 text-[9px] text-[#E07A5F] font-mono">
                        <span className="w-1 h-2 bg-[#E07A5F] animate-bounce" />
                        <span className="w-1 h-3 bg-[#E07A5F] animate-bounce delay-75" />
                        <span className="w-1 h-2 bg-[#E07A5F] animate-bounce delay-150" />
                      </span>
                    )}
                  </div>
                )}
              </div>

              {!isModel && (
                <div className="w-7 h-7 rounded-xl bg-[#E07A5F] text-white flex items-center justify-center shrink-0 mt-0.5 font-bold text-[11px] shadow-xs">
                  U
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 bg-white border border-[#E5E0D8] rounded-2xl text-[#78716C] text-xs shadow-xs w-fit">
            <Loader2 className="w-4 h-4 animate-spin text-[#E07A5F]" />
            <span className="font-medium">Coach is crafting your step-by-step hint...</span>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-4 py-2.5 bg-[#F5F0EB] border-t border-[#E5E0D8] overflow-x-auto flex gap-2 shrink-0">
        {quickPrompts.map((p) => (
          <button
            key={p}
            onClick={() => handleSendMessage(p)}
            className="px-3 py-1.5 rounded-full bg-white border border-[#E5E0D8] hover:border-[#E07A5F] hover:text-[#E07A5F] text-[11px] font-medium text-[#57534E] whitespace-nowrap transition-all shadow-2xs cursor-pointer flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-[#E07A5F]" />
            <span>{p}</span>
          </button>
        ))}
      </div>

      {/* Message Input Box with Voice Mic */}
      <div className="p-4 bg-white border-t border-[#E5E0D8] flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={toggleVoiceInput}
          className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
            isListening
              ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
              : 'bg-[#FAF8F5] text-[#78716C] hover:text-[#1E1B18] border-[#E5E0D8]'
          }`}
          title={isListening ? 'Listening... click to stop' : 'Click to speak question'}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-[#E07A5F]" />}
        </button>

        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder={isListening ? 'Listening to your voice...' : 'Ask a question or explain your reasoning...'}
          className="flex-1 px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl text-xs text-[#1E1B18] placeholder-[#A8A29E] focus:outline-none focus:border-[#E07A5F] focus:ring-1 focus:ring-[#E07A5F] transition-all"
        />

        <button
          onClick={() => handleSendMessage()}
          disabled={!inputMessage.trim() || isLoading}
          className="p-2.5 rounded-xl bg-[#1E1B18] hover:bg-[#3D405B] disabled:opacity-40 text-white transition-colors cursor-pointer shadow-sm"
          title="Send"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
