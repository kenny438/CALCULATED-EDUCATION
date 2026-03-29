import React from "react";
import { X, Command, Search, Trophy, LineChart, Activity, Briefcase, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";

interface ShortcutsHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShortcutsHelp({ isOpen, onClose }: ShortcutsHelpProps) {
  const shortcuts = [
    { key: "/", label: "Search", icon: <Search className="w-5 h-5" /> },
    { key: "C", label: "Courses", icon: <LineChart className="w-5 h-5" /> },
    { key: "L", label: "My Learning", icon: <Briefcase className="w-5 h-5" /> },
    { key: "G", label: "Groups", icon: <Activity className="w-5 h-5" /> },
    { key: "N", label: "New Course", icon: <Trophy className="w-5 h-5" /> },
    { key: "Esc", label: "Close Modal", icon: <XCircle className="w-5 h-5" /> },
    { key: "?", label: "Show Shortcuts", icon: <Command className="w-5 h-5" /> },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative card-fun bg-white w-full max-w-lg overflow-hidden"
          >
            <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between bg-indigo-50/50">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center border border-indigo-200 shadow-sm transform -rotate-6">
                  <Command className="w-8 h-8 text-indigo-500" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-2xl leading-none mb-1">Keyboard Shortcuts</h3>
                  <p className="text-sm text-indigo-500 font-bold uppercase tracking-widest">Power up your workflow</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-3 hover:bg-slate-200 rounded-2xl transition-colors active:scale-95"
              >
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>

            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {shortcuts.map((shortcut) => (
                  <div 
                    key={shortcut.key}
                    className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all group border border-transparent hover:border-slate-200 hover:shadow-md shadow-slate-200/30 hover:-translate-y-1"
                  >
                    <div className="flex items-center gap-4 text-slate-600 group-hover:text-slate-900 font-bold text-lg">
                      <div className="p-2.5 bg-slate-100 rounded-xl group-hover:bg-white group-hover:shadow-sm transition-all border border-transparent group-hover:border-slate-200">
                        {shortcut.icon}
                      </div>
                      {shortcut.label}
                    </div>
                    <kbd className="px-4 py-2 bg-white border border-slate-200 border-b rounded-xl text-sm font-bold text-indigo-600 min-w-[3rem] text-center font-mono group-hover:border-indigo-200 group-hover:bg-indigo-50 transition-all">
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-slate-50 text-center border-t-4 border-slate-100">
              <p className="text-sm text-slate-500 font-bold">
                Press <kbd className="px-2 py-1 bg-white border border-slate-200 border-b rounded-lg text-xs font-bold mx-1 text-indigo-600">?</kbd> to toggle this menu anytime
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
