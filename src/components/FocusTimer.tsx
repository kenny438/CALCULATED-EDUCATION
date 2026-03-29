import React, { useState, useEffect } from 'react';
import { Timer, Play, Pause, RotateCcw, Coffee } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export function FocusTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (!isBreak) {
        setIsBreak(true);
        setTimeLeft(5 * 60);
      } else {
        setIsBreak(false);
        setTimeLeft(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, isBreak]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(isBreak ? 5 * 60 : 25 * 60);
  };

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <div className="relative">
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-2xl border-2 font-bold transition-all shadow-sm",
          isActive ? "bg-rose-50 border-rose-200 text-rose-600" : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
        )}
      >
        <motion.div
          animate={isActive ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Timer className="w-5 h-5" />
        </motion.div>
        <span className="hidden sm:inline">{String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", bounce: 0.4, duration: 0.5 }}
            className="absolute top-full right-0 mt-2 w-64 bg-white rounded-3xl border-2 border-slate-200 shadow-xl p-4 z-50"
          >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-slate-800 flex items-center gap-2">
              {isBreak ? <Coffee className="w-5 h-5 text-emerald-500" /> : <Timer className="w-5 h-5 text-indigo-500" />}
              {isBreak ? "Break Time" : "Focus Mode"}
            </h3>
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
              <button 
                onClick={() => { setIsBreak(false); setTimeLeft(25 * 60); setIsActive(false); }}
                className={cn("px-2 py-1 text-xs font-bold rounded-lg", !isBreak ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500")}
              >
                25m
              </button>
              <button 
                onClick={() => { setIsBreak(true); setTimeLeft(5 * 60); setIsActive(false); }}
                className={cn("px-2 py-1 text-xs font-bold rounded-lg", isBreak ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500")}
              >
                5m
              </button>
            </div>
          </div>
          
          <div className="text-5xl font-black text-center text-slate-800 mb-6 font-mono tracking-tighter">
            {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
          </div>

          <div className="flex gap-2">
            <button 
              onClick={toggleTimer}
              className={cn(
                "flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95",
                isActive ? "bg-emerald-400 hover:bg-emerald-500 text-slate-900" : "bg-indigo-500 hover:bg-indigo-600 text-white"
              )}
            >
              {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {isActive ? "Pause" : "Start"}
            </button>
            <button 
              onClick={resetTimer}
              className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
