import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Pencil,
  Users,
  Radio,
  Bookmark,
  MessageSquare,
  Video,
  MoreVertical,
  Paperclip,
  Mic,
  MicOff,
  Send,
  Check,
  CheckCheck,
  Pin,
  Lock,
  Unlock,
  Play,
  Pause,
  Download,
  ExternalLink,
  ChevronRight,
  X,
  Copy,
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  Share2,
  Trash2,
  CornerUpLeft,
  Volume2,
  Sparkles,
  HelpCircle,
  Clock,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import {
  Chat,
  Message,
  User,
  ChatType,
  Question,
  LiveStreamSession
} from '../types';
import { CREATIVE_AVATARS, getAvatarUrlByIndex } from '../data/creativeAvatars';
import { INITIAL_USERS } from '../data/mockDatabase';
import { KaTeXRenderer } from './KaTeXRenderer';
import { LiveStreamStudio } from './LiveStreamStudio';

interface Props {
  currentUser: User;
  usersList?: User[];
  onOpenQuestionInBank?: (questionId: string) => void;
  onSelectUserProfile?: (selectedUser: User) => void;
}

// Initial Comprehensive Telegram-style chat seed data
const INITIAL_COMMUNITY_CHATS: Chat[] = [
  {
    id: 'chat-saved-messages',
    name: 'Saved Messages',
    type: 'SAVED_MESSAGES',
    description: 'Personal cloud storage. Forward lessons, recorded videos, tricky SAT formulas, and private notes here.',
    avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120',
    unreadCount: 0,
    members: ['usr-student-01'],
    createdById: 'usr-student-01',
    createdAt: '2026-08-01T00:00:00Z',
  },
  {
    id: 'chat-sat-masterclass-live',
    name: 'Ivy League 1550+ Live Teaching Studio',
    type: 'PUBLIC_CHANNEL',
    description: 'Official daily live stream masterclass with top instructors. Interactive whiteboard drills and hard question proofs.',
    avatarUrl: getAvatarUrlByIndex(0),
    unreadCount: 2,
    members: ['usr-student-01', 'usr-admin-01', 'usr-02', 'usr-04', 'usr-05', 'usr-06'],
    createdById: 'usr-admin-01',
    isLiveActive: true,
    createdAt: '2026-08-02T00:00:00Z',
  },
  {
    id: 'chat-math-800-elite',
    name: 'SAT Math 800 & Desmos Hacks',
    type: 'PUBLIC_GROUP',
    description: 'Peer study group for 800 Math hunters: nonlinear systems, unit circle formulas, and regression tricks.',
    avatarUrl: getAvatarUrlByIndex(5),
    unreadCount: 1,
    members: ['usr-student-01', 'usr-admin-01', 'usr-05'],
    createdById: 'usr-admin-01',
    createdAt: '2026-08-05T00:00:00Z',
  },
  {
    id: 'chat-rw-squad',
    name: 'Reading & Writing 750+ Squad',
    type: 'PUBLIC_GROUP',
    description: 'Transitions, rhetorical synthesis, boundaries, and high-difficulty scientific passage breakdowns.',
    avatarUrl: getAvatarUrlByIndex(6),
    unreadCount: 0,
    members: ['usr-student-01', 'usr-02', 'usr-06'],
    createdById: 'usr-02',
    createdAt: '2026-08-10T00:00:00Z',
  },
  {
    id: 'chat-dm-admin-tutor',
    name: 'Dr. Alistair Vance',
    type: 'DIRECT',
    description: 'Private 1v1 SAT mentorship and score diagnostic reviews.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120',
    unreadCount: 0,
    members: ['usr-student-01', 'usr-admin-01'],
    createdById: 'usr-admin-01',
    createdAt: '2026-08-12T00:00:00Z',
  },
  {
    id: 'chat-vip-leaks',
    name: 'VIP Hardest Question Drills (800 Target)',
    type: 'PRIVATE_CHANNEL',
    description: 'Leaked hard adaptive Module 2 traps and weekly video masterclass replays.',
    avatarUrl: getAvatarUrlByIndex(2),
    inviteCode: 'VIP-1550',
    unreadCount: 0,
    members: ['usr-student-01', 'usr-admin-01'],
    createdById: 'usr-admin-01',
    createdAt: '2026-08-15T00:00:00Z',
  },
];

const INITIAL_MESSAGES_MAP: Record<string, Message[]> = {
  'chat-saved-messages': [
    {
      id: 'sm-1',
      chatId: 'chat-saved-messages',
      senderId: 'usr-student-01',
      senderName: 'You',
      content: 'High-Yield Desmos Math Formula:\nFor quadratic intersection $y = x^2 - 4x + 3$ and $y = 2x - 6$, equate $x^2 - 6x + 9 = 0$ to verify discriminant $\\Delta = 0$ (single intersection point at $(3, 0)$).',
      createdAt: '2026-08-28T14:20:00Z',
      isPinned: true,
    },
    {
      id: 'sm-2',
      chatId: 'chat-saved-messages',
      senderId: 'usr-student-01',
      senderName: 'You',
      content: 'Lesson Recording: Rhetorical Synthesis Masterclass\nReviewed key rules on bullet-point prompt focus (specifying difference vs similarity).',
      recordingVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      recordingTitle: 'Rhetorical Synthesis & Transition Traps',
      recordingDuration: 1240,
      createdAt: '2026-08-29T10:15:00Z',
    },
  ],
  'chat-sat-masterclass-live': [
    {
      id: 'live-1',
      chatId: 'chat-sat-masterclass-live',
      senderId: 'usr-admin-01',
      senderName: 'Dr. Alistair Vance',
      senderRole: 'ADMIN',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120',
      content: 'Welcome to the OnePrep SAT Masterclass Channel.\n\nToday at 19:00 EST, we are conducting a Live Interactive Whiteboard Lesson on Trigonometric Identities & Circle Proofs ($x^2 + y^2 = r^2$). Join via the top Live Broadcast button.',
      isPinned: true,
      createdAt: '2026-08-30T08:00:00Z',
    },
    {
      id: 'live-2',
      chatId: 'chat-sat-masterclass-live',
      senderId: 'usr-admin-01',
      senderName: 'Dr. Alistair Vance',
      senderRole: 'ADMIN',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120',
      content: 'Here is the featured challenging SAT question we will dissect on the Live Whiteboard:',
      attachedQuestionId: 'sqb-math-001',
      attachedQuestion: {
        id: 'sqb-math-001',
        sqbId: '#MATH-8291',
        section: 'MATH',
        domain: 'Advanced Math',
        skill: 'Nonlinear equations in one variable',
        difficulty: 'HARD',
        type: 'MULTIPLE_CHOICE',
        questionText: 'For what positive value of $k$ does the equation $2x^2 - kx + 18 = 0$ have exactly one real solution?',
        options: {
          A: '6',
          B: '12',
          C: '18',
          D: '24',
        },
        correctAnswer: 'B',
        explanation: 'For exactly one real solution, the discriminant must equal zero: $\\Delta = b^2 - 4ac = (-k)^2 - 4(2)(18) = k^2 - 144 = 0 \\implies k = 12$.',
      },
      createdAt: '2026-08-30T08:05:00Z',
    },
  ],
  'chat-math-800-elite': [
    {
      id: 'm800-1',
      chatId: 'chat-math-800-elite',
      senderId: 'usr-05',
      senderName: 'Davron B.',
      senderAvatar: getAvatarUrlByIndex(5),
      content: 'Has anyone encountered the circle geometry problem with tangent lines from Bluebook Practice 6?',
      createdAt: '2026-08-30T11:20:00Z',
    },
    {
      id: 'm800-2',
      chatId: 'chat-math-800-elite',
      senderId: 'usr-student-01',
      senderName: 'You',
      content: 'Yes. The key is remembering that the radius is perpendicular to the tangent line at the point of tangency, creating a right triangle ($a^2 + b^2 = c^2$).',
      createdAt: '2026-08-30T11:25:00Z',
    },
  ],
  'chat-dm-admin-tutor': [
    {
      id: 'dm-1',
      chatId: 'chat-dm-admin-tutor',
      senderId: 'usr-admin-01',
      senderName: 'Dr. Alistair Vance',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120',
      content: 'Hello! I reviewed your recent practice diagnostic. Your Math pacing is solid (790 trajectory), but in Reading Module 2 you lost 30 points on boundary punctuation. Let us review semicolon and em-dash rules.',
      createdAt: '2026-08-30T12:00:00Z',
    },
  ],
};

