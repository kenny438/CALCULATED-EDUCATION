import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Zap, Star, Flame, Trophy, Target, PlayCircle, Plus, BookOpen, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import { Course, Enrollment, UserProfile } from "../data/mockData";
import { CourseCard } from "./CourseCard";

interface HomeDashboardProps {
  courses: Course[];
  enrollments: Enrollment[];
  userProfile: UserProfile;
  onSelectCourse: (id: string) => void;
  onCreateCourse: () => void;
  onExploreCourses: () => void;
}

const FUN_QUOTES = [
  "Ready to crush your learning goals today?",
  "Time to level up your brain! 🧠✨",
  "Knowledge is power, but learning is a superpower! 🦸‍♂️",
  "Let's get this bread... of knowledge! 🍞📚",
  "Warning: Extreme learning ahead! 🚧🤓",
  "Your brain is hungry. Feed it! 🍔📖",
  "Fueling up for a knowledge marathon! 🏃‍♀️💨"
];

export function HomeDashboard({ courses, enrollments, userProfile, onSelectCourse, onCreateCourse, onExploreCourses }: HomeDashboardProps) {
  const [quote, setQuote] = useState(FUN_QUOTES[0]);
  const [isHoveringStreak, setIsHoveringStreak] = useState(false);
  const [isHoveringXP, setIsHoveringXP] = useState(false);
  const [isHoveringLevel, setIsHoveringLevel] = useState(false);

  useEffect(() => {
    setQuote(FUN_QUOTES[Math.floor(Math.random() * FUN_QUOTES.length)]);
  }, []);

  const fireConfetti = (originX: number, originY: number, colors: string[]) => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { x: originX, y: originY },
      colors: colors,
      disableForReducedMotion: true
    });
  };

  // Find the most recently accessed enrolled course that still exists
  const validEnrollments = enrollments.filter(e => courses.some(c => c.id === e.courseId));
  const activeEnrollment = validEnrollments.length > 0 
    ? [...validEnrollments].sort((a, b) => new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime())[0]
    : null;

  const recommendedCourses = courses.filter(c => 
    userProfile.interests?.some(i => 
      (c.category && i && c.category.toLowerCase().includes(i.toLowerCase())) || 
      (c.tags && i && c.tags.some(t => t && t.toLowerCase().includes(i.toLowerCase())))
    )
  );

  const mainCourse = (activeEnrollment ? courses.find(c => c.id === activeEnrollment.courseId) : null)
    || (recommendedCourses.length > 0 ? recommendedCourses[0] : courses[0]);

  const otherCourses = mainCourse ? (enrollments.length > 0
    ? (enrollments.length > 1 
        ? courses.filter(c => c.id !== mainCourse.id && enrollments.some(e => e.courseId === c.id))
        : courses.filter(c => c.id !== mainCourse.id))
    : courses
  ).slice(0, 6) : [];

  return (
    <div className="flex flex-col gap-10 max-w-6xl mx-auto pb-12">
      
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          onHoverStart={() => setIsHoveringStreak(true)}
          onHoverEnd={() => setIsHoveringStreak(false)}
          onClick={(e) => fireConfetti(e.clientX / window.innerWidth, e.clientY / window.innerHeight, ['#f97316', '#fb923c', '#fcd34d'])}
          className="bg-white border-2 border-slate-200 rounded-3xl p-6 flex items-center gap-5 shadow-[0_4px_0_rgb(226,232,240)] hover:-translate-y-1 hover:shadow-[0_6px_0_rgb(226,232,240)] transition-all cursor-pointer group"
        >
          <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center border-2 border-orange-200 shadow-sm overflow-hidden relative">
            <motion.div
              animate={isHoveringStreak ? { rotate: [0, -15, 15, -15, 15, 0], scale: 1.2 } : { rotate: 0, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Flame className="w-8 h-8 text-orange-500 fill-current relative z-10" />
            </motion.div>
            {isHoveringStreak && (
              <motion.div 
                initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 bg-orange-200/50 rounded-2xl"
              />
            )}
          </div>
          <div>
            <p className="text-sm font-black text-slate-400 uppercase tracking-widest group-hover:text-orange-500 transition-colors">Daily Streak</p>
            <p className="text-3xl font-black text-slate-800">{userProfile.dailyStreak || 0} <span className="text-lg text-slate-500">Days</span></p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          onHoverStart={() => setIsHoveringXP(true)}
          onHoverEnd={() => setIsHoveringXP(false)}
          onClick={(e) => fireConfetti(e.clientX / window.innerWidth, e.clientY / window.innerHeight, ['#6366f1', '#818cf8', '#c7d2fe'])}
          className="bg-white border-2 border-slate-200 rounded-3xl p-6 flex items-center gap-5 shadow-[0_4px_0_rgb(226,232,240)] hover:-translate-y-1 hover:shadow-[0_6px_0_rgb(226,232,240)] transition-all cursor-pointer group"
        >
          <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center border-2 border-indigo-200 shadow-sm overflow-hidden relative">
            <motion.div
              animate={isHoveringXP ? { y: [0, -8, 0], scale: 1.1 } : { y: 0, scale: 1 }}
              transition={{ duration: 0.4, repeat: isHoveringXP ? Infinity : 0 }}
            >
              <Trophy className="w-8 h-8 text-indigo-500 relative z-10" />
            </motion.div>
          </div>
          <div>
            <p className="text-sm font-black text-slate-400 uppercase tracking-widest group-hover:text-indigo-500 transition-colors">Total XP</p>
            <p className="text-3xl font-black text-slate-800">{userProfile.xp || 0} <span className="text-lg text-slate-500">XP</span></p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          onHoverStart={() => setIsHoveringLevel(true)}
          onHoverEnd={() => setIsHoveringLevel(false)}
          onClick={(e) => fireConfetti(e.clientX / window.innerWidth, e.clientY / window.innerHeight, ['#10b981', '#34d399', '#a7f3d0'])}
          className="bg-white border-2 border-slate-200 rounded-3xl p-6 flex items-center gap-5 shadow-[0_4px_0_rgb(226,232,240)] hover:-translate-y-1 hover:shadow-[0_6px_0_rgb(226,232,240)] transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center border-2 border-emerald-200 shadow-sm relative z-10">
            <motion.div
              animate={isHoveringLevel ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 0.8, ease: "backOut" }}
            >
              <Target className="w-8 h-8 text-emerald-500" />
            </motion.div>
          </div>
          <div className="relative z-10 flex-1">
            <p className="text-sm font-black text-slate-400 uppercase tracking-widest group-hover:text-emerald-500 transition-colors">Current Level</p>
            <p className="text-3xl font-black text-slate-800">Level {userProfile.level || 1}</p>
            {/* Fun little progress bar to next level */}
            <div className="mt-2 h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${((userProfile.xp || 0) % 1000) / 10}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-emerald-400 rounded-full"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Greeting & Header */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-indigo-600 p-8 md:p-10 rounded-[2.5rem] shadow-[0_8px_0_rgb(67,120,37)] relative overflow-hidden group"
      >
        {/* Decorative background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ 
              x: [0, 20, 0],
              y: [0, -20, 0],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50" 
          />
          <motion.div 
            animate={{ 
              x: [0, -30, 0],
              y: [0, 20, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-1/2 right-0 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30" 
          />
          {/* Floating sparkles */}
          <Sparkles className="absolute top-8 right-1/4 w-6 h-6 text-yellow-300 opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-opacity" />
          <Star className="absolute bottom-8 left-1/3 w-8 h-8 text-pink-300 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity" />
        </div>

        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2 flex items-center gap-3">
            Welcome back, {userProfile.username}! 
            <motion.span 
              animate={{ rotate: [0, 20, -20, 20, 0] }} 
              transition={{ duration: 1, delay: 1, repeatDelay: 5, repeat: Infinity }}
              className="inline-block"
            >
              👋
            </motion.span>
          </h1>
          <p className="text-xl text-indigo-100 font-medium">
            {quote}
          </p>
        </div>
        {userProfile.canCreateCourses && (
          <motion.button 
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCreateCourse}
            className="relative z-10 btn-fun-emerald py-4 px-8 text-lg flex items-center justify-center gap-3 shadow-sm flex-shrink-0 group/btn overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-3">
              <Plus className="w-6 h-6 group-hover/btn:rotate-90 transition-transform" strokeWidth={3} /> Create Course
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
          </motion.button>
        )}
      </motion.div>

      {/* Main Featured/Continue Course or Empty State */}
      {enrollments.length === 0 || !mainCourse ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border-dashed border-4 border-slate-200 rounded-3xl p-10 text-center flex flex-col items-center justify-center shadow-sm"
        >
          <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <BookOpen className="w-12 h-12 text-indigo-300" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Your learning journey starts here!</h2>
          <p className="text-lg text-slate-500 max-w-lg mb-8 font-medium">
            You haven't enrolled in any courses yet. Explore our catalog to discover new skills, or create your own course to share your knowledge with the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button 
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={onExploreCourses}
              className="btn-fun-indigo py-4 px-8 text-lg flex items-center gap-2 group/btn relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Zap className="w-5 h-5 fill-current group-hover/btn:animate-pulse" /> Explore Courses
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
            </motion.button>
            {userProfile.canCreateCourses && (
              <motion.button 
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={onCreateCourse}
                className="btn-fun-emerald py-4 px-8 text-lg flex items-center gap-2 group/btn relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Plus className="w-5 h-5 group-hover/btn:rotate-90 transition-transform" strokeWidth={3} /> Create a Course
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
              </motion.button>
            )}
          </div>
        </motion.div>
      ) : (
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-6 flex items-center gap-3 group/heading cursor-default">
            <motion.div
              whileHover={{ scale: 1.2, rotate: 15 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <PlayCircle className="w-8 h-8 text-indigo-500 group-hover/heading:text-indigo-600 transition-colors" />
            </motion.div>
            {activeEnrollment ? "Jump Back In" : "Featured Course"}
          </h2>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-fun p-0 relative overflow-hidden bg-white group cursor-pointer flex flex-col md:flex-row"
            onClick={() => onSelectCourse(mainCourse.id)}
          >
            {/* Image Section */}
            <div className="w-full md:w-2/5 relative aspect-video md:aspect-auto overflow-hidden bg-indigo-50 border-r-2 border-slate-100">
              {mainCourse.image ? (
                <img src={mainCourse.image} alt={mainCourse.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-indigo-50">
                  <BookOpen className="w-20 h-20 text-indigo-200" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent md:hidden" />
              <div className="absolute bottom-4 left-4 md:hidden">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-indigo-700 text-xs font-black uppercase tracking-widest rounded-xl shadow-sm">
                  {activeEnrollment ? "Continue Learning" : "Recommended"}
                </span>
              </div>
            </div>

            {/* Content Section */}
            <div className="w-full md:w-3/5 p-8 md:p-10 flex flex-col justify-center">
              <div className="hidden md:block mb-4">
                <span className="px-4 py-1.5 bg-indigo-100 text-indigo-700 text-xs font-black uppercase tracking-widest rounded-2xl shadow-sm">
                  {activeEnrollment ? "Continue Learning" : "Recommended"}
                </span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 leading-tight group-hover:text-indigo-600 transition-colors">{mainCourse.title}</h2>
              
              <p className="text-slate-600 font-medium mb-8 line-clamp-2 text-lg">
                {mainCourse.description}
              </p>

              <div className="flex items-center gap-6 mt-auto">
                <div className="flex-1">
                  {activeEnrollment ? (
                    <div>
                      <div className="flex justify-between text-sm font-bold text-slate-500 mb-2">
                        <span className="uppercase tracking-wider">Progress</span>
                        <span className="text-indigo-600">{Math.round(activeEnrollment.progress || 0)}%</span>
                      </div>
                      <div className="h-4 bg-slate-100 rounded-full overflow-hidden border-2 border-slate-200">
                        <div 
                          className="h-full bg-indigo-500 rounded-full"
                          style={{ width: `${activeEnrollment.progress || 0}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4 text-sm font-bold text-slate-500">
                      <span className="flex items-center gap-1.5"><Star className="w-5 h-5 text-amber-400 fill-current" /> {mainCourse.rating.toFixed(1)}</span>
                      <span>•</span>
                      <span>{mainCourse.lessons.length} lessons</span>
                      <span>•</span>
                      <span className="text-indigo-500 uppercase tracking-wider">{mainCourse.level}</span>
                    </div>
                  )}
                </div>
                <motion.button 
                  whileHover={{ scale: 1.05, rotate: [-1, 1, -1, 0] }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-fun-indigo py-3 px-8 text-lg flex-shrink-0 relative overflow-hidden group/btn"
                >
                  <span className="relative z-10">{activeEnrollment ? "Resume" : "Start"}</span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Other Courses Grid */}
      {otherCourses.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3 group/heading cursor-default">
              <motion.div
                whileHover={{ scale: 1.2, rotate: -15 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Zap className="w-8 h-8 text-amber-400 fill-current group-hover/heading:text-amber-500 transition-colors" />
              </motion.div>
              {enrollments.length > 1 ? "Your Courses" : "More to Explore"}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherCourses.map((course, idx) => {
              const enrollment = enrollments.find(e => e.courseId === course.id);
              return (
                <CourseCard 
                  key={course.id}
                  course={course}
                  onClick={() => onSelectCourse(course.id)}
                  progress={enrollment?.progress}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
