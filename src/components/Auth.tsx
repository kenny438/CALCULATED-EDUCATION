import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useToast } from './ui/Toast';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, Mail, Lock, ArrowRight, GraduationCap, Star, Sparkles, Zap, Brain } from 'lucide-react';
import { TermsOfService } from './TermsOfService';
import confetti from 'canvas-confetti';

export function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isOver12, setIsOver12] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHoveringBtn, setIsHoveringBtn] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSignUp && !isOver12) {
      addToast('You must be at least 12 years old to join.', 'error');
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        
        if (data.session) {
          triggerConfetti();
          addToast('Account created successfully!', 'success');
        } else {
          // If email confirmation is enabled in Supabase
          triggerConfetti();
          addToast('Account created! Please check your email to verify your account.', 'success');
          setIsSignUp(false);
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        triggerConfetti();
        addToast('Successfully signed in!', 'success');
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      addToast(error.message || "An error occurred during authentication.", 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-indigo-50 relative">
      {/* Left Side - Branding/Hero */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 p-12 relative overflow-hidden flex-col justify-between">
        {/* Interactive background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ 
              x: mousePosition.x * 20, 
              y: mousePosition.y * 20 
            }}
            transition={{ type: "spring", stiffness: 50, damping: 20 }}
            className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50" 
          />
          <motion.div 
            animate={{ 
              x: mousePosition.x * -30, 
              y: mousePosition.y * -30 
            }}
            transition={{ type: "spring", stiffness: 40, damping: 20 }}
            className="absolute top-1/2 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50" 
          />
          <motion.div 
            animate={{ 
              x: mousePosition.x * 40, 
              y: mousePosition.y * -40 
            }}
            transition={{ type: "spring", stiffness: 30, damping: 20 }}
            className="absolute -bottom-24 left-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50" 
          />
        </div>

        <div className="relative z-10">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="flex items-center gap-3 mb-12"
          >
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center transform -rotate-6 shadow-xl hover:rotate-0 transition-transform duration-300 cursor-pointer">
              <GraduationCap className="w-8 h-8 text-indigo-600" />
            </div>
            <span className="text-4xl font-black text-white tracking-tight">CALCULATED</span>
          </motion.div>

          <div className="mt-20">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <h1 className="text-5xl xl:text-7xl font-black text-white leading-[1.1] mb-6">
                Unlock your <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-cyan-300 to-blue-400 animate-gradient-x">
                  learning potential
                </span>
              </h1>
            </motion.div>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-indigo-100 font-medium max-w-md leading-relaxed flex items-center gap-2"
            >
              <Brain className="w-6 h-6 text-emerald-300" />
              Join thousands mastering new skills through interactive, gamified courses.
            </motion.p>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, type: "spring" }}
          className="relative z-10"
        >
          <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 hover:bg-white/20 transition-colors cursor-pointer group">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <motion.img 
                  key={i} 
                  whileHover={{ y: -5, scale: 1.1, zIndex: 10 }}
                  src={`https://i.pravatar.cc/100?img=${i + 10}`} 
                  alt="Student" 
                  className="w-12 h-12 rounded-full border-4 border-indigo-600 relative" 
                />
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1 text-amber-300 mb-1 group-hover:scale-110 transition-transform origin-left">
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </motion.div>
                ))}
              </div>
              <p className="text-sm font-bold text-white">Loved by 10,000+ learners</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 lg:p-12 relative overflow-hidden">
        {/* Mobile background blobs */}
        <div className="lg:hidden absolute top-20 left-20 w-64 h-64 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob pointer-events-none" />
        <div className="lg:hidden absolute top-40 right-20 w-64 h-64 bg-amber-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 pointer-events-none" />
        <div className="lg:hidden absolute -bottom-8 left-40 w-64 h-64 bg-rose-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000 pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center transform -rotate-6 shadow-lg">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <span className="text-3xl font-black text-slate-900 tracking-tight">CALCULATED</span>
          </div>

          <div className="card-fun bg-white p-8 sm:p-10 relative overflow-hidden group">
            {/* Fun decorative elements */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-100 rounded-full mix-blend-multiply opacity-50 group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-100 rounded-full mix-blend-multiply opacity-50 group-hover:scale-150 transition-transform duration-700 pointer-events-none" />

            <div className="text-center mb-8 relative z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={isSignUp ? 'signup' : 'signin'}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <h2 className="text-4xl font-black text-slate-900 mb-2 flex items-center justify-center gap-2">
                    {isSignUp ? (
                      <>Create Account <Sparkles className="w-8 h-8 text-amber-400" /></>
                    ) : (
                      <>Welcome Back! <Zap className="w-8 h-8 text-indigo-500" /></>
                    )}
                  </h2>
                  <p className="text-base font-bold text-slate-500">
                    {isSignUp ? 'Start your epic learning journey today' : 'Ready to level up your skills?'}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <form onSubmit={handleAuth} className="space-y-6 relative z-10">
              <motion.div
                initial={false}
                animate={{ x: isSignUp ? 0 : [0, -5, 5, -5, 0] }}
                transition={{ duration: 0.4 }}
              >
                <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-widest">Email</label>
                <div className="relative group/input">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6 group-focus-within/input:text-indigo-500 transition-colors" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-4 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all outline-none font-bold text-slate-700 placeholder-slate-400 text-lg hover:border-slate-200"
                    placeholder="you@example.com"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={false}
                animate={{ x: isSignUp ? 0 : [0, 5, -5, 5, 0] }}
                transition={{ duration: 0.4 }}
              >
                <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-widest">Password</label>
                <div className="relative group/input">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6 group-focus-within/input:text-indigo-500 transition-colors" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-4 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all outline-none font-bold text-slate-700 placeholder-slate-400 text-lg hover:border-slate-200"
                    placeholder="••••••••"
                  />
                </div>
              </motion.div>

              <AnimatePresence>
                {isSignUp && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, scale: 0.9 }}
                    animate={{ opacity: 1, height: 'auto', scale: 1 }}
                    exit={{ opacity: 0, height: 0, scale: 0.9 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-start gap-4 p-4 bg-emerald-50 rounded-2xl border-4 border-emerald-100 hover:border-emerald-200 transition-colors">
                      <div className="flex items-center h-5 mt-1">
                        <input
                          id="age-check"
                          type="checkbox"
                          checked={isOver12}
                          onChange={(e) => setIsOver12(e.target.checked)}
                          className="w-6 h-6 text-emerald-500 border-2 border-emerald-300 rounded-lg focus:ring-emerald-500 cursor-pointer transition-transform hover:scale-110"
                        />
                      </div>
                      <label htmlFor="age-check" className="text-sm font-bold text-slate-600 cursor-pointer select-none leading-relaxed">
                        I certify that I am at least <span className="font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">12 years of age</span> and agree to the <button type="button" onClick={(e) => { e.preventDefault(); setIsTermsOpen(true); }} className="text-indigo-600 hover:text-indigo-700 hover:underline font-black decoration-2 underline-offset-2">Terms of Service</button>.
                      </label>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onHoverStart={() => setIsHoveringBtn(true)}
                onHoverEnd={() => setIsHoveringBtn(false)}
                className="btn-fun w-full py-5 text-xl flex items-center justify-center gap-3 relative overflow-hidden group/btn"
              >
                {/* Button shine effect */}
                <div className="absolute inset-0 -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
                
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    {isSignUp ? 'Create Account' : 'Sign In'}
                    <motion.div
                      animate={{ x: isHoveringBtn ? 5 : 0 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <ArrowRight className="w-6 h-6" />
                    </motion.div>
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-8 text-center relative z-10">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-base font-black text-indigo-500 hover:text-indigo-600 hover:underline underline-offset-4 transition-all hover:scale-105"
              >
                {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {isTermsOpen && (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
          <TermsOfService onBack={() => setIsTermsOpen(false)} />
        </div>
      )}

      <div className="absolute bottom-4 left-0 w-full text-center text-slate-400 text-xs font-medium px-4 pointer-events-none">
        by (BUSSIN)Bureau de l’Unité des Systèmes et Intelligence Numérique industries
      </div>
    </div>
  );
}