// Sample questions available to attach in chat
const SAMPLE_SAT_ATTACHMENTS: Question[] = [
  {
    id: 'att-1',
    sqbId: '#MATH-9012',
    section: 'MATH',
    domain: 'Geometry and Trigonometry',
    skill: 'Circles & Arc Lengths',
    difficulty: 'HARD',
    type: 'MULTIPLE_CHOICE',
    questionText: 'A circle in the xy-plane has center $(3, -4)$ and radius $5$. Which point lies on the circle?',
    options: {
      A: '(0, 0)',
      B: '(3, 1)',
      C: '(6, 0)',
      D: '(8, -4)',
    },
    correctAnswer: 'A',
    explanation: 'The equation is $(x-3)^2 + (y+4)^2 = 25$. For $(0,0)$: $(0-3)^2 + (0+4)^2 = 9 + 16 = 25$.',
  },
  {
    id: 'att-2',
    sqbId: '#RW-4419',
    section: 'READING_AND_WRITING',
    domain: 'Standard English Conventions',
    skill: 'Boundaries & Transitions',
    difficulty: 'HARD',
    type: 'MULTIPLE_CHOICE',
    passage: 'The team discovered that the deep-sea mineral vents harbored unique chemoautotrophic bacteria; _______ these organisms thrived without any solar radiation.',
    questionText: 'Which choice completes the text with the most logical transition?',
    options: {
      A: 'consequently,',
      B: 'remarkably,',
      C: 'nevertheless,',
      D: 'in summary,',
    },
    correctAnswer: 'B',
    explanation: '"Remarkably" emphasizes the surprising nature of organisms living without sunlight.',
  },
];

