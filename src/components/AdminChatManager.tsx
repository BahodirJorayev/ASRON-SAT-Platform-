import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Shield,
  Trash2,
  Archive,
  VolumeX,
  Volume2,
  HardDrive,
  Video,
  Download,
  Users,
  Search,
  CheckCircle2,
  AlertTriangle,
  Play,
  Filter,
  Eye,
  Radio,
  Lock,
  Unlock,
  RefreshCw,
  Plus
} from 'lucide-react';
import { Chat, User, Message } from '../types';
import { INITIAL_USERS } from '../data/mockDatabase';
import { getAvatarUrlByIndex } from '../data/creativeAvatars';

interface Props {
  currentUser: User;
}

interface StoredRecording {
  id: string;
  title: string;
  channelName: string;
  hostName: string;
  sizeMB: number;
  duration: string;
  recordedAt: string;
  videoUrl: string;
  status: 'ACTIVE' | 'ARCHIVED';
}

export const AdminChatManager: React.FC<Props> = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState<'DIRECTORY' | 'MODERATION' | 'STORAGE'>('DIRECTORY');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sample Admin Directory Data
  const [chats, setChats] = useState<Chat[]>([
    {
      id: 'chat-sat-masterclass-live',
      name: 'Ivy League 1550+ Live Teaching Studio',
      type: 'PUBLIC_CHANNEL',
      description: 'Official daily live stream masterclass with top instructors.',
      avatarUrl: getAvatarUrlByIndex(0),
      members: ['usr-student-01', 'usr-admin-01', 'usr-02', 'usr-04', 'usr-05', 'usr-06'],
      createdById: 'usr-admin-01',
      isLiveActive: true,
      createdAt: '2026-08-02T00:00:00Z',
    },
    {
      id: 'chat-math-800-elite',
      name: '📐 SAT Math 800 & Desmos Hacks',
      type: 'PUBLIC_GROUP',
      description: 'Peer study group for 800 Math hunters.',
      avatarUrl: getAvatarUrlByIndex(5),
      members: ['usr-student-01', 'usr-admin-01', 'usr-05'],
      createdById: 'usr-admin-01',
      createdAt: '2026-08-05T00:00:00Z',
    },
    {
      id: 'chat-rw-squad',
      name: '📖 Reading & Writing 750+ Squad',
      type: 'PUBLIC_GROUP',
      description: 'Transitions, rhetorical synthesis, boundaries discussion.',
      avatarUrl: getAvatarUrlByIndex(6),
      members: ['usr-student-01', 'usr-02', 'usr-06'],
      createdById: 'usr-02',
      createdAt: '2026-08-10T00:00:00Z',
    },
    {
      id: 'chat-vip-leaks',
      name: '🔒 VIP Hardest Question Drills (800 Target)',
      type: 'PRIVATE_CHANNEL',
      description: 'Leaked hard adaptive Module 2 traps and weekly video masterclass replays.',
      avatarUrl: getAvatarUrlByIndex(2),
      inviteCode: 'VIP-1550',
      members: ['usr-student-01', 'usr-admin-01'],
      createdById: 'usr-admin-01',
      createdAt: '2026-08-15T00:00:00Z',
    },
  ]);

  // Sample Stored Video Recordings
  const [recordings, setRecordings] = useState<StoredRecording[]>([
    {
      id: 'rec-01',
      title: 'Trig Identities & Circle Equation Proofs ($x^2+y^2=r^2$)',
      channelName: 'Ivy League 1550+ Live Teaching Studio',
      hostName: 'Dr. Alistair Vance',
      sizeMB: 342.5,
      duration: '42m 10s',
      recordedAt: '2026-08-30 19:45',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      status: 'ACTIVE',
    },
    {
      id: 'rec-02',
      title: 'Desmos Regression & Nonlinear Quadratic Systems',
      channelName: '📐 SAT Math 800 & Desmos Hacks',
      hostName: 'Davron B. (Math Specialist)',
      sizeMB: 280.1,
      duration: '35m 18s',
      recordedAt: '2026-08-29 18:00',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      status: 'ACTIVE',
    },
    {
      id: 'rec-03',
      title: 'Rhetorical Synthesis & Bullet-Point Strategy',
      channelName: '📖 Reading & Writing 750+ Squad',
      hostName: 'Elena Rostova',
      sizeMB: 195.8,
      duration: '26m 40s',
      recordedAt: '2026-08-27 15:30',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      status: 'ARCHIVED',
    },
  ]);

  // Moderated users
  const [bannedUsers, setBannedUsers] = useState<Set<string>>(new Set());
  const [mutedUsers, setMutedUsers] = useState<Set<string>>(new Set());
  const [selectedPreviewVideo, setSelectedPreviewVideo] = useState<StoredRecording | null>(null);

  // Storage calculations
  const totalStorageGB = (
    recordings.reduce((acc, r) => acc + r.sizeMB, 0) / 1024
  ).toFixed(2);

  const handleArchiveChat = (id: string) => {
    setChats((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isArchived: !c.isArchived } : c))
    );
  };

  const handleDeleteChat = (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this chat/channel?')) {
      setChats((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleToggleMuteUser = (userId: string) => {
    setMutedUsers((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  };

  const handleToggleBanUser = (userId: string) => {
    setBannedUsers((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  };

  const handleDeleteRecording = (id: string) => {
    if (window.confirm('Delete this video recording to reclaim cloud storage?')) {
      setRecordings((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const handleToggleArchiveRecording = (id: string) => {
    setRecordings((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: r.status === 'ACTIVE' ? 'ARCHIVED' : 'ACTIVE' }
          : r
      )
    );
  };

  return (
    <div className="space-y-8 text-[#1E1B18] font-sans">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white border border-[#E5E0D8] shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-[#FFF4F0] border border-[#FCD9CE] text-[#E07A5F]">
              Admin Infrastructure
            </span>
            <span className="text-xs text-[#64748B]">Real-Time Communications & Cloud Storage CMS</span>
          </div>
          <h2 className="text-2xl font-black text-[#1E1B18]">Community & Broadcast Studio Control</h2>
          <p className="text-xs text-[#64748B] max-w-2xl">
            Monitor public & private cohorts, moderate user permissions, and manage cloud video recordings from live teaching sessions.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-[#FAF8F5] rounded-2xl border border-[#E5E0D8]">
          <button
            onClick={() => setActiveTab('DIRECTORY')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'DIRECTORY'
                ? 'bg-[#1E1B18] text-white shadow-2xs'
                : 'text-[#64748B] hover:text-[#1E1B18]'
            }`}
          >
            <MessageSquare size={14} />
            <span>Chat Directory ({chats.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('MODERATION')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'MODERATION'
                ? 'bg-[#1E1B18] text-white shadow-2xs'
                : 'text-[#64748B] hover:text-[#1E1B18]'
            }`}
          >
            <Shield size={14} />
            <span>User Moderation</span>
          </button>

          <button
            onClick={() => setActiveTab('STORAGE')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'STORAGE'
                ? 'bg-[#1E1B18] text-white shadow-2xs'
                : 'text-[#64748B] hover:text-[#1E1B18]'
            }`}
          >
            <HardDrive size={14} />
            <span>Cloud Recordings ({totalStorageGB} GB)</span>
          </button>
        </div>
      </div>

      {/* 1. DIRECTORY VIEW */}
      {activeTab === 'DIRECTORY' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-[#1E1B18]">
              All Active Channels & Study Groups
            </h3>
            <div className="relative w-72">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by title or code..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#E5E0D8] text-xs text-[#1E1B18] focus:outline-none focus:ring-1 focus:ring-[#E07A5F]"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-3xl bg-white border border-[#E5E0D8] shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#E5E0D8] text-[#64748B] font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-4">Channel / Group</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Members</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Invite Code</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E0D8]">
                {chats.map((c) => (
                  <tr key={c.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={c.avatarUrl || getAvatarUrlByIndex(0)}
                        alt={c.name}
                        className="w-9 h-9 rounded-xl object-cover border border-[#E5E0D8]"
                      />
                      <div>
                        <div className="font-bold text-[#1E1B18]">{c.name}</div>
                        <div className="text-[11px] text-[#64748B] line-clamp-1">{c.description}</div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-[#FAF8F5] border border-[#E5E0D8] text-[#3D405B]">
                        {c.type.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="p-4 font-mono font-bold text-[#1E1B18]">
                      {c.members.length} users
                    </td>

                    <td className="p-4">
                      {c.isLiveActive ? (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                          Live Broadcast
                        </span>
                      ) : c.isArchived ? (
                        <span className="text-[10px] font-bold text-[#64748B] bg-slate-100 px-2 py-0.5 rounded-full">
                          Archived
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-[#2A9D8F] bg-[#EBF8F5] px-2 py-0.5 rounded-full">
                          Active
                        </span>
                      )}
                    </td>

                    <td className="p-4 font-mono text-[#E07A5F] font-bold">
                      {c.inviteCode || 'Public'}
                    </td>

                    <td className="p-4 text-right space-x-1">
                      <button
                        onClick={() => handleArchiveChat(c.id)}
                        className="p-2 rounded-xl text-[#64748B] hover:text-[#1E1B18] hover:bg-[#FAF8F5] cursor-pointer"
                        title={c.isArchived ? 'Unarchive' : 'Archive'}
                      >
                        <Archive size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteChat(c.id)}
                        className="p-2 rounded-xl text-[#64748B] hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                        title="Delete Channel"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. MODERATION VIEW */}
      {activeTab === 'MODERATION' && (
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-[#1E1B18]">
            User Safety, Muting & Ban Governance
          </h3>

          <div className="overflow-x-auto rounded-3xl bg-white border border-[#E5E0D8] shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#E5E0D8] text-[#64748B] font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-4">User</th>
                  <th className="p-4">Role / Plan</th>
                  <th className="p-4">Target Score</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E0D8]">
                {INITIAL_USERS.map((u) => {
                  const isMuted = mutedUsers.has(u.id);
                  const isBanned = bannedUsers.has(u.id);

                  return (
                    <tr key={u.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={u.avatarUrl || getAvatarUrlByIndex(1)}
                          alt={u.fullName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-bold text-[#1E1B18]">{u.fullName}</div>
                          <div className="text-[11px] text-[#64748B]">@{u.username} • {u.email}</div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-[#FAF8F5] border border-[#E5E0D8] text-[#3D405B]">
                          {u.planTier} ({u.role})
                        </span>
                      </td>

                      <td className="p-4 font-mono font-bold text-[#1E1B18]">
                        {u.targetScore}
                      </td>

                      <td className="p-4">
                        {isBanned ? (
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                            Banned
                          </span>
                        ) : isMuted ? (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                            Muted
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-[#2A9D8F] bg-[#EBF8F5] px-2 py-0.5 rounded-full">
                            Active
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handleToggleMuteUser(u.id)}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs cursor-pointer transition-all ${
                            isMuted
                              ? 'bg-[#2A9D8F] text-white'
                              : 'bg-[#FAF8F5] text-[#64748B] hover:text-[#1E1B18]'
                          }`}
                        >
                          {isMuted ? 'Unmute' : 'Mute in Chat'}
                        </button>

                        <button
                          onClick={() => handleToggleBanUser(u.id)}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs cursor-pointer transition-all ${
                            isBanned
                              ? 'bg-[#1E1B18] text-white'
                              : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                          }`}
                        >
                          {isBanned ? 'Lift Ban' : 'Ban User'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. CLOUD STORAGE VIEW */}
      {activeTab === 'STORAGE' && (
        <div className="space-y-6">
          {/* Storage Meter Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-[#E5E0D8] shadow-2xs space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#64748B]">
                Consumed Storage
              </span>
              <div className="text-3xl font-black text-[#1E1B18]">{totalStorageGB} GB</div>
              <p className="text-xs text-[#64748B]">3 active masterclass video recordings</p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#E5E0D8] shadow-2xs space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#64748B]">
                Allocated Cloud Capacity
              </span>
              <div className="text-3xl font-black text-[#2A9D8F]">100 GB</div>
              <p className="text-xs text-[#2A9D8F]">Supabase Storage S3 Bucket (Healthy)</p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#E5E0D8] shadow-2xs space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#64748B]">
                Bandwidth Savings
              </span>
              <div className="text-3xl font-black text-[#E07A5F]">94.2%</div>
              <p className="text-xs text-[#64748B]">H.264 streaming optimization</p>
            </div>
          </div>

          {/* Recordings List */}
          <div className="overflow-x-auto rounded-3xl bg-white border border-[#E5E0D8] shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#E5E0D8] text-[#64748B] font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-4">Lesson Topic</th>
                  <th className="p-4">Instructor</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">File Size</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E0D8]">
                {recordings.map((rec) => (
                  <tr key={rec.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] flex items-center justify-center text-[#E07A5F]">
                        <Video size={16} />
                      </div>
                      <div>
                        <div className="font-bold text-[#1E1B18]">{rec.title}</div>
                        <div className="text-[11px] text-[#64748B]">{rec.channelName} • {rec.recordedAt}</div>
                      </div>
                    </td>

                    <td className="p-4 font-medium text-[#1E1B18]">
                      {rec.hostName}
                    </td>

                    <td className="p-4 font-mono font-bold text-[#3D405B]">
                      {rec.duration}
                    </td>

                    <td className="p-4 font-mono font-bold text-[#1E1B18]">
                      {rec.sizeMB} MB
                    </td>

                    <td className="p-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          rec.status === 'ACTIVE'
                            ? 'bg-[#EBF8F5] text-[#2A9D8F]'
                            : 'bg-slate-100 text-[#64748B]'
                        }`}
                      >
                        {rec.status}
                      </span>
                    </td>

                    <td className="p-4 text-right space-x-1">
                      <button
                        onClick={() => setSelectedPreviewVideo(rec)}
                        className="p-2 rounded-xl text-[#2A9D8F] hover:bg-[#EBF8F5] cursor-pointer"
                        title="Preview Recording"
                      >
                        <Play size={14} />
                      </button>
                      <button
                        onClick={() => handleToggleArchiveRecording(rec.id)}
                        className="p-2 rounded-xl text-[#64748B] hover:text-[#1E1B18] hover:bg-[#FAF8F5] cursor-pointer"
                        title="Archive"
                      >
                        <Archive size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteRecording(rec.id)}
                        className="p-2 rounded-xl text-[#64748B] hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                        title="Delete Recording"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Video Preview Modal */}
      {selectedPreviewVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl border border-[#E5E0D8] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#1E1B18] truncate max-w-lg">
                {selectedPreviewVideo.title}
              </h3>
              <button
                onClick={() => setSelectedPreviewVideo(null)}
                className="text-[#64748B] hover:text-[#1E1B18] font-bold"
              >
                ✕
              </button>
            </div>

            <video
              src={selectedPreviewVideo.videoUrl}
              controls
              autoPlay
              className="w-full rounded-2xl max-h-96 bg-black"
            />

            <div className="flex items-center justify-between text-xs text-[#64748B] pt-2">
              <span>Duration: {selectedPreviewVideo.duration} • Size: {selectedPreviewVideo.sizeMB} MB</span>
              <a
                href={selectedPreviewVideo.videoUrl}
                download
                className="px-4 py-2 rounded-xl bg-[#1E1B18] text-white font-bold flex items-center gap-1.5 shadow-2xs"
              >
                <Download size={13} />
                <span>Download Video</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
