import React, { useState } from "react";
import { Search, Bell, Menu, ChevronDown, X, LogOut, BookOpen, Users, GraduationCap, BadgeCheck } from "lucide-react";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { useToast } from "./ui/Toast";
import { FocusTimer } from "./FocusTimer";

import { UserProfile } from "../data/mockData";

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userProfile?: UserProfile;
}

export function Layout({ 
  children, 
  activeTab, 
  setActiveTab, 
  userProfile
}: LayoutProps) {
  const { addToast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "courses", label: "Courses" },
    { id: "my-learning", label: "My Learning" },
    { id: "groups", label: "Groups" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-indigo-50/30 font-sans text-slate-900">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white border-b-4 border-slate-200">
        <div className="max-w-[1200px] mx-auto px-4 h-20 flex items-center justify-between gap-4">
          {/* Left: Logo & Nav */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab("home")}>
              <motion.div 
                whileTap={{ rotate: 360, scale: 0.8 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center transform -rotate-6 shadow-md group-hover:rotate-0 transition-transform duration-300"
              >
                <GraduationCap className="w-6 h-6 text-white" />
              </motion.div>
              <div className="flex flex-col">
                <span className="text-3xl font-black tracking-tight text-indigo-600 leading-none group-hover:scale-105 transition-transform">CALCULATED</span>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={cn(
                    "text-base font-black transition-all flex items-center gap-2 px-4 py-2 rounded-2xl border-2",
                    activeTab === link.id 
                      ? "bg-indigo-100 text-indigo-700 border-indigo-200 shadow-sm" 
                      : "border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                  )}
                >
                  {link.id === 'home' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>}
                  {link.id === 'courses' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>}
                  {link.id === 'my-learning' && <BookOpen className="w-5 h-5" />}
                  {link.id === 'groups' && <Users className="w-5 h-5" />}
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Right: Actions & User */}
          <div className="flex items-center gap-3">
            <FocusTimer />
            
            <button 
              onClick={() => setActiveTab("profile")}
              className="hidden sm:flex items-center gap-2 px-4 py-2 border-2 border-slate-200 bg-white rounded-2xl text-sm font-black hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-600 transition-all shadow-sm transform hover:-translate-y-0.5"
            >
              <img src={userProfile?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userProfile?.avatarSeed || 'default'}`} alt="Avatar" className="w-6 h-6 rounded-full bg-slate-100 object-cover" />
              <span className="flex items-center gap-1">
                {userProfile?.username || 'Profile'}
                {userProfile && ["mgethmikadinujakumarathunga@gmail.com", "thewantab2012@gmail.com", "therevisionplan@gmail.com"].includes(userProfile.email || "") && (
                  <BadgeCheck className="w-4 h-4 text-blue-500" title="Co-founder" />
                )}
              </span>
            </button>

            <button 
              onClick={() => {
                window.dispatchEvent(new CustomEvent('app:signout'));
              }}
              className="hidden sm:flex items-center justify-center p-2 border-2 border-slate-200 bg-white rounded-2xl text-slate-500 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 transition-all shadow-sm transform hover:-translate-y-0.5"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>

            <button 
              className="p-3 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-2xl transition-colors active:scale-95 md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b-4 border-slate-200 overflow-hidden"
          >
            <nav className="flex flex-col p-4 gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    setActiveTab(link.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={cn(
                    "text-base font-black transition-all flex items-center gap-3 px-4 py-3 rounded-2xl border-2",
                    activeTab === link.id 
                      ? "bg-indigo-100 text-indigo-700 border-indigo-200 shadow-sm" 
                      : "border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                  )}
                >
                  {link.id === 'home' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>}
                  {link.id === 'courses' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>}
                  {link.id === 'my-learning' && <BookOpen className="w-5 h-5" />}
                  {link.id === 'groups' && <Users className="w-5 h-5" />}
                  {link.label}
                </button>
              ))}
              <div className="h-px bg-slate-200 my-2" />
              <button 
                onClick={() => {
                  setActiveTab("profile");
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-3 border-2 border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-700 rounded-2xl text-base font-black transition-all"
              >
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userProfile?.avatarSeed || 'default'}`} alt="Avatar" className="w-6 h-6 rounded-full bg-slate-100" />
                Profile
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="max-w-[1200px] mx-auto p-4 md:p-6 lg:p-8 flex-grow">
        {children}
      </main>

      <footer className="w-full text-center text-slate-400 text-xs font-medium py-6 mt-auto">
        by (BUSSIN)Bureau de l’Unité des Systèmes et Intelligence Numérique industries
      </footer>
    </div>
  );
}