export const CommunityChatHub: React.FC<Props> = ({
  currentUser,
  usersList = INITIAL_USERS,
  onOpenQuestionInBank,
  onSelectUserProfile,
}) => {
  const [chats, setChats] = useState<Chat[]>(INITIAL_COMMUNITY_CHATS);
  const [activeChatId, setActiveChatId] = useState<string>('chat-sat-masterclass-live');
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>(INITIAL_MESSAGES_MAP);

  // Filter Tabs: ALL, DIRECT, GROUPS, CHANNELS, SAVED
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'DIRECT' | 'GROUPS' | 'CHANNELS' | 'SAVED'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Right Info Pane
  const [isRightInfoOpen, setIsRightInfoOpen] = useState<boolean>(false);
  const [rightInfoTab, setRightInfoTab] = useState<'MEMBERS' | 'MEDIA' | 'FILES' | 'QUESTIONS'>('MEMBERS');

  // In-Chat Search State
  const [isInChatSearchOpen, setIsInChatSearchOpen] = useState<boolean>(false);
  const [inChatSearchQuery, setInChatSearchQuery] = useState<string>('');

  // Message Input State
  const [inputText, setInputText] = useState<string>('');
  const [replyingToMessage, setReplyingToMessage] = useState<Message | null>(null);
  const [isRecordingVoice, setIsRecordingVoice] = useState<boolean>(false);
  const [voiceSeconds, setVoiceSeconds] = useState<number>(0);
  const voiceTimerRef = useRef<any>(null);

  // FAB Modal State (Exactly 3 options: Direct, Group, Channel)
  const [isFabMenuOpen, setIsFabMenuOpen] = useState<boolean>(false);
  const [activeFabCreationStep, setActiveFabCreationStep] = useState<'DIRECT' | 'GROUP' | 'CHANNEL' | null>(null);

  // Form states for creation
  const [newChatTitle, setNewChatTitle] = useState<string>('');
  const [newChatDesc, setNewChatDesc] = useState<string>('');
  const [newChatPrivacy, setNewChatPrivacy] = useState<'PUBLIC' | 'PRIVATE'>('PUBLIC');
  const [selectedUserIdsForNewChat, setSelectedUserIdsForNewChat] = useState<Set<string>>(new Set());
  const [userSearchQuery, setUserSearchQuery] = useState<string>('');

  // Attachments Dropdown Modal
  const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState<boolean>(false);
  const [isQuestionPickerOpen, setIsQuestionPickerOpen] = useState<boolean>(false);

  // Live Stream Studio Launcher
  const [isLiveStudioActive, setIsLiveStudioActive] = useState<boolean>(false);

  // Audio Playback state & Speed
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [audioSpeed, setAudioSpeed] = useState<1 | 1.5 | 2>(1);

  // Copied code toast indicator
  const [copiedCodeText, setCopiedCodeText] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Global Keyboard Shortcuts (Esc to clear search or close modals, Cmd+K to focus search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 'Escape') {
        if (isFabMenuOpen || activeFabCreationStep) {
          setIsFabMenuOpen(false);
          setActiveFabCreationStep(null);
        } else if (isQuestionPickerOpen) {
          setIsQuestionPickerOpen(false);
        } else if (isInChatSearchOpen) {
          setIsInChatSearchOpen(false);
          setInChatSearchQuery('');
        } else if (searchQuery) {
          setSearchQuery('');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFabMenuOpen, activeFabCreationStep, isQuestionPickerOpen, isInChatSearchOpen, searchQuery]);

  // Active chat object
  const activeChat = useMemo(() => {
    return chats.find((c) => c.id === activeChatId) || chats[0];
  }, [chats, activeChatId]);

  // Current message thread
  const currentMessages = useMemo(() => {
    return messagesMap[activeChatId] || [];
  }, [messagesMap, activeChatId]);

  // In-chat filtered messages if in-chat search active
  const displayedMessages = useMemo(() => {
    if (!isInChatSearchOpen || !inChatSearchQuery.trim()) {
      return currentMessages;
    }
    const q = inChatSearchQuery.toLowerCase().trim();
    return currentMessages.filter((m) =>
      m.content?.toLowerCase().includes(q) ||
      m.attachedQuestion?.questionText.toLowerCase().includes(q) ||
      m.recordingTitle?.toLowerCase().includes(q)
    );
  }, [currentMessages, isInChatSearchOpen, inChatSearchQuery]);

  // Pinned message
  const pinnedMessage = useMemo(() => {
    return currentMessages.find((m) => m.isPinned);
  }, [currentMessages]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages, activeChatId]);

  // Filtered Chats in Left Pane
  const filteredChats = useMemo(() => {
    let result = chats;

    // Filter by Category
    if (activeCategory === 'DIRECT') {
      result = result.filter((c) => c.type === 'DIRECT');
    } else if (activeCategory === 'GROUPS') {
      result = result.filter((c) => c.type === 'PUBLIC_GROUP' || c.type === 'PRIVATE_GROUP');
    } else if (activeCategory === 'CHANNELS') {
      result = result.filter((c) => c.type === 'PUBLIC_CHANNEL' || c.type === 'PRIVATE_CHANNEL');
    } else if (activeCategory === 'SAVED') {
      result = result.filter((c) => c.type === 'SAVED_MESSAGES');
    }

    // Filter by Search Query across names, usernames, and message content
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((c) => {
        const nameMatch = c.name.toLowerCase().includes(q);
        const descMatch = c.description?.toLowerCase().includes(q);
        const inviteMatch = c.inviteCode?.toLowerCase().includes(q);
        const messageMatch = (messagesMap[c.id] || []).some((m) =>
          m.content?.toLowerCase().includes(q)
        );
        return nameMatch || descMatch || inviteMatch || messageMatch;
      });
    }

    return result;
  }, [chats, activeCategory, searchQuery, messagesMap]);

  // Registered Users matching search for global search dropdown
  const matchedUsers = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().replace(/^@/, '').trim();
    return usersList.filter(
      (u) =>
        u.id !== currentUser.id &&
        (u.username.toLowerCase().includes(q) || u.fullName.toLowerCase().includes(q))
    );
  }, [usersList, searchQuery, currentUser.id]);

  // Send Message Handler
  const handleSendMessage = (content?: string, extra?: Partial<Message>) => {
    const textToSend = content !== undefined ? content : inputText;
    if (!textToSend.trim() && !extra) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      chatId: activeChatId,
      senderId: currentUser.id,
      senderName: currentUser.fullName,
      senderAvatar: currentUser.avatarUrl,
      senderRole: currentUser.role,
      content: textToSend.trim(),
      createdAt: new Date().toISOString(),
      ...(replyingToMessage ? { replyToMessageId: replyingToMessage.id } : {}),
      ...extra,
    };

    setMessagesMap((prev) => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), newMsg],
    }));

    // Update last message in chat list
    setChats((prev) =>
      prev.map((c) => (c.id === activeChatId ? { ...c, lastMessage: newMsg } : c))
    );

    setInputText('');
    setReplyingToMessage(null);
    setIsAttachmentMenuOpen(false);
  };

  // Voice Note Recording
  const handleToggleVoiceRecord = () => {
    if (isRecordingVoice) {
      clearInterval(voiceTimerRef.current);
      setIsRecordingVoice(false);
      const duration = voiceSeconds;
      setVoiceSeconds(0);

      // Simulate sending voice note
      handleSendMessage('', {
        voiceAudioUrl: 'https://actions.google.com/sounds/v1/conversations/greeting.ogg',
        voiceDuration: duration || 4,
      });
    } else {
      setIsRecordingVoice(true);
      setVoiceSeconds(0);
      voiceTimerRef.current = setInterval(() => {
        setVoiceSeconds((prev) => prev + 1);
      }, 1000);
    }
  };

  // Pin Message
  const handleTogglePinMessage = (messageId: string) => {
    setMessagesMap((prev) => {
      const thread = prev[activeChatId] || [];
      const updated = thread.map((m) => {
        if (m.id === messageId) {
          return { ...m, isPinned: !m.isPinned };
        }
        return { ...m, isPinned: false };
      });
      return { ...prev, [activeChatId]: updated };
    });
  };

  // Forward to Saved Messages
  const handleForwardToSavedMessages = (msg: Message) => {
    const forwarded: Message = {
      ...msg,
      id: `fwd-${Date.now()}`,
      chatId: 'chat-saved-messages',
      content: `Forwarded from ${activeChat.name}:\n\n${msg.content || ''}`,
      createdAt: new Date().toISOString(),
    };

    setMessagesMap((prev) => ({
      ...prev,
      'chat-saved-messages': [...(prev['chat-saved-messages'] || []), forwarded],
    }));

    setCopiedCodeText('Message forwarded to Saved Messages');
    setTimeout(() => setCopiedCodeText(null), 2500);
  };

  // Delete message
  const handleDeleteMessage = (messageId: string) => {
    setMessagesMap((prev) => ({
      ...prev,
      [activeChatId]: (prev[activeChatId] || []).filter((m) => m.id !== messageId),
    }));
  };

  // Create Direct Chat with selected user
  const handleStartDirectChat = (targetUser: User) => {
    const existing = chats.find(
      (c) => c.type === 'DIRECT' && c.members.includes(targetUser.id)
    );
    if (existing) {
      setActiveChatId(existing.id);
      setActiveFabCreationStep(null);
      setIsFabMenuOpen(false);
      setSearchQuery('');
      return;
    }

    const newDirectChat: Chat = {
      id: `chat-dm-${Date.now()}`,
      name: targetUser.fullName,
      type: 'DIRECT',
      description: `Direct conversation with @${targetUser.username}`,
      avatarUrl: targetUser.avatarUrl || getAvatarUrlByIndex(1),
      members: [currentUser.id, targetUser.id],
      createdById: currentUser.id,
      createdAt: new Date().toISOString(),
    };

    setChats((prev) => [newDirectChat, ...prev]);
    setActiveChatId(newDirectChat.id);
    setActiveFabCreationStep(null);
    setIsFabMenuOpen(false);
    setSearchQuery('');
  };

  // Submit New Group or Channel Creation
  const handleCreateGroupOrChannelSubmit = () => {
    if (!newChatTitle.trim()) return;

    let createdChat: Chat;

    if (activeFabCreationStep === 'GROUP') {
      createdChat = {
        id: `chat-grp-${Date.now()}`,
        name: newChatTitle.trim(),
        type: newChatPrivacy === 'PUBLIC' ? 'PUBLIC_GROUP' : 'PRIVATE_GROUP',
        description: newChatDesc.trim() || 'SAT Study Cohort Group',
        avatarUrl: getAvatarUrlByIndex(Math.floor(Math.random() * 8)),
        inviteCode: newChatPrivacy === 'PRIVATE' ? `GRP-${Math.floor(1000 + Math.random() * 9000)}` : undefined,
        members: [currentUser.id, ...Array.from(selectedUserIdsForNewChat)],
        createdById: currentUser.id,
        createdAt: new Date().toISOString(),
      };
    } else {
      // CHANNEL
      createdChat = {
        id: `chat-chn-${Date.now()}`,
        name: newChatTitle.trim(),
        type: newChatPrivacy === 'PUBLIC' ? 'PUBLIC_CHANNEL' : 'PRIVATE_CHANNEL',
        description: newChatDesc.trim() || 'Broadcast and Masterclass Channel',
        avatarUrl: getAvatarUrlByIndex(Math.floor(Math.random() * 8)),
        inviteCode: newChatPrivacy === 'PRIVATE' ? `CHN-${Math.floor(1000 + Math.random() * 9000)}` : undefined,
        members: [currentUser.id],
        createdById: currentUser.id,
        createdAt: new Date().toISOString(),
      };
    }

    setChats((prev) => [createdChat, ...prev]);
    setActiveChatId(createdChat.id);
    setActiveFabCreationStep(null);
    setIsFabMenuOpen(false);
    setNewChatTitle('');
    setNewChatDesc('');
    setSelectedUserIdsForNewChat(new Set());
  };

  // Copy text helper
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeText(`${label} copied to clipboard`);
    setTimeout(() => setCopiedCodeText(null), 2000);
  };

  // Saved Lesson Recording Handler from Live Stream
  const handleLessonRecorded = (savedMessage: Message, targetChatId?: string) => {
    setMessagesMap((prev) => ({
      ...prev,
      'chat-saved-messages': [...(prev['chat-saved-messages'] || []), savedMessage],
    }));

    if (targetChatId && targetChatId !== 'chat-saved-messages') {
      const forwardedMsg = {
        ...savedMessage,
        id: `fwd-${Date.now()}`,
        chatId: targetChatId,
      };
      setMessagesMap((prev) => ({
        ...prev,
        [targetChatId]: [...(prev[targetChatId] || []), forwardedMsg],
      }));
    }
  };

  const getChatTypeIcon = (type: ChatType) => {
    switch (type) {
      case 'SAVED_MESSAGES':
        return <Bookmark size={13} className="text-[#E07A5F]" />;
      case 'PUBLIC_CHANNEL':
      case 'PRIVATE_CHANNEL':
      case 'CHANNEL':
        return <Radio size={13} className="text-[#2A9D8F]" />;
      case 'PUBLIC_GROUP':
      case 'PRIVATE_GROUP':
        return <Users size={13} className="text-[#3D405B]" />;
      default:
        return <MessageSquare size={13} className="text-[#64748B]" />;
    }
  };

  return (
    <div className="h-[calc(100vh-4.5rem)] flex bg-[#FAF8F5] text-[#1E1B18] font-sans overflow-hidden border-t border-[#E5E0D8]">
      {/* Toast notification */}
      {copiedCodeText && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#1E1B18] text-white text-xs font-bold shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 size={14} className="text-[#2A9D8F]" />
          <span>{copiedCodeText}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. LEFT PANE: Search, Unified Filters & FAB (280px - 320px) */}
      {/* ========================================================================= */}
      <div className="w-80 bg-white border-r border-[#E5E0D8] flex flex-col shrink-0 relative">
        {/* Top Search Header */}
        <div className="p-3.5 border-b border-[#E5E0D8] space-y-2.5">
          {/* Global Search Bar with ESC & clear */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chats, @username, or messages..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] text-xs text-[#1E1B18] placeholder-[#64748B] focus:outline-none focus:border-[#1E1B18] transition-colors"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#64748B] hover:text-[#1E1B18]"
                title="Clear search (Esc)"
              >
                ✕
              </button>
            ) : (
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-mono text-[#64748B] border border-[#E5E0D8] rounded px-1">
                ⌘K
              </span>
            )}
          </div>

          {/* Clean Underline/Pill Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            {[
              { id: 'ALL', label: 'All' },
              { id: 'DIRECT', label: 'Direct' },
              { id: 'GROUPS', label: 'Groups' },
              { id: 'CHANNELS', label: 'Channels' },
              { id: 'SAVED', label: 'Saved' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as any)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer shrink-0 ${
                  activeCategory === tab.id
                    ? 'bg-[#1E1B18] text-white shadow-2xs'
                    : 'text-[#64748B] hover:text-[#1E1B18] hover:bg-[#FAF8F5]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search Results Preview (Matched Users from global query) */}
        {searchQuery.trim() && matchedUsers.length > 0 && (
          <div className="p-3 border-b border-[#E5E0D8] bg-[#FAF8F5] space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
              Registered Users (@username)
            </span>
            <div className="space-y-1">
              {matchedUsers.slice(0, 3).map((u) => (
                <div
                  key={u.id}
                  onClick={() => handleStartDirectChat(u)}
                  className="p-2 rounded-xl bg-white hover:bg-[#F5F0EB] border border-[#E5E0D8] flex items-center justify-between cursor-pointer transition-colors text-xs"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={u.avatarUrl || getAvatarUrlByIndex(1)}
                      alt={u.fullName}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-bold text-[#1E1B18]">{u.fullName}</div>
                      <div className="text-[10px] text-[#64748B]">@{u.username}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-[#E07A5F] font-bold">1v1 Message</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chat List Scrollable Items */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#FAF8F5]">
          {filteredChats.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <MessageSquare size={28} className="mx-auto text-[#64748B] opacity-40" />
              <p className="text-xs text-[#64748B]">No conversations found</p>
            </div>
          ) : (
            filteredChats.map((chat) => {
              const isSelected = chat.id === activeChatId;
              const lastMsg =
                messagesMap[chat.id]?.[messagesMap[chat.id].length - 1] || chat.lastMessage;
              const isSavedMessages = chat.type === 'SAVED_MESSAGES';

              return (
                <div
                  key={chat.id}
                  onClick={() => setActiveChatId(chat.id)}
                  className={`p-3 flex items-center gap-3 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#FAF8F5] border-l-3 border-l-[#E07A5F]'
                      : 'hover:bg-[#FAF8F5]/60'
                  }`}
                >
                  {/* Minimalist Avatar with status dot */}
                  <div className="relative shrink-0">
                    <img
                      src={chat.avatarUrl || getAvatarUrlByIndex(0)}
                      alt={chat.name}
                      className="w-11 h-11 rounded-2xl object-cover border border-[#E5E0D8] bg-white"
                    />
                    {chat.isLiveActive ? (
                      <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                      </span>
                    ) : isSavedMessages ? (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#E07A5F] border-2 border-white rounded-full flex items-center justify-center">
                        <Bookmark size={6} className="text-white" />
                      </span>
                    ) : (
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#2A9D8F] border-2 border-white rounded-full"></span>
                    )}
                  </div>

                  {/* Chat Metadata */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h4 className="text-xs font-bold text-[#1E1B18] truncate flex items-center gap-1.5">
                        {getChatTypeIcon(chat.type)}
                        <span className="truncate">{chat.name}</span>
                      </h4>
                      <span className="text-[10px] text-[#64748B] shrink-0 font-mono">
                        {lastMsg
                          ? new Date(lastMsg.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : ''}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-1">
                      <p className="text-[11px] text-[#64748B] truncate leading-tight">
                        {lastMsg?.content ? (
                          lastMsg.content.slice(0, 42)
                        ) : lastMsg?.voiceAudioUrl ? (
                          'Voice Note'
                        ) : lastMsg?.recordingVideoUrl ? (
                          'Lesson Recording'
                        ) : lastMsg?.attachedQuestion ? (
                          'SAT Question Card'
                        ) : (
                          chat.description || 'Tap to open chat...'
                        )}
                      </p>

                      {chat.unreadCount && chat.unreadCount > 0 ? (
                        <span className="px-1.5 py-0.5 rounded-full bg-[#1E1B18] text-white text-[9px] font-mono font-bold shrink-0">
                          {chat.unreadCount}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* --------------------------------------------------------------------- */}
        {/* The Single Pencil Floating Action Button (FAB) at Bottom-Right */}
        {/* --------------------------------------------------------------------- */}
        <div className="absolute bottom-4 right-4 z-20">
          <button
            onClick={() => setIsFabMenuOpen((prev) => !prev)}
            className="w-12 h-12 rounded-full bg-[#1E1B18] hover:bg-[#3D405B] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer"
            title="Create New Conversation"
          >
            <Pencil size={18} />
          </button>

          {/* Compact Dropdown Modal with Exactly 3 Options */}
          <AnimatePresence>
            {isFabMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute bottom-14 right-0 w-60 bg-white rounded-2xl border border-[#E5E0D8] shadow-2xl p-1.5 space-y-1"
              >
                <button
                  onClick={() => {
                    setIsFabMenuOpen(false);
                    setActiveFabCreationStep('DIRECT');
                  }}
                  className="w-full p-2.5 rounded-xl hover:bg-[#FAF8F5] text-left text-xs font-bold text-[#1E1B18] flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#FAF8F5] border border-[#E5E0D8] flex items-center justify-center text-[#1E1B18]">
                    <MessageSquare size={13} />
                  </div>
                  <div>
                    <div>New Direct Message</div>
                    <div className="text-[10px] font-normal text-[#64748B]">Chat 1v1 by @username</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsFabMenuOpen(false);
                    setActiveFabCreationStep('GROUP');
                    setNewChatTitle('');
                    setNewChatPrivacy('PUBLIC');
                  }}
                  className="w-full p-2.5 rounded-xl hover:bg-[#FAF8F5] text-left text-xs font-bold text-[#1E1B18] flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#FAF8F5] border border-[#E5E0D8] flex items-center justify-center text-[#3D405B]">
                    <Users size={13} />
                  </div>
                  <div>
                    <div>New Group</div>
                    <div className="text-[10px] font-normal text-[#64748B]">Study Cohort & Discussion</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsFabMenuOpen(false);
                    setActiveFabCreationStep('CHANNEL');
                    setNewChatTitle('');
                    setNewChatDesc('');
                    setNewChatPrivacy('PUBLIC');
                  }}
                  className="w-full p-2.5 rounded-xl hover:bg-[#FAF8F5] text-left text-xs font-bold text-[#1E1B18] flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#FAF8F5] border border-[#E5E0D8] flex items-center justify-center text-[#2A9D8F]">
                    <Radio size={13} />
                  </div>
                  <div>
                    <div>New Channel</div>
                    <div className="text-[10px] font-normal text-[#64748B]">Broadcast & Masterclass</div>
                  </div>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. CENTER PANE: Message Thread & Media Stream (Flex-1) */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        {/* Header Bar */}
        <div className="h-16 px-6 bg-white border-b border-[#E5E0D8] flex items-center justify-between shrink-0 shadow-2xs">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={activeChat.avatarUrl || getAvatarUrlByIndex(0)}
              alt={activeChat.name}
              className="w-10 h-10 rounded-2xl object-cover border border-[#E5E0D8] shrink-0"
            />
            <div className="min-w-0">
              <h3 className="text-sm font-black text-[#1E1B18] truncate flex items-center gap-2">
                <span>{activeChat.name}</span>
                {activeChat.inviteCode && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#E5E0D8] text-[#3D405B]">
                    {activeChat.inviteCode}
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-[#64748B] flex items-center gap-2 truncate">
                {activeChat.isLiveActive ? (
                  <span className="text-rose-600 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                    Live Teaching Studio Active
                  </span>
                ) : activeChat.type === 'DIRECT' ? (
                  <span>online • Direct Message</span>
                ) : activeChat.type === 'SAVED_MESSAGES' ? (
                  <span>Personal Cloud Storage Vault</span>
                ) : (
                  <span>{activeChat.members.length} members • {activeChat.type.replace('_', ' ')}</span>
                )}
              </p>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2">
            {/* In-Chat Search Trigger */}
            <button
              onClick={() => {
                setIsInChatSearchOpen((prev) => !prev);
                setInChatSearchQuery('');
              }}
              className={`p-2 rounded-xl text-xs font-bold transition-all border border-[#E5E0D8] cursor-pointer ${
                isInChatSearchOpen ? 'bg-[#1E1B18] text-white' : 'text-[#64748B] hover:bg-[#FAF8F5]'
              }`}
              title="Search in this conversation"
            >
              <Search size={15} />
            </button>

            {/* Live Studio Broadcast Button for Channel / Group Owners */}
            {(activeChat.type === 'PUBLIC_CHANNEL' ||
              activeChat.type === 'PUBLIC_GROUP' ||
              activeChat.type === 'PRIVATE_CHANNEL') && (
              <button
                onClick={() => setIsLiveStudioActive(true)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-2xs cursor-pointer ${
                  activeChat.isLiveActive
                    ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                    : 'bg-[#1E1B18] hover:bg-[#3D405B] text-white'
                }`}
              >
                <Video size={14} className={activeChat.isLiveActive ? 'text-white' : 'text-[#E07A5F]'} />
                <span className="hidden sm:inline">
                  {activeChat.isLiveActive ? 'Join Live Studio' : 'Start Live Broadcast'}
                </span>
              </button>
            )}

            {/* Chat Info Sidebar Trigger */}
            <button
              onClick={() => setIsRightInfoOpen((prev) => !prev)}
              className={`p-2 rounded-xl text-xs font-bold transition-all border border-[#E5E0D8] cursor-pointer ${
                isRightInfoOpen ? 'bg-[#FAF8F5] text-[#1E1B18]' : 'text-[#64748B] hover:bg-[#FAF8F5]'
              }`}
              title="Chat Info & Directory"
            >
              <MoreVertical size={16} />
            </button>
          </div>
        </div>

        {/* In-Chat Search Bar Overlay */}
        {isInChatSearchOpen && (
          <div className="px-6 py-2 bg-[#FAF8F5] border-b border-[#E5E0D8] flex items-center justify-between gap-3 text-xs">
            <div className="flex-1 flex items-center gap-2">
              <Search size={13} className="text-[#64748B]" />
              <input
                type="text"
                value={inChatSearchQuery}
                onChange={(e) => setInChatSearchQuery(e.target.value)}
                placeholder="Find in conversation..."
                autoFocus
                className="w-full bg-transparent border-none text-xs text-[#1E1B18] focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-[#64748B]">
                {displayedMessages.length} matches
              </span>
              <button
                onClick={() => {
                  setIsInChatSearchOpen(false);
                  setInChatSearchQuery('');
                }}
                className="text-xs text-[#64748B] hover:text-[#1E1B18]"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Pinned Message Banner */}
        {pinnedMessage && (
          <div className="px-6 py-2 bg-[#FAF8F5] border-b border-[#E5E0D8] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 truncate">
              <Pin size={13} className="text-[#E07A5F] shrink-0" />
              <span className="font-bold text-[#1E1B18] shrink-0">Pinned Message:</span>
              <span className="text-[#64748B] truncate">{pinnedMessage.content?.slice(0, 90)}</span>
            </div>
            <button
              onClick={() => handleTogglePinMessage(pinnedMessage.id)}
              className="text-[10px] font-bold text-[#64748B] hover:text-[#1E1B18] cursor-pointer"
            >
              Unpin
            </button>
          </div>
        )}

        {/* Replying Banner */}
        {replyingToMessage && (
          <div className="px-6 py-2 bg-[#FFF4F0] border-b border-[#FCD9CE] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 truncate">
              <CornerUpLeft size={13} className="text-[#E07A5F] shrink-0" />
              <span className="font-bold text-[#E07A5F] shrink-0">Replying to {replyingToMessage.senderName}:</span>
              <span className="text-[#64748B] truncate">{replyingToMessage.content?.slice(0, 80)}</span>
            </div>
            <button
              onClick={() => setReplyingToMessage(null)}
              className="text-xs text-[#64748B] hover:text-[#1E1B18] cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Message Feed Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-[#FAF8F5]/30">
          {displayedMessages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;

            return (
              <div
                key={msg.id}
                className={`group flex gap-3 max-w-2xl ${isMe ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Sender Avatar */}
                {!isMe && (
                  <img
                    src={msg.senderAvatar || getAvatarUrlByIndex(1)}
                    alt={msg.senderName}
                    className="w-8 h-8 rounded-xl object-cover border border-[#E5E0D8] shrink-0 self-end"
                  />
                )}

                {/* Bubble Container */}
                <div className="space-y-1 max-w-[85%]">
                  {/* Sender Name & Role */}
                  {!isMe && (
                    <div className="flex items-center gap-1.5 text-[10px] text-[#64748B] px-1">
                      <span className="font-bold text-[#1E1B18]">{msg.senderName}</span>
                      {msg.senderRole === 'ADMIN' && (
                        <span className="px-1.5 py-0.2 rounded bg-[#FFF4F0] border border-[#FCD9CE] text-[#E07A5F] font-mono font-bold">
                          Admin / Tutor
                        </span>
                      )}
                    </div>
                  )}

                  {/* Main Bubble Body */}
                  <div
                    className={`p-4 rounded-3xl text-xs space-y-3 shadow-2xs relative ${
                      isMe
                        ? 'bg-[#1E1B18] text-white rounded-br-xs'
                        : 'bg-white border border-[#E5E0D8] text-[#1E1B18] rounded-bl-xs'
                    }`}
                  >
                    {/* Replying indicator in bubble */}
                    {msg.replyToMessageId && (
                      <div
                        className={`p-2 rounded-xl text-[11px] mb-2 border-l-2 ${
                          isMe
                            ? 'bg-white/10 border-white/50 text-white/80'
                            : 'bg-[#FAF8F5] border-[#E07A5F] text-[#64748B]'
                        }`}
                      >
                        Replying to previous message
                      </div>
                    )}

                    {/* Text / Markdown / LaTeX Math */}
                    {msg.content && (
                      <div className="leading-relaxed whitespace-pre-wrap">
                        <KaTeXRenderer text={msg.content} />
                      </div>
                    )}

                    {/* Minimalist SAT Question Card */}
                    {msg.attachedQuestion && (
                      <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] text-[#1E1B18] space-y-3">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-mono font-bold text-[#E07A5F]">
                            {msg.attachedQuestion.sqbId || '#SAT-QUESTION'}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-white border border-[#E5E0D8] font-bold text-[#3D405B]">
                            {msg.attachedQuestion.domain} • {msg.attachedQuestion.difficulty}
                          </span>
                        </div>

                        {msg.attachedQuestion.passage && (
                          <p className="text-xs italic text-[#64748B] bg-white p-3 rounded-xl border border-[#E5E0D8]">
                            "{msg.attachedQuestion.passage}"
                          </p>
                        )}

                        <div className="text-xs font-bold text-[#1E1B18]">
                          <KaTeXRenderer text={msg.attachedQuestion.questionText} />
                        </div>

                        {/* Question Options */}
                        {msg.attachedQuestion.options && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {Object.entries(msg.attachedQuestion.options).map(([k, val]) => (
                              <div
                                key={k}
                                className="p-2 rounded-xl bg-white border border-[#E5E0D8] flex items-center gap-2"
                              >
                                <span className="font-bold text-[#E07A5F]">{k}.</span>
                                <span>{val}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Action: Open in Question Bank */}
                        <div className="pt-2 border-t border-[#E5E0D8] flex items-center justify-between">
                          <span className="text-[10px] text-[#64748B]">Official College Board Bank</span>
                          <button
                            onClick={() => onOpenQuestionInBank?.(msg.attachedQuestion!.id)}
                            className="px-3 py-1.5 rounded-xl bg-[#1E1B18] hover:bg-[#3D405B] text-white text-[11px] font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all"
                          >
                            <span>Open in Question Bank</span>
                            <ChevronRight size={13} />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Recorded Video Lesson Card */}
                    {msg.recordingVideoUrl && (
                      <div className="p-3 rounded-2xl bg-black/95 text-white space-y-2">
                        <div className="flex items-center justify-between text-[10px] text-[#E07A5F] font-bold uppercase tracking-wider">
                          <span className="flex items-center gap-1.5">
                            <Radio size={12} />
                            <span>Live Lesson Recording Replay</span>
                          </span>
                          <span className="font-mono text-white/60">
                            {Math.floor((msg.recordingDuration || 120) / 60)}m {(msg.recordingDuration || 120) % 60}s
                          </span>
                        </div>
                        <video
                          src={msg.recordingVideoUrl}
                          controls
                          className="w-full rounded-xl max-h-56 bg-black"
                        />
                        <div className="flex items-center justify-between text-xs pt-1">
                          <span className="font-bold truncate text-white">
                            {msg.recordingTitle || 'SAT Masterclass Recording'}
                          </span>
                          <a
                            href={msg.recordingVideoUrl}
                            download
                            className="p-1 text-[#64748B] hover:text-white"
                            title="Download Recording"
                          >
                            <Download size={13} />
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Clean Voice Note Player with Waveform & Speed Toggle */}
                    {msg.voiceAudioUrl && (
                      <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] text-[#1E1B18]">
                        <button
                          onClick={() =>
                            setPlayingAudioId(playingAudioId === msg.id ? null : msg.id)
                          }
                          className="w-8 h-8 rounded-full bg-[#1E1B18] text-white flex items-center justify-center cursor-pointer shadow-2xs shrink-0"
                        >
                          {playingAudioId === msg.id ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                        </button>

                        <div className="flex-1 space-y-1">
                          {/* Animated sound wave bars */}
                          <div className="flex items-center gap-0.5 h-4">
                            {[10, 22, 14, 28, 18, 24, 12, 26, 20, 16, 22, 10].map((h, i) => (
                              <div
                                key={i}
                                className={`w-1 rounded-full ${
                                  playingAudioId === msg.id
                                    ? 'bg-[#E07A5F] animate-pulse'
                                    : 'bg-[#64748B]/40'
                                }`}
                                style={{ height: `${h}px` }}
                              />
                            ))}
                          </div>
                          <div className="flex items-center justify-between text-[9px] font-mono text-[#64748B]">
                            <span>0:0{msg.voiceDuration || 4}</span>
                            <button
                              onClick={() =>
                                setAudioSpeed((prev) => (prev === 1 ? 1.5 : prev === 1.5 ? 2 : 1))
                              }
                              className="px-1.5 py-0.2 rounded bg-white border border-[#E5E0D8] font-bold text-[#1E1B18] cursor-pointer"
                            >
                              {audioSpeed}x
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Timestamp & Read Receipts */}
                    <div className="flex items-center justify-end gap-1.5 text-[9px] text-[#64748B] pt-0.5">
                      <span>
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      {isMe && <CheckCheck size={12} className="text-[#2A9D8F]" />}
                    </div>

                    {/* Quick Hover Message Actions */}
                    <div className="absolute top-1 right-2 hidden group-hover:flex items-center gap-1 bg-white border border-[#E5E0D8] rounded-xl p-1 shadow-sm text-xs text-[#64748B]">
                      <button
                        onClick={() => setReplyingToMessage(msg)}
                        className="p-1 hover:text-[#1E1B18] rounded"
                        title="Reply"
                      >
                        <CornerUpLeft size={12} />
                      </button>
                      <button
                        onClick={() => handleTogglePinMessage(msg.id)}
                        className="p-1 hover:text-[#1E1B18] rounded"
                        title="Pin"
                      >
                        <Pin size={12} />
                      </button>
                      <button
                        onClick={() => handleForwardToSavedMessages(msg)}
                        className="p-1 hover:text-[#1E1B18] rounded"
                        title="Forward to Saved Messages"
                      >
                        <Bookmark size={12} />
                      </button>
                      <button
                        onClick={() => handleCopy(msg.content || '', 'Message text')}
                        className="p-1 hover:text-[#1E1B18] rounded"
                        title="Copy"
                      >
                        <Copy size={12} />
                      </button>
                      {isMe && (
                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="p-1 hover:text-rose-600 rounded"
                          title="Delete"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Bar */}
        <div className="p-4 bg-white border-t border-[#E5E0D8] relative">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            {/* Attachment Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsAttachmentMenuOpen((prev) => !prev)}
                className="p-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F5F0EB] border border-[#E5E0D8] text-[#1E1B18] transition-all cursor-pointer shadow-2xs"
                title="Attach SAT Question or Document"
              >
                <Paperclip size={16} />
              </button>

              {/* Attachment Dropdown */}
              <AnimatePresence>
                {isAttachmentMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute bottom-12 left-0 w-64 bg-white rounded-2xl border border-[#E5E0D8] shadow-2xl p-1.5 space-y-1 z-30"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setIsAttachmentMenuOpen(false);
                        setIsQuestionPickerOpen(true);
                      }}
                      className="w-full p-2.5 rounded-xl hover:bg-[#FAF8F5] text-left text-xs font-bold text-[#1E1B18] flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <div className="w-7 h-7 rounded-lg bg-[#FAF8F5] border border-[#E5E0D8] flex items-center justify-center text-[#E07A5F]">
                        <HelpCircle size={14} />
                      </div>
                      <div>
                        <div>Attach SAT Question</div>
                        <div className="text-[10px] font-normal text-[#64748B]">From official question bank</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsAttachmentMenuOpen(false);
                        handleSendMessage('Uploaded Practice Worksheet (PDF):', {
                          mediaName: 'SAT_Math_Hard_Drills_Module2.pdf',
                          mediaType: 'pdf',
                          mediaUrl: '#',
                        });
                      }}
                      className="w-full p-2.5 rounded-xl hover:bg-[#FAF8F5] text-left text-xs font-bold text-[#1E1B18] flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <div className="w-7 h-7 rounded-lg bg-[#FAF8F5] border border-[#E5E0D8] flex items-center justify-center text-[#3D405B]">
                        <FileText size={14} />
                      </div>
                      <div>
                        <div>Share Document (PDF)</div>
                        <div className="text-[10px] font-normal text-[#64748B]">Formula sheets, study logs</div>
                      </div>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Input Text Field */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Write a message, LaTeX formula ($x^2$), or question..."
              className="flex-1 p-3 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] text-xs text-[#1E1B18] placeholder-[#64748B] focus:outline-none focus:border-[#1E1B18]"
            />

            {/* Voice Note Button */}
            <button
              type="button"
              onClick={handleToggleVoiceRecord}
              className={`p-2.5 rounded-2xl transition-all cursor-pointer shadow-2xs ${
                isRecordingVoice
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-[#FAF8F5] hover:bg-[#F5F0EB] border border-[#E5E0D8] text-[#1E1B18]'
              }`}
              title={isRecordingVoice ? 'Tap to Send Voice Note' : 'Record Voice Note'}
            >
              {isRecordingVoice ? (
                <div className="flex items-center gap-1.5">
                  <MicOff size={16} />
                  <span className="text-xs font-mono font-bold">0:0{voiceSeconds}</span>
                </div>
              ) : (
                <Mic size={16} />
              )}
            </button>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-5 py-3 rounded-2xl bg-[#1E1B18] hover:bg-[#3D405B] text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-2xs disabled:opacity-40 transition-all"
            >
              <Send size={14} />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. RIGHT PANE: Collapsible Chat Info & Directory (280px) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isRightInfoOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 300, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="h-full bg-white border-l border-[#E5E0D8] flex flex-col shrink-0 overflow-hidden shadow-sm"
          >
            <div className="p-4 border-b border-[#E5E0D8] flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1E1B18]">Chat Details</h3>
              <button
                onClick={() => setIsRightInfoOpen(false)}
                className="text-[#64748B] hover:text-[#1E1B18] text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 p-4 space-y-5 overflow-y-auto">
              {/* Avatar & Title */}
              <div className="text-center space-y-2">
                <img
                  src={activeChat.avatarUrl || getAvatarUrlByIndex(0)}
                  alt={activeChat.name}
                  className="w-16 h-16 rounded-3xl object-cover mx-auto border-2 border-[#E5E0D8] shadow-2xs"
                />
                <h4 className="text-sm font-extrabold text-[#1E1B18]">{activeChat.name}</h4>
                <p className="text-xs text-[#64748B] leading-relaxed">{activeChat.description}</p>
              </div>

              {/* Invite Code */}
              {activeChat.inviteCode && (
                <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                    Invite Passcode:
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-[#E07A5F]">
                      {activeChat.inviteCode}
                    </span>
                    <button
                      onClick={() => handleCopy(activeChat.inviteCode!, 'Passcode')}
                      className="text-[#64748B] hover:text-[#1E1B18]"
                      title="Copy Passcode"
                    >
                      <Copy size={13} />
                    </button>
                  </div>
                </div>
              )}

              {/* Tab Selector: Members vs Media vs Questions */}
              <div className="grid grid-cols-3 gap-1 p-1 bg-[#FAF8F5] rounded-xl border border-[#E5E0D8] text-[10px] font-bold">
                <button
                  onClick={() => setRightInfoTab('MEMBERS')}
                  className={`py-1.5 rounded-lg transition-colors cursor-pointer ${
                    rightInfoTab === 'MEMBERS' ? 'bg-[#1E1B18] text-white shadow-2xs' : 'text-[#64748B]'
                  }`}
                >
                  Members
                </button>
                <button
                  onClick={() => setRightInfoTab('QUESTIONS')}
                  className={`py-1.5 rounded-lg transition-colors cursor-pointer ${
                    rightInfoTab === 'QUESTIONS' ? 'bg-[#1E1B18] text-white shadow-2xs' : 'text-[#64748B]'
                  }`}
                >
                  Questions
                </button>
                <button
                  onClick={() => setRightInfoTab('MEDIA')}
                  className={`py-1.5 rounded-lg transition-colors cursor-pointer ${
                    rightInfoTab === 'MEDIA' ? 'bg-[#1E1B18] text-white shadow-2xs' : 'text-[#64748B]'
                  }`}
                >
                  Recordings
                </button>
              </div>

              {/* Tab 1: Members Roster */}
              {rightInfoTab === 'MEMBERS' && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                    Roster ({activeChat.members.length})
                  </span>
                  <div className="space-y-1.5">
                    {usersList.slice(0, 6).map((u) => (
                      <div
                        key={u.id}
                        onClick={() => onSelectUserProfile?.(u)}
                        className="p-2 rounded-xl hover:bg-[#FAF8F5] flex items-center justify-between text-xs cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={u.avatarUrl || getAvatarUrlByIndex(1)}
                            alt={u.fullName}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <div>
                            <div className="font-medium text-[#1E1B18] truncate max-w-[120px]">
                              {u.fullName}
                            </div>
                            <div className="text-[10px] text-[#64748B]">@{u.username}</div>
                          </div>
                        </div>
                        {u.role === 'ADMIN' ? (
                          <span className="text-[9px] font-mono font-bold text-[#E07A5F]">TUTOR</span>
                        ) : (
                          <span className="text-[9px] font-mono text-[#64748B]">{u.targetScore || 1500}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 2: Questions Shared */}
              {rightInfoTab === 'QUESTIONS' && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                    Dissected Questions
                  </span>
                  <div className="space-y-2">
                    {SAMPLE_SAT_ATTACHMENTS.map((q) => (
                      <div
                        key={q.id}
                        onClick={() => onOpenQuestionInBank?.(q.id)}
                        className="p-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F5F0EB] border border-[#E5E0D8] text-xs cursor-pointer space-y-1"
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono font-bold text-[#E07A5F]">
                          <span>{q.sqbId}</span>
                          <span className="text-[#64748B]">{q.difficulty}</span>
                        </div>
                        <p className="text-[11px] text-[#1E1B18] line-clamp-2">{q.questionText}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Recordings & Media */}
              {rightInfoTab === 'MEDIA' && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                    Stream Recordings
                  </span>
                  <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-2 text-xs">
                    <div className="font-bold text-[#1E1B18]">Trig Identities Proofs</div>
                    <div className="text-[10px] text-[#64748B]">42m 10s • Dr. Alistair Vance</div>
                    <a
                      href="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-[#1E1B18] text-white text-[11px] font-bold flex items-center justify-center gap-1 shadow-2xs"
                    >
                      <Play size={12} />
                      <span>Watch Replay</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 4. MODALS & OVERLAYS */}
      {/* ========================================================================= */}

      {/* A. 1. New Direct Message Modal */}
      {activeFabCreationStep === 'DIRECT' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md p-6 bg-white rounded-3xl border border-[#E5E0D8] shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-[#1E1B18]">New Direct Message</h3>
              <button
                onClick={() => setActiveFabCreationStep(null)}
                className="text-[#64748B] hover:text-[#1E1B18] font-bold"
              >
                ✕
              </button>
            </div>

            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
              <input
                type="text"
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                placeholder="Search registered users by @username..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] text-xs text-[#1E1B18] focus:outline-none focus:border-[#1E1B18]"
              />
            </div>

            <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1 divide-y divide-[#FAF8F5]">
              {usersList
                .filter(
                  (u) =>
                    u.id !== currentUser.id &&
                    (u.username.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                      u.fullName.toLowerCase().includes(userSearchQuery.toLowerCase()))
                )
                .map((u) => (
                  <div
                    key={u.id}
                    onClick={() => handleStartDirectChat(u)}
                    className="p-3 rounded-2xl hover:bg-[#FAF8F5] flex items-center justify-between text-xs cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatarUrl || getAvatarUrlByIndex(1)}
                        alt={u.fullName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-bold text-[#1E1B18]">{u.fullName}</div>
                        <div className="text-[11px] text-[#64748B]">@{u.username}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-[#E07A5F]">
                      Target: {u.targetScore || 1500}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* B. 2. New Group Modal */}
      {activeFabCreationStep === 'GROUP' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md p-6 bg-white rounded-3xl border border-[#E5E0D8] shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-[#1E1B18]">New Study Group</h3>
              <button
                onClick={() => setActiveFabCreationStep(null)}
                className="text-[#64748B] hover:text-[#1E1B18] font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                value={newChatTitle}
                onChange={(e) => setNewChatTitle(e.target.value)}
                placeholder="Group Name (e.g. August 2026 Test Squad)"
                className="w-full p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] text-xs text-[#1E1B18] focus:outline-none focus:border-[#1E1B18]"
              />

              <textarea
                value={newChatDesc}
                onChange={(e) => setNewChatDesc(e.target.value)}
                rows={2}
                placeholder="Group description & study schedule..."
                className="w-full p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] text-xs text-[#1E1B18] focus:outline-none focus:border-[#1E1B18] resize-none"
              />

              <div className="flex items-center gap-4 text-xs font-bold pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    checked={newChatPrivacy === 'PUBLIC'}
                    onChange={() => setNewChatPrivacy('PUBLIC')}
                    className="text-[#1E1B18]"
                  />
                  <span>Public Group</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    checked={newChatPrivacy === 'PRIVATE'}
                    onChange={() => setNewChatPrivacy('PRIVATE')}
                    className="text-[#1E1B18]"
                  />
                  <span>Private Group (with invite link)</span>
                </label>
              </div>

              {/* Member Selector */}
              <div className="space-y-1.5 pt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                  Select Initial Members ({selectedUserIdsForNewChat.size}):
                </span>
                <div className="max-h-32 overflow-y-auto space-y-1 pr-1">
                  {usersList
                    .filter((u) => u.id !== currentUser.id)
                    .map((u) => {
                      const isSelected = selectedUserIdsForNewChat.has(u.id);
                      return (
                        <div
                          key={u.id}
                          onClick={() => {
                            setSelectedUserIdsForNewChat((prev) => {
                              const next = new Set(prev);
                              if (next.has(u.id)) next.delete(u.id);
                              else next.add(u.id);
                              return next;
                            });
                          }}
                          className={`p-2 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-[#1E1B18] text-white border-[#1E1B18]'
                              : 'bg-[#FAF8F5] border-[#E5E0D8] text-[#64748B]'
                          }`}
                        >
                          <span>{u.fullName} (@{u.username})</span>
                          {isSelected && <Check size={14} className="text-white" />}
                        </div>
                      );
                    })}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setActiveFabCreationStep(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#64748B] hover:bg-[#FAF8F5]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateGroupOrChannelSubmit}
                  disabled={!newChatTitle.trim()}
                  className="px-5 py-2 rounded-xl bg-[#1E1B18] hover:bg-[#3D405B] text-white text-xs font-bold disabled:opacity-40 cursor-pointer shadow-2xs"
                >
                  Create Group
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* C. 3. New Channel Modal */}
      {activeFabCreationStep === 'CHANNEL' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md p-6 bg-white rounded-3xl border border-[#E5E0D8] shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-[#1E1B18]">New Broadcast Channel</h3>
              <button
                onClick={() => setActiveFabCreationStep(null)}
                className="text-[#64748B] hover:text-[#1E1B18] font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                value={newChatTitle}
                onChange={(e) => setNewChatTitle(e.target.value)}
                placeholder="Channel Name (e.g. Daily Math 800 Masterclass)"
                className="w-full p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] text-xs text-[#1E1B18] focus:outline-none focus:border-[#1E1B18]"
              />

              <textarea
                value={newChatDesc}
                onChange={(e) => setNewChatDesc(e.target.value)}
                rows={3}
                placeholder="Channel description, live schedule, and target goals..."
                className="w-full p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] text-xs text-[#1E1B18] focus:outline-none focus:border-[#1E1B18] resize-none"
              />

              <div className="flex items-center gap-4 text-xs font-bold pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    checked={newChatPrivacy === 'PUBLIC'}
                    onChange={() => setNewChatPrivacy('PUBLIC')}
                    className="text-[#1E1B18]"
                  />
                  <span>Public Channel (Broadcast)</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    checked={newChatPrivacy === 'PRIVATE'}
                    onChange={() => setNewChatPrivacy('PRIVATE')}
                    className="text-[#1E1B18]"
                  />
                  <span>Private Channel (Invite only)</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setActiveFabCreationStep(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#64748B] hover:bg-[#FAF8F5]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateGroupOrChannelSubmit}
                  disabled={!newChatTitle.trim()}
                  className="px-5 py-2 rounded-xl bg-[#1E1B18] hover:bg-[#3D405B] text-white text-xs font-bold disabled:opacity-40 cursor-pointer shadow-2xs"
                >
                  Create Channel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* D. Question Picker Attachment Modal */}
      {isQuestionPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg p-6 bg-white rounded-3xl border border-[#E5E0D8] shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-[#1E1B18] flex items-center gap-2">
                <Paperclip size={16} className="text-[#E07A5F]" />
                <span>Attach Question from SAT Question Bank</span>
              </h3>
              <button
                onClick={() => setIsQuestionPickerOpen(false)}
                className="text-[#64748B] hover:text-[#1E1B18] font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {SAMPLE_SAT_ATTACHMENTS.map((q) => (
                <div
                  key={q.id}
                  onClick={() => {
                    handleSendMessage('Check out this challenging problem from today\'s practice:', {
                      attachedQuestionId: q.id,
                      attachedQuestion: q,
                    });
                    setIsQuestionPickerOpen(false);
                  }}
                  className="p-4 rounded-2xl bg-[#FAF8F5] hover:bg-[#F5F0EB] border border-[#E5E0D8] text-xs space-y-2 cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-mono font-bold text-[#E07A5F]">{q.sqbId}</span>
                    <span className="font-bold text-[#3D405B]">{q.skill}</span>
                  </div>
                  <p className="line-clamp-2 text-[#1E1B18] font-medium">{q.questionText}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* E. Live Stream Teaching Studio Overlay */}
      {isLiveStudioActive && (
        <LiveStreamStudio
          user={currentUser}
          activeChat={activeChat}
          onClose={() => setIsLiveStudioActive(false)}
          onLessonRecordedAndSaved={handleLessonRecorded}
        />
      )}
    </div>
  );
};
