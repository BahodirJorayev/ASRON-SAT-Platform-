import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  CircleDot,
  StopCircle,
  Users,
  MessageSquare,
  Calculator,
  Share2,
  X,
  Sparkles,
  Hand,
  Maximize2,
  Minimize2,
  Layers,
  ArrowRight,
  Bookmark,
  CheckCircle2,
  Send,
  Volume2,
  Settings,
  Shield,
  HelpCircle,
  Copy,
  ChevronDown
} from 'lucide-react';
import { User, Chat, LiveStreamSession, Message } from '../types';
import { LiveWhiteboard } from './LiveWhiteboard';
import { DesmosCalculator } from './DesmosCalculator';

interface Props {
  user: User;
  activeChat?: Chat;
  session?: LiveStreamSession;
  onClose: () => void;
  onLessonRecordedAndSaved: (savedMessage: Message, targetChatId?: string) => void;
}

export const LiveStreamStudio: React.FC<Props> = ({
  user,
  activeChat,
  session,
  onClose,
  onLessonRecordedAndSaved,
}) => {
  const isHost = user.role === 'ADMIN' || activeChat?.createdById === user.id;

  // Media States
  const [isCameraOn, setIsCameraOn] = useState<boolean>(true);
  const [isMicOn, setIsMicOn] = useState<boolean>(true);
  const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false);
  const [activeTabMode, setActiveTabMode] = useState<'WHITEBOARD' | 'SCREEN' | 'DESMOS'>('WHITEBOARD');

  // Video Refs
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const screenVideoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  // Cloud Recording Engine State
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<any>(null);

  // Recording completed modal state
  const [recordedLessonResult, setRecordedLessonResult] = useState<{
    id: string;
    title: string;
    videoUrl: string;
    durationSecs: number;
    recordedAt: string;
  } | null>(null);
  const [forwardTargetChatId, setForwardTargetChatId] = useState<string>(activeChat?.id || '');

  // Floating Desmos PIP Dock state
  const [isDesmosOpen, setIsDesmosOpen] = useState<boolean>(false);
  const [isDesmosFullScreen, setIsDesmosFullScreen] = useState<boolean>(false);

  // Live Stream Chat & Viewers sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [sidebarView, setSidebarView] = useState<'CHAT' | 'VIEWERS'>('CHAT');
  const [liveMessages, setLiveMessages] = useState<
    { id: string; sender: string; text: string; time: string; isQuestion?: boolean }[]
  >([
    {
      id: 'lm-1',
      sender: 'Azizbek K.',
      text: 'Ustoz, 14-savoldagi quadratic discriminant formulasini yana bir bor doskaga yozib bera olasizmi?',
      time: '19:42',
      isQuestion: true,
    },
    {
      id: 'lm-2',
      sender: 'Madina SAT',
      text: 'Desmosda regression yordamida yechish juda oson ekan!',
      time: '19:44',
    },
  ]);
  const [inputLiveMessage, setInputLiveMessage] = useState<string>('');

  // Live Attendees Mock State
  const [attendees, setAttendees] = useState<{ id: string; name: string; avatar: string; handRaised: boolean; isMuted: boolean }[]>([
    { id: 'usr-1', name: 'Azizbek K. (1520 Goal)', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80', handRaised: true, isMuted: true },
    { id: 'usr-2', name: 'Madina Sh. (Math 800)', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80', handRaised: false, isMuted: true },
    { id: 'usr-3', name: 'Javohir T. (RW 760)', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80', handRaised: false, isMuted: false },
    { id: 'usr-4', name: 'Dilnoza R.', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=80', handRaised: true, isMuted: true },
  ]);

  const [handRaisedByMe, setHandRaisedByMe] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Initialize webcam video stream
  useEffect(() => {
    let active = true;

    async function initCamera() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 640, height: 360 },
            audio: true,
          });
          if (active) {
            mediaStreamRef.current = stream;
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = stream;
            }
          }
        }
      } catch (err) {
        console.warn('Camera/Mic permission not granted or available in preview container:', err);
      }
    }

    if (isCameraOn) {
      initCamera();
    }

    return () => {
      active = false;
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isCameraOn]);

  // Screen Share Toggle Engine
  const handleToggleScreenShare = async () => {
    if (isScreenSharing) {
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => track.stop());
        screenStreamRef.current = null;
      }
      setIsScreenSharing(false);
      if (activeTabMode === 'SCREEN') {
        setActiveTabMode('WHITEBOARD');
      }
    } else {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
          const screenStream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: true,
          });
          screenStreamRef.current = screenStream;
          if (screenVideoRef.current) {
            screenVideoRef.current.srcObject = screenStream;
          }
          setIsScreenSharing(true);
          setActiveTabMode('SCREEN');

          screenStream.getVideoTracks()[0].onended = () => {
            setIsScreenSharing(false);
            setActiveTabMode('WHITEBOARD');
          };
        } else {
          setIsScreenSharing(true);
          setActiveTabMode('SCREEN');
        }
      } catch (err) {
        console.warn('Screen share cancelled or not allowed:', err);
      }
    }
  };

  // Recording Engine (MediaRecorder API -> Supabase Saved Messages Pipeline)
  const handleToggleRecording = () => {
    if (isRecording) {
      // Stop Recording
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      clearInterval(recordingTimerRef.current);
      setIsRecording(false);

      const finalDuration = recordingSeconds;
      setRecordingSeconds(0);

      // Create synthetic lesson video object
      const recordedVideo = {
        id: `rec-${Date.now()}`,
        title: `${activeChat?.name || 'SAT Masterclass'} - Live Lesson Recording`,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        durationSecs: finalDuration || 142,
        recordedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setRecordedLessonResult(recordedVideo);
    } else {
      // Start Recording
      recordedChunksRef.current = [];
      setIsRecording(true);
      setRecordingSeconds(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);

      // Attempt MediaRecorder
      try {
        const streamToRecord = screenStreamRef.current || mediaStreamRef.current;
        if (streamToRecord && typeof MediaRecorder !== 'undefined') {
          const recorder = new MediaRecorder(streamToRecord);
          recorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
              recordedChunksRef.current.push(e.data);
            }
          };
          recorder.start(1000);
          mediaRecorderRef.current = recorder;
        }
      } catch (e) {
        console.log('Virtual recording session active in container.');
      }
    }
  };

  // Finalize Lesson Recording -> Deliver to Saved Messages & Target Channel
  const handleDeliverRecording = (forwardToChannel: boolean) => {
    if (!recordedLessonResult) return;

    const savedLessonMessage: Message = {
      id: `msg-rec-${Date.now()}`,
      senderId: user.id,
      senderName: user.fullName,
      senderAvatar: user.avatarUrl,
      senderRole: user.role,
      content: `🎬 **Live SAT Lesson Recording**\n\n📌 **Topic:** ${recordedLessonResult.title}\n⏱️ **Duration:** ${Math.floor(recordedLessonResult.durationSecs / 60)}m ${recordedLessonResult.durationSecs % 60}s\n📅 **Recorded:** ${recordedLessonResult.recordedAt}`,
      recordingVideoUrl: recordedLessonResult.videoUrl,
      recordingTitle: recordedLessonResult.title,
      recordingDuration: recordedLessonResult.durationSecs,
      createdAt: new Date().toISOString(),
    };

    onLessonRecordedAndSaved(
      savedLessonMessage,
      forwardToChannel ? forwardTargetChatId || activeChat?.id : undefined
    );

    setRecordedLessonResult(null);
  };

  const handleSendLiveMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputLiveMessage.trim()) return;

    const newMsg = {
      id: `lm-${Date.now()}`,
      sender: user.fullName,
      text: inputLiveMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setLiveMessages((prev) => [...prev, newMsg]);
    setInputLiveMessage('');
  };

  const handleToggleHandRaise = () => {
    setHandRaisedByMe((prev) => !prev);
    setAttendees((prev) =>
      prev.map((a) => (a.id === user.id ? { ...a, handRaised: !handRaisedByMe } : a))
    );
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, '0');
    const secs = (totalSeconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(
      `https://oneprep.app/live/${activeChat?.id || 'sat-masterclass'}`
    );
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#1E1B18] text-white font-sans overflow-hidden">
      {/* Top Studio Control Bar */}
      <div className="h-16 px-6 bg-[#25221F] border-b border-[#3D3A35] flex items-center justify-between shrink-0">
        {/* Left: Stream Info & Live Status Badge */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400">
              LIVE BROADCAST
            </span>
          </div>

          <div className="h-4 w-px bg-[#3D3A35]" />

          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>{activeChat?.name || 'Ivy League 1550+ SAT Live Teaching Studio'}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#3D405B] text-white/90">
                {isHost ? 'Host / Instructor' : 'Student Attendee'}
              </span>
            </h3>
          </div>

          {/* Recording Timer Badge */}
          {isRecording && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-rose-950/80 border border-rose-600/50 text-rose-300 text-xs font-mono font-bold animate-pulse">
              <CircleDot size={13} className="text-rose-400" />
              <span>REC {formatTimer(recordingSeconds)}</span>
            </div>
          )}
        </div>

        {/* Center: Main View Switcher Tabs (Whiteboard / Screen / Desmos) */}
        <div className="flex items-center gap-1.5 p-1 bg-[#1E1B18] rounded-xl border border-[#3D3A35]">
          <button
            onClick={() => setActiveTabMode('WHITEBOARD')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTabMode === 'WHITEBOARD'
                ? 'bg-[#E07A5F] text-white shadow-2xs'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <Layers size={13} />
            <span>Interactive Whiteboard</span>
          </button>

          <button
            onClick={() => {
              if (!isScreenSharing) handleToggleScreenShare();
              else setActiveTabMode('SCREEN');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTabMode === 'SCREEN'
                ? 'bg-[#2A9D8F] text-white shadow-2xs'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <Monitor size={13} />
            <span>Screen Share {isScreenSharing ? '(Active)' : ''}</span>
          </button>

          <button
            onClick={() => setIsDesmosOpen((prev) => !prev)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              isDesmosOpen
                ? 'bg-[#3D405B] text-white ring-1 ring-[#E07A5F]'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <Calculator size={13} />
            <span>Desmos Graphing {isDesmosOpen ? 'PIP On' : 'PIP'}</span>
          </button>
        </div>

        {/* Right: Broadcast & Stream End Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyInviteLink}
            className="px-3 py-1.5 rounded-xl bg-[#1E1B18] hover:bg-[#3D3A35] border border-[#3D3A35] text-xs font-bold text-white flex items-center gap-1.5 transition-all"
          >
            {copiedLink ? <CheckCircle2 size={13} className="text-[#2A9D8F]" /> : <Copy size={13} />}
            <span>{copiedLink ? 'Link Copied!' : 'Share Link'}</span>
          </button>

          <button
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className={`p-2 rounded-xl text-xs font-bold transition-all ${
              isSidebarOpen ? 'bg-[#3D405B] text-white' : 'bg-[#1E1B18] text-[#94A3B8] hover:text-white'
            }`}
            title="Toggle Live Chat & Viewers"
          >
            <MessageSquare size={16} />
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-rose-600/90 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs"
          >
            <X size={14} />
            <span>{isHost ? 'End Broadcast' : 'Leave Room'}</span>
          </button>
        </div>
      </div>

      {/* Main Studio Body (Stage + Sidebar) */}
      <div className="relative flex-1 flex overflow-hidden">
        {/* Central Stage Area */}
        <div className="relative flex-1 flex flex-col bg-[#141210] p-4 overflow-hidden">
          {/* Active Worksurface View */}
          <div className="relative flex-1 w-full h-full rounded-2xl overflow-hidden bg-[#FAF8F5] border border-[#3D3A35] shadow-2xl">
            {activeTabMode === 'WHITEBOARD' && (
              <LiveWhiteboard className="w-full h-full" isHost={isHost} />
            )}

            {activeTabMode === 'SCREEN' && (
              <div className="w-full h-full bg-[#0F0E0D] flex flex-col items-center justify-center p-6 text-center">
                {isScreenSharing ? (
                  <video
                    ref={screenVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain rounded-xl"
                  />
                ) : (
                  <div className="max-w-md space-y-4 text-white">
                    <Monitor size={48} className="mx-auto text-[#2A9D8F]" />
                    <h3 className="text-lg font-bold">Screen Sharing is Idle</h3>
                    <p className="text-xs text-[#94A3B8] leading-relaxed">
                      Share your Bluebook app, official College Board PDF, or web browser window with your students in high-definition 60fps.
                    </p>
                    <button
                      onClick={handleToggleScreenShare}
                      className="px-6 py-2.5 rounded-xl bg-[#2A9D8F] hover:bg-[#21867a] text-white text-xs font-bold transition-all shadow-md inline-flex items-center gap-2"
                    >
                      <Monitor size={14} />
                      <span>Start Sharing Screen</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Floating Webcam PIP (Host Facecam / Avatar) */}
          <div className="absolute bottom-20 left-8 z-30 w-52 h-36 bg-[#25221F] rounded-2xl border border-[#3D3A35] shadow-2xl overflow-hidden group">
            {isCameraOn ? (
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover transform -scale-x-100"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-[#1E1B18] p-3 text-center">
                <img
                  src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80'}
                  alt={user.fullName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#E07A5F] mb-1"
                />
                <span className="text-[11px] font-bold text-white truncate max-w-[120px]">
                  {user.fullName}
                </span>
                <span className="text-[9px] text-[#94A3B8]">Camera Muted</span>
              </div>
            )}

            {/* Webcam overlay badge */}
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between px-2 py-1 rounded-lg bg-black/60 backdrop-blur-xs text-[10px] font-medium text-white">
              <span className="truncate">{user.fullName}</span>
              {isMicOn ? <Mic size={10} className="text-[#2A9D8F]" /> : <MicOff size={10} className="text-rose-400" />}
            </div>
          </div>

          {/* Floating Desmos PIP Dock */}
          <AnimatePresence>
            {isDesmosOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  width: isDesmosFullScreen ? '95%' : '520px',
                  height: isDesmosFullScreen ? '90%' : '380px',
                }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="absolute z-40 top-8 right-8 bg-white rounded-3xl border border-[#E5E0D8] shadow-2xl overflow-hidden flex flex-col"
              >
                {/* Desmos PIP Header */}
                <div className="h-10 px-4 bg-[#1E1B18] text-white flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <Calculator size={14} className="text-[#E07A5F]" />
                    <span className="text-xs font-bold">Official SAT Desmos Calculator</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsDesmosFullScreen((prev) => !prev)}
                      className="text-[#94A3B8] hover:text-white p-1"
                      title={isDesmosFullScreen ? 'Exit Full Screen' : 'Full Screen'}
                    >
                      {isDesmosFullScreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
                    </button>
                    <button
                      onClick={() => setIsDesmosOpen(false)}
                      className="text-[#94A3B8] hover:text-white p-1"
                      title="Close Desmos"
                    >
                      <X size={13} />
                    </button>
                  </div>
                </div>

                {/* Desmos Body */}
                <div className="flex-1 w-full h-full bg-white">
                  <DesmosCalculator isExpanded={true} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Floating Host Bar (Mic, Camera, Screen, Record, Hand) */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 p-2 bg-[#25221F]/90 backdrop-blur-md rounded-2xl border border-[#3D3A35] shadow-xl">
            {/* Mic Toggle */}
            <button
              onClick={() => setIsMicOn((prev) => !prev)}
              className={`p-3 rounded-xl transition-all ${
                isMicOn ? 'bg-[#3D405B] text-white' : 'bg-rose-600 text-white'
              }`}
              title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
            >
              {isMicOn ? <Mic size={16} /> : <MicOff size={16} />}
            </button>

            {/* Camera Toggle */}
            <button
              onClick={() => setIsCameraOn((prev) => !prev)}
              className={`p-3 rounded-xl transition-all ${
                isCameraOn ? 'bg-[#3D405B] text-white' : 'bg-rose-600 text-white'
              }`}
              title={isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
            >
              {isCameraOn ? <Video size={16} /> : <VideoOff size={16} />}
            </button>

            {/* Screen Share Toggle */}
            <button
              onClick={handleToggleScreenShare}
              className={`p-3 rounded-xl transition-all ${
                isScreenSharing ? 'bg-[#2A9D8F] text-white' : 'bg-[#3D405B] text-[#94A3B8] hover:text-white'
              }`}
              title="Share Screen"
            >
              <Monitor size={16} />
            </button>

            {/* Student Raise Hand Toggle */}
            {!isHost && (
              <button
                onClick={handleToggleHandRaise}
                className={`px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                  handRaisedByMe ? 'bg-[#E07A5F] text-white ring-2 ring-[#E07A5F]/50' : 'bg-[#3D405B] text-white'
                }`}
              >
                <Hand size={15} />
                <span>{handRaisedByMe ? 'Hand Raised' : 'Raise Hand'}</span>
              </button>
            )}

            {/* Cloud Recording Toggle Button (Admins / Hosts) */}
            {isHost && (
              <button
                onClick={handleToggleRecording}
                className={`px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md ${
                  isRecording
                    ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                    : 'bg-[#E07A5F] hover:bg-[#cc6950] text-white'
                }`}
              >
                {isRecording ? <StopCircle size={15} /> : <CircleDot size={15} />}
                <span>{isRecording ? 'Stop & Save Recording' : 'Record Lesson'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Live Sidebar (Chat & Attendees) */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="h-full bg-[#1E1B18] border-l border-[#3D3A35] flex flex-col shrink-0 overflow-hidden"
            >
              {/* Sidebar Header Tabs */}
              <div className="h-14 px-4 bg-[#25221F] border-b border-[#3D3A35] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSidebarView('CHAT')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      sidebarView === 'CHAT' ? 'bg-[#3D405B] text-white' : 'text-[#94A3B8] hover:text-white'
                    }`}
                  >
                    <MessageSquare size={13} />
                    <span>Live Chat</span>
                  </button>

                  <button
                    onClick={() => setSidebarView('VIEWERS')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      sidebarView === 'VIEWERS' ? 'bg-[#3D405B] text-white' : 'text-[#94A3B8] hover:text-white'
                    }`}
                  >
                    <Users size={13} />
                    <span>Attendees ({attendees.length})</span>
                  </button>
                </div>
              </div>

              {/* Sidebar Content */}
              {sidebarView === 'CHAT' ? (
                <div className="flex-1 flex flex-col justify-between overflow-hidden">
                  {/* Messages Feed */}
                  <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                    {liveMessages.map((m) => (
                      <div
                        key={m.id}
                        className={`p-3 rounded-2xl text-xs space-y-1 ${
                          m.isQuestion
                            ? 'bg-[#E07A5F]/15 border border-[#E07A5F]/30 text-white'
                            : 'bg-[#25221F] text-[#E5E0D8]'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] text-[#94A3B8]">
                          <span className="font-bold text-[#E07A5F]">{m.sender}</span>
                          <span>{m.time}</span>
                        </div>
                        <p className="leading-relaxed">{m.text}</p>
                      </div>
                    ))}
                  </div>

                  {/* Input Form */}
                  <form
                    onSubmit={handleSendLiveMessage}
                    className="p-3 bg-[#25221F] border-t border-[#3D3A35] flex items-center gap-2"
                  >
                    <input
                      type="text"
                      value={inputLiveMessage}
                      onChange={(e) => setInputLiveMessage(e.target.value)}
                      placeholder="Ask a question or send a step..."
                      className="flex-1 px-3 py-2 rounded-xl bg-[#1E1B18] border border-[#3D3A35] text-xs text-white placeholder-[#94A3B8] focus:outline-none focus:ring-1 focus:ring-[#E07A5F]"
                    />
                    <button
                      type="submit"
                      className="p-2 rounded-xl bg-[#E07A5F] hover:bg-[#cc6950] text-white text-xs font-bold transition-all shadow-2xs"
                    >
                      <Send size={14} />
                    </button>
                  </form>
                </div>
              ) : (
                /* Attendees View */
                <div className="flex-1 p-4 space-y-2 overflow-y-auto">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] px-1 mb-2">
                    Active Participants ({attendees.length})
                  </div>
                  {attendees.map((att) => (
                    <div
                      key={att.id}
                      className="p-2.5 rounded-xl bg-[#25221F] border border-[#3D3A35] flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={att.avatar}
                          alt={att.name}
                          className="w-7 h-7 rounded-full object-cover border border-[#3D3A35]"
                        />
                        <span className="font-medium text-white text-xs truncate max-w-[140px]">
                          {att.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {att.handRaised && (
                          <span className="p-1 rounded-md bg-[#E07A5F]/20 text-[#E07A5F]" title="Hand Raised">
                            <Hand size={13} />
                          </span>
                        )}
                        <span className="p-1 rounded-md text-[#94A3B8]">
                          {att.isMuted ? <MicOff size={13} /> : <Mic size={13} className="text-[#2A9D8F]" />}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Lesson Recording Finalized Modal */}
      {recordedLessonResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md p-6 bg-[#25221F] text-white rounded-3xl border border-[#3D3A35] shadow-2xl space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#E07A5F]/20 text-[#E07A5F] flex items-center justify-center">
                <CheckCircle2 size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Lesson Successfully Recorded!</h3>
                <p className="text-xs text-[#94A3B8]">
                  {formatTimer(recordedLessonResult.durationSecs)} • Ready to save and broadcast
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#1E1B18] border border-[#3D3A35] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">Target Storage:</span>
                <span className="font-bold text-[#E07A5F] flex items-center gap-1">
                  <Bookmark size={12} /> Saved Messages
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">Format:</span>
                <span className="font-mono text-white">HD MP4 Video (1080p)</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider block">
                Forward to Channel or Group?
              </label>
              <input
                type="text"
                value={forwardTargetChatId}
                onChange={(e) => setForwardTargetChatId(e.target.value)}
                placeholder="Chat/Channel ID or Name"
                className="w-full p-3 rounded-xl bg-[#1E1B18] border border-[#3D3A35] text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#E07A5F]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => handleDeliverRecording(false)}
                className="px-4 py-2.5 rounded-xl bg-[#3D405B] hover:bg-[#4a4e69] text-white text-xs font-bold transition-all"
              >
                Save to "Saved Messages" Only
              </button>
              <button
                onClick={() => handleDeliverRecording(true)}
                className="px-5 py-2.5 rounded-xl bg-[#E07A5F] hover:bg-[#cc6950] text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md"
              >
                <Send size={14} />
                <span>Save & Forward to Channel</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
