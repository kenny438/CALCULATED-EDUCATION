import React, { useState, useEffect } from "react";
import { Group } from "../data/mockData";
import { Users, Plus, Search, Copy, Check, Shield, UserPlus, MessageSquare, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useToast } from "./ui/Toast";
import { useAuth } from "../contexts/AuthContext";

export function Groups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupDesc, setGroupDesc] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { addToast } = useToast();
  const { session } = useAuth();

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await fetch('/api/groups').catch(() => ({ ok: false, status: 404, json: async () => [] }));
      let serverGroups: Group[] = [];
      if (res.ok) {
        serverGroups = await res.json();
      }
      
      const localGroupsStr = localStorage.getItem('local_groups');
      if (localGroupsStr) {
        try {
          const localGroups = JSON.parse(localGroupsStr);
          const localIds = new Set(localGroups.map((g: any) => g.id));
          serverGroups = [...localGroups, ...serverGroups.filter((g: any) => !localIds.has(g.id))];
        } catch (e) {
          console.error("Failed to parse local groups", e);
        }
      }
      setGroups(serverGroups);
    } catch (err) {
      console.error("Failed to fetch groups", err);
      const localGroups = localStorage.getItem('local_groups');
      if (localGroups) {
        setGroups(JSON.parse(localGroups));
      }
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(code);
    addToast("Invite code copied!", "success");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      addToast("Please sign in to create a group", "error");
      return;
    }

    try {
      const res = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: groupName,
          description: groupDesc,
          creatorId: session.user.id
        })
      }).catch(() => ({ ok: false, status: 404 }));

      if (res.ok || res.status === 404) {
        addToast(res.status === 404 ? "Study group created! (Local Mode)" : "Study group created!", "success");
        setShowCreateModal(false);
        setGroupName("");
        setGroupDesc("");
        
        if (res.status === 404) {
          const newGroup = {
            id: "g_" + Math.random().toString(36).substr(2, 9),
            name: groupName,
            description: groupDesc,
            inviteCode: Math.random().toString(36).substr(2, 6).toUpperCase(),
            createdAt: new Date().toISOString(),
            isPrivate: true,
            members: [{ userId: session.user.id, username: session.user.email?.split('@')[0] || "User", avatarSeed: session.user.id, role: 'admin' as const, joinedAt: new Date().toISOString(), xpContributed: 0 }]
          };
          setGroups(prev => {
            const updated = [...prev, newGroup];
            localStorage.setItem('local_groups', JSON.stringify(updated));
            return updated;
          });
        } else {
          fetchGroups();
        }
      } else {
        addToast("Failed to create group", "error");
      }
    } catch (err) {
      console.error("Failed to create group", err);
      addToast("Study group created! (Offline Mode)", "success");
      setShowCreateModal(false);
      setGroupName("");
      setGroupDesc("");
      
      const newGroup = {
        id: "g_" + Math.random().toString(36).substr(2, 9),
        name: groupName,
        description: groupDesc,
        inviteCode: Math.random().toString(36).substr(2, 6).toUpperCase(),
        createdAt: new Date().toISOString(),
        isPrivate: true,
        members: [{ userId: session.user.id, username: session.user.email?.split('@')[0] || "User", avatarSeed: session.user.id, role: 'admin' as const, joinedAt: new Date().toISOString(), xpContributed: 0 }]
      };
      setGroups(prev => {
        const updated = [...prev, newGroup];
        localStorage.setItem('local_groups', JSON.stringify(updated));
        return updated;
      });
    }
  };

  const handleJoinGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      addToast("Please sign in to join a group", "error");
      return;
    }

    try {
      const res = await fetch(`/api/groups/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inviteCode,
          userId: session.user.id
        })
      }).catch(() => ({ ok: false, status: 404 }));

      if (res.ok || res.status === 404) {
        addToast(res.status === 404 ? "Joined study group! (Local Mode)" : "Joined study group!", "success");
        setShowJoinModal(false);
        setInviteCode("");
        
        if (res.status === 404) {
          setGroups(prev => {
            const updated = prev.map(g => {
              if (g.inviteCode === inviteCode) {
                return {
                  ...g,
                  members: [...g.members, { userId: session.user.id, username: session.user.email?.split('@')[0] || "User", avatarSeed: session.user.id, role: 'member' as const, joinedAt: new Date().toISOString(), xpContributed: 0 }]
                };
              }
              return g;
            });
            localStorage.setItem('local_groups', JSON.stringify(updated));
            return updated;
          });
        } else {
          fetchGroups();
        }
      } else {
        addToast("Invalid invite code or already joined", "error");
      }
    } catch (err) {
      console.error("Failed to join group", err);
      addToast("Joined study group! (Offline Mode)", "success");
      setShowJoinModal(false);
      setInviteCode("");
      
      setGroups(prev => {
        const updated = prev.map(g => {
          if (g.inviteCode === inviteCode) {
            return {
              ...g,
              members: [...g.members, { userId: session.user.id, username: session.user.email?.split('@')[0] || "User", avatarSeed: session.user.id, role: 'member' as const, joinedAt: new Date().toISOString(), xpContributed: 0 }]
            };
          }
          return g;
        });
        localStorage.setItem('local_groups', JSON.stringify(updated));
        return updated;
      });
    }
  };

  const selectedGroup = groups.find(g => g.id === selectedGroupId);

  if (selectedGroup) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <button 
          onClick={() => setSelectedGroupId(null)}
          className="flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          Back to Groups
        </button>

        <div className="card-fun bg-slate-900 p-8 md:p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 blur-[100px] rounded-full -mr-32 -mt-32 animate-blob" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 blur-[100px] rounded-full -ml-32 -mb-32 animate-blob animation-delay-2000" />
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">{selectedGroup.name}</h2>
              <p className="text-slate-300 max-w-2xl mb-6 text-lg">{selectedGroup.description}</p>
              <div className="flex flex-wrap items-center gap-4">
                <span className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-bold border border-emerald-500/30 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  {selectedGroup.members?.length || 0} Members
                </span>
                <button 
                  onClick={() => handleCopyCode(selectedGroup.inviteCode)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-bold transition-colors flex items-center gap-2 border border-white/20"
                >
                  Code: {selectedGroup.inviteCode}
                  {copiedId === selectedGroup.inviteCode ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            <div className="flex gap-4 w-full md:w-auto">
               <button 
                 onClick={() => handleCopyCode(selectedGroup.inviteCode)}
                 className="btn-fun-emerald flex-1 md:flex-none px-8 py-4 text-lg"
               >
                  Invite Friends
               </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="card-fun bg-white p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-full text-emerald-600">
                  <MessageSquare className="w-6 h-6" />
                </div>
                Discussion Board
              </h3>
              <div className="text-center py-16 text-slate-500 bg-slate-50 rounded-3xl border border-slate-200 border-dashed">
                <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-lg font-bold">Discussion board coming soon!</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card-fun bg-white p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-full text-indigo-600">
                  <Users className="w-6 h-6" />
                </div>
                Members
              </h3>
              <div className="space-y-4">
                {selectedGroup.members?.map((member, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                    <img 
                      src={"https://api.dicebear.com/7.x/avataaars/svg?seed=" + member.userId}
                      alt="Avatar" 
                      className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200"
                    />
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-2 text-lg">
                        User {member.userId.substring(0, 4)}
                        {member.role === 'admin' && (
                          <Shield className="w-4 h-4 text-emerald-500" />
                        )}
                      </div>
                      <div className="text-sm font-bold text-slate-500 capitalize">{member.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-2">Study Groups</h1>
          <p className="text-slate-500 text-lg">Learn together, stay motivated, and achieve your goals.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button 
            onClick={() => setShowJoinModal(true)}
            className="btn-fun bg-white text-slate-700 flex-1 md:flex-none px-6 py-3 flex items-center justify-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            Join Group
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn-fun-indigo flex-1 md:flex-none px-6 py-3 flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Group
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <motion.div
            key={group.id}
            whileHover={{ y: -4 }}
            onClick={() => setSelectedGroupId(group.id)}
            className="card-fun bg-white p-6 cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform border border-indigo-100">
                <Users className="w-7 h-7" />
              </div>
              <span className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full text-sm font-bold flex items-center gap-1.5 border border-slate-200">
                <Users className="w-4 h-4" />
                {group.members?.length || 0}
              </span>
            </div>
            
            <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">{group.name}</h3>
            <p className="text-slate-500 text-base line-clamp-2 mb-6 font-medium">{group.description}</p>
            
            <div className="pt-4 border-t-4 border-slate-100 flex items-center justify-between">
              <div className="flex -space-x-3">
                {group.members?.slice(0, 3).map((member, i) => (
                  <img 
                    key={i}
                    src={"https://api.dicebear.com/7.x/avataaars/svg?seed=" + member.userId}
                    alt="Member" 
                    className="w-10 h-10 rounded-full border border-white bg-slate-100"
                  />
                ))}
                {(group.members?.length || 0) > 3 && (
                  <div className="w-10 h-10 rounded-full border border-white bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                    +{(group.members?.length || 0) - 3}
                  </div>
                )}
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                <ChevronRight className="w-6 h-6 text-slate-400 group-hover:text-indigo-500 transition-colors" />
              </div>
            </div>
          </motion.div>
        ))}

        {groups.length === 0 && (
          <div className="col-span-full text-center py-20 card-fun bg-slate-50 border border-dashed border-slate-200">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
              <Users className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">No Study Groups Yet</h3>
            <p className="text-slate-500 mb-8 text-lg font-medium">Create a group or join one to start learning together.</p>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="btn-fun-emerald px-8 py-4 text-lg"
            >
              Create Your First Group
            </button>
          </div>
        )}
      </div>

      {/* Create Group Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="card-fun bg-white w-full max-w-md overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100">
                <h2 className="text-3xl font-bold text-slate-900">Create Study Group</h2>
              </div>
              <form onSubmit={handleCreateGroup} className="p-8 space-y-6">
                <div>
                  <label className="block text-base font-bold text-slate-700 mb-3">Group Name</label>
                  <input
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:border-indigo-400 transition-colors bg-slate-50 text-lg font-bold"
                    placeholder="e.g., React Masters"
                    required
                  />
                </div>
                <div>
                  <label className="block text-base font-bold text-slate-700 mb-3">Description</label>
                  <textarea
                    value={groupDesc}
                    onChange={(e) => setGroupDesc(e.target.value)}
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:border-indigo-400 transition-colors bg-slate-50 min-h-[120px] text-lg font-medium"
                    placeholder="What's this group about?"
                    required
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="btn-fun bg-slate-100 text-slate-600 flex-1 py-4 text-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-fun-indigo flex-1 py-4 text-lg"
                  >
                    Create Group
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Join Group Modal */}
        {showJoinModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="card-fun bg-white w-full max-w-md overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100">
                <h2 className="text-3xl font-bold text-slate-900">Join Study Group</h2>
              </div>
              <form onSubmit={handleJoinGroup} className="p-8 space-y-6">
                <div>
                  <label className="block text-base font-bold text-slate-700 mb-3">Invite Code</label>
                  <input
                    type="text"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:border-emerald-400 transition-colors bg-slate-50 font-mono text-center text-2xl tracking-widest uppercase font-bold"
                    placeholder="ENTER CODE"
                    required
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowJoinModal(false)}
                    className="btn-fun bg-slate-100 text-slate-600 flex-1 py-4 text-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-fun-emerald flex-1 py-4 text-lg"
                  >
                    Join Group
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
