import React, { useState } from "react";
import { Comment } from "../data/mockData";
import { Send, ThumbsUp } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../contexts/AuthContext";

interface CommentSectionProps {
  comments: Comment[];
  courseId: string;
}

export function CommentSection({ comments: initialComments, courseId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const { session } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !session?.user) return;
    
    const comment: Comment = {
      id: "com_" + Math.random().toString(36).substr(2, 9),
      userId: session.user.id,
      username: session.user.email?.split('@')[0] || "User",
      avatarSeed: session.user.id,
      text: newComment,
      timestamp: new Date().toISOString(),
      likes: 0
    };

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...comment, courseId })
      }).catch(() => ({ ok: false, status: 404 }));

      if (res.ok || res.status === 404) {
        setComments([comment, ...comments]);
        setNewComment("");
      }
    } catch (err) {
      console.error("Failed to post comment", err);
      // Fallback
      setComments([comment, ...comments]);
      setNewComment("");
    }
  };

  const handleLike = async (commentId: string) => {
    try {
      const res = await fetch(`/api/comments/${commentId}/like`, { method: 'POST' }).catch(() => ({ ok: false, status: 404 }));
      if (res.ok || res.status === 404) {
        setComments(comments.map(c => c.id === commentId ? { ...c, likes: c.likes + 1 } : c));
      }
    } catch (err) {
      console.error("Failed to like comment", err);
      // Fallback
      setComments(comments.map(c => c.id === commentId ? { ...c, likes: c.likes + 1 } : c));
    }
  };

  return (
    <div className="card-fun bg-white p-8 space-y-8">
      <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
        Discussion <span className="text-indigo-400 text-lg bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">{comments.length}</span>
      </h3>

      {/* Input Area */}
      {session?.user ? (
        <form onSubmit={handleSubmit} className="flex gap-4 items-start">
          <img 
            src={"https://api.dicebear.com/7.x/avataaars/svg?seed=" + session.user.id}
            alt="Your Avatar" 
            className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 shadow-sm"
          />
          <div className="flex-1 relative">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Ask a question or share your thoughts..."
              className="w-full pl-5 pr-14 py-4 bg-slate-50 border border-slate-100 rounded-full focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all outline-none font-medium text-slate-700 placeholder-slate-400"
            />
            <motion.button 
              whileHover={{ scale: 1.1, x: 2, y: "-50%" }}
              whileTap={{ scale: 0.9, y: "-50%" }}
              type="submit"
              disabled={!newComment.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm border-b border-indigo-700 disabled:border-b-0 group/send"
            >
              <Send className="w-5 h-5 group-hover/send:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </form>
      ) : (
        <div className="p-6 bg-amber-50 rounded-full text-center text-amber-700 font-bold border border-amber-100 border-dashed">
          Please sign in to join the discussion.
        </div>
      )}

      {/* Comment List */}
      <div className="space-y-6 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
        {comments.length === 0 ? (
          <div className="text-center py-12 text-slate-400 font-bold bg-slate-50 rounded-full border border-slate-100 border-dashed">
            No comments yet. Be the first to start the conversation!
          </div>
        ) : (
          comments.map((comment) => (
            <motion.div 
              key={comment.id} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4 group bg-slate-50 p-4 rounded-full border border-slate-100 hover:border-indigo-200 transition-colors"
            >
              <img 
                src={"https://api.dicebear.com/7.x/avataaars/svg?seed=" + comment.avatarSeed}
                alt={comment.username} 
                className="w-12 h-12 rounded-full bg-white border border-white shadow-sm flex-shrink-0 transform group-hover:rotate-6 transition-transform"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-bold text-slate-900 text-base">{comment.username}</span>
                  <span className="text-xs font-bold text-slate-400 bg-white px-2 py-1 rounded-lg border border-slate-100">
                    {new Date(comment.timestamp).toLocaleDateString()}
                  </span>
                </div>
                
                <p className="text-slate-700 text-sm whitespace-pre-wrap break-words font-medium leading-relaxed">
                  {comment.text}
                </p>

                <div className="flex items-center gap-4 mt-3">
                  <motion.button 
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleLike(comment.id)}
                    className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-rose-500 transition-colors bg-white px-3 py-1.5 rounded-full border border-slate-100 hover:border-rose-200 hover:bg-rose-50 group/like"
                  >
                    <ThumbsUp className="w-4 h-4 group-hover/like:-rotate-12 transition-transform" />
                    <span>{comment.likes}</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
