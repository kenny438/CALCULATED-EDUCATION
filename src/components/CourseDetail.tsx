import React, { useState } from "react";
import { Course } from "../data/mockData";
import { formatCurrency, cn } from "../lib/utils";
import { ArrowLeft, Share2, Star, Clock, Users, PlayCircle, CheckCircle, Lock, Check, GraduationCap, Edit2, Sparkles, BadgeCheck } from "lucide-react";
import { motion } from "motion/react";
import { useToast } from "./ui/Toast";
import { CommentSection } from "./CommentSection";
import { LessonPlayer } from "./LessonPlayer";

interface CourseDetailProps {
  course: Course;
  onBack: () => void;
  onEnroll: (courseId: string) => void;
  isWatchlisted: boolean;
  onToggleWatchlist: () => void;
  isEnrolled: boolean;
  progress?: number;
  onUpdateProgress?: (progress: number) => void;
  isInstructor?: boolean;
  onDeleteCourse?: (courseId: string) => void;
  onEditCourse?: (courseId: string) => void;
  onUnenroll?: (courseId: string) => void;
}

export function CourseDetail({ course, onBack, onEnroll, isWatchlisted, onToggleWatchlist, isEnrolled, progress = 0, onUpdateProgress, isInstructor, onDeleteCourse, onEditCourse, onUnenroll }: CourseDetailProps) {
  const { addToast } = useToast();
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  
  // Initialize completed lessons based on progress
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(() => {
    const initialCompletedCount = Math.floor((progress / 100) * course.lessons.length);
    return new Set(course.lessons.slice(0, initialCompletedCount).map(l => l.id));
  });

  React.useEffect(() => {
    const initialCompletedCount = Math.floor((progress / 100) * course.lessons.length);
    setCompletedLessons(new Set(course.lessons.slice(0, initialCompletedCount).map(l => l.id)));
  }, [course.lessons]);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    addToast("Link copied to clipboard!", "success");
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    setShowDeleteConfirm(false);
    onDeleteCourse?.(course.id);
  };

  const handleLessonComplete = () => {
    if (activeLessonId) {
      let newProgress = 0;
      setCompletedLessons(prev => {
        const next = new Set(prev);
        next.add(activeLessonId);
        newProgress = Math.round((next.size / course.lessons.length) * 100);
        return next;
      });
      if (onUpdateProgress) {
        // We need to calculate it here or use the value from the updater
        // But since state updates are async, we can just calculate it based on the current state + 1
        // Wait, it's better to just calculate it directly
        const nextSize = completedLessons.has(activeLessonId) ? completedLessons.size : completedLessons.size + 1;
        const calcProgress = Math.round((nextSize / course.lessons.length) * 100);
        onUpdateProgress(calcProgress);
      }
      addToast("Lesson completed! +10 XP", "success");
    }
    setActiveLessonId(null);
  };

  const activeLesson = course.lessons.find(l => l.id === activeLessonId);

  if (activeLesson) {
    return (
      <LessonPlayer 
        lesson={activeLesson} 
        onClose={() => setActiveLessonId(null)} 
        onComplete={handleLessonComplete} 
      />
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto"
    >
      <div className="mb-6 flex items-center justify-between">
        <motion.button 
          whileHover={{ x: -5 }}
          onClick={onBack}
          className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Courses
        </motion.button>
        <div className="flex gap-2">
          {isInstructor && onEditCourse && (
            <motion.button 
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onEditCourse(course.id)}
              className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-full transition-colors"
              title="Edit Course"
            >
              <Edit2 className="w-5 h-5" />
            </motion.button>
          )}
          {isInstructor && onDeleteCourse && (
            <motion.button 
              whileHover={{ scale: 1.1, rotate: -15 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleDelete}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
              title="Delete Course"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </motion.button>
          )}
          <motion.button 
            whileHover={{ scale: 1.1, rotate: -15 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleShare}
            className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1, rotate: [0, -10, 10, -10, 0] }}
            whileTap={{ scale: 0.9 }}
            onClick={onToggleWatchlist}
            className={cn(
              "p-2 rounded-full transition-colors",
              isWatchlisted ? "text-yellow-500 bg-yellow-50" : "text-slate-400 hover:text-yellow-500 hover:bg-slate-100"
            )}
          >
            <Star className={cn("w-5 h-5", isWatchlisted && "fill-current")} />
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <div className="card-fun bg-white overflow-hidden">
            {course.image && (
              <div className="w-full h-64 md:h-80 bg-slate-100 relative">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            )}
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-4 py-2 bg-indigo-100 text-indigo-800 text-xs font-bold uppercase tracking-widest rounded-full border border-indigo-200">
                  {course.category}
                </span>
              <span className={cn(
                "px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-full border",
                course.level === 'Beginner' ? "bg-emerald-100 text-emerald-800 border-emerald-200" :
                course.level === 'Intermediate' ? "bg-amber-100 text-amber-800 border-amber-200" :
                "bg-rose-100 text-rose-800 border-rose-200"
              )}>
                {course.level}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              {course.title}
            </h1>
            
            <p className="text-xl text-slate-600 mb-8 font-medium leading-relaxed">
              {course.description}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-slate-600 border-t-4 border-slate-100 pt-6">
              <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-full border border-amber-100">
                <Star className="w-5 h-5 text-amber-500 fill-current" />
                <span className="text-amber-900 font-bold text-base">{course.rating.toFixed(1)}</span>
                <span className="text-amber-700">({course.students.toLocaleString()} students)</span>
              </div>
              <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100 text-indigo-700">
                <PlayCircle className="w-5 h-5" />
                <span>{course.lessons.length} lessons</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-200 text-slate-700">
                <Clock className="w-5 h-5" />
                <span>Self-paced</span>
              </div>
            </div>
            </div>
          </div>

          {/* Path UI */}
          <div className="card-fun bg-white p-8 overflow-hidden">
            <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center flex items-center justify-center gap-3">
              <Star className="w-8 h-8 text-amber-400 fill-current" />
              Learning Path
            </h2>
            
            {course.uiStyle === 'progression-map' ? (
              <div className="relative py-8 flex flex-col items-center">
                {course.lessons.map((lesson, index) => {
                  const isLocked = (!isEnrolled && !isInstructor) && index > 0;
                  const isCompleted = completedLessons.has(lesson.id);
                  const isNext = (isEnrolled || isInstructor) && !isCompleted && (index === 0 || completedLessons.has(course.lessons[index - 1].id));
                  
                  // Alternate left/right offset for visual interest
                  const offset = index % 2 === 0 ? -30 : 30;

                  return (
                    <div key={lesson.id} className="relative flex flex-col items-center w-full max-w-md">
                      {/* Connecting Line */}
                      {index > 0 && (
                        <div className={cn(
                          "w-4 h-20 my-2 rounded-full transition-colors duration-500 border-x-4 border-black/5",
                          completedLessons.has(course.lessons[index - 1].id) ? "bg-emerald-400" : "bg-slate-100"
                        )} />
                      )}
                      
                      {/* Node */}
                      <div className="relative flex items-center justify-center w-full group">
                        <motion.button 
                          initial={{ x: offset }}
                          animate={{ x: offset }}
                          whileHover={!isLocked ? { scale: 1.05, x: offset } : { x: offset }}
                          whileTap={!isLocked ? { scale: 0.95, x: offset } : { x: offset }}
                          onClick={() => !isLocked && setActiveLessonId(lesson.id)}
                          className={cn(
                            "relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 border-b",
                            isLocked ? "bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed" :
                            isCompleted ? "bg-emerald-400 text-white border-emerald-600 hover:bg-emerald-300" :
                            isNext ? "bg-amber-400 text-white border-amber-600 ring-8 ring-amber-100 hover:bg-amber-300 animate-bounce" :
                            "bg-white border border-slate-200 text-slate-400 border-b hover:border-indigo-300 hover:text-indigo-500"
                          )}
                        >
                          {isLocked ? <Lock className="w-10 h-10" /> :
                           isCompleted ? <Check className="w-12 h-12" /> :
                           <Star className={cn("w-10 h-10", isNext && "fill-current")} />}
                        </motion.button>

                        {/* Tooltip / Label */}
                        <div 
                          className={cn(
                            "absolute top-1/2 -translate-y-1/2 transition-all duration-300",
                            index % 2 === 0 ? "left-1/2 ml-16" : "right-1/2 mr-16",
                            isLocked ? "opacity-50" : "opacity-100"
                          )}
                        >
                          <div className={cn(
                            "bg-white px-4 py-3 rounded-2xl border shadow-sm whitespace-nowrap",
                            isCompleted ? "border-emerald-200" :
                            isNext ? "border-indigo-200" : "border-slate-100"
                          )}>
                            <h4 className="font-bold text-slate-900 text-sm">{lesson.title}</h4>
                            <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-medium">
                              <Clock className="w-3 h-3" /> {lesson.duration}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-4">
                {course.lessons.map((lesson, index) => {
                  const isLocked = (!isEnrolled && !isInstructor) && index > 0;
                  const isCompleted = completedLessons.has(lesson.id);
                  const isNext = (isEnrolled || isInstructor) && !isCompleted && (index === 0 || completedLessons.has(course.lessons[index - 1].id));

                  return (
                    <motion.button
                      key={lesson.id}
                      whileHover={!isLocked ? { scale: 1.02, x: 5 } : {}}
                      whileTap={!isLocked ? { scale: 0.98 } : {}}
                      onClick={() => !isLocked && setActiveLessonId(lesson.id)}
                      className={cn(
                        "w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left group/lesson",
                        isLocked ? "bg-slate-50 border-slate-100 cursor-not-allowed opacity-75" :
                        isCompleted ? "bg-emerald-50 border-emerald-200 hover:border-emerald-300" :
                        isNext ? "bg-amber-50 border-amber-300 ring-4 ring-amber-100/50" :
                        "bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
                          isLocked ? "bg-slate-200 text-slate-400" :
                          isCompleted ? "bg-emerald-200 text-emerald-700" :
                          isNext ? "bg-amber-200 text-amber-700" :
                          "bg-indigo-100 text-indigo-600"
                        )}>
                          {isLocked ? <Lock className="w-6 h-6" /> :
                           isCompleted ? <Check className="w-6 h-6" /> :
                           <span className="font-bold text-lg">{index + 1}</span>}
                        </div>
                        <div>
                          <h4 className={cn(
                            "font-bold text-lg",
                            isLocked ? "text-slate-500" : "text-slate-900"
                          )}>{lesson.title}</h4>
                          <p className="text-sm font-bold text-slate-500 flex items-center gap-1 mt-1">
                            <Clock className="w-4 h-4" /> {lesson.duration}
                          </p>
                        </div>
                      </div>
                      {!isLocked && (
                        <div className={cn(
                          "px-4 py-2 rounded-full text-sm font-bold uppercase tracking-widest border transition-transform group-hover/lesson:scale-110",
                          isCompleted ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
                          isNext ? "bg-amber-100 text-amber-700 border-amber-200" :
                          "bg-indigo-50 text-indigo-600 border-indigo-100"
                        )}>
                          {isCompleted ? "Completed" : isNext ? "Start Now" : "Start"}
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Instructor */}
          <div className="card-fun bg-white p-8 group/instructor-section">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3 cursor-default">
              <motion.div
                whileHover={{ scale: 1.2, rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <Users className="w-6 h-6 text-indigo-500 group-hover/instructor-section:text-indigo-600 transition-colors" />
              </motion.div>
              Your Instructor
            </h2>
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 6 }}
                className="relative cursor-pointer shrink-0"
              >
                <img 
                  src={course.instructor?.avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + (course.instructor?.avatarSeed || "unknown")} 
                  alt={course.instructor?.name || "Unknown Instructor"}
                  className="w-20 h-20 rounded-full bg-indigo-50 border border-indigo-100 shadow-md transform -rotate-6 transition-transform object-cover"
                />
                <div className="absolute -bottom-2 -right-2 bg-emerald-400 text-white text-xs font-bold px-2 py-1 rounded-lg border border-white shadow-sm transform rotate-12">
                  PRO
                </div>
              </motion.div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  {course.instructor?.name || "Unknown Instructor"}
                  {["mgethmikadinujakumarathunga@gmail.com", "thewantab2012@gmail.com", "therevisionplan@gmail.com"].includes(course.instructor?.email || "") && (
                    <span className="flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-bold border border-blue-200">
                      <BadgeCheck className="w-3 h-3 text-blue-500" />
                      Co-founder
                    </span>
                  )}
                </h3>
                <p className="text-slate-600 mt-2 font-medium leading-relaxed">{course.instructor?.bio || "No bio available."}</p>
                {course.instructor?.qualifications && (
                  <div className="mt-4 bg-indigo-50 border border-indigo-100 rounded-full p-4">
                    <h4 className="text-sm font-bold text-indigo-900 mb-1 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      Qualifications
                    </h4>
                    <p className="text-sm text-indigo-700">{course.instructor?.qualifications}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Comments */}
          <CommentSection 
            comments={course.comments} 
            courseId={course.id}
          />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 order-first lg:order-last">
          <div className="sticky top-24 space-y-6">
            <div className="card-fun bg-white p-6">
              {course.image && (
                <div className="rounded-2xl overflow-hidden mb-6 aspect-video bg-indigo-50 border border-slate-100">
                  <img src={course.image} alt="Course preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              )}
              
              <div className="text-4xl font-bold text-slate-900 mb-6 text-center">
                {course.price === 0 ? "Free!" : formatCurrency(course.price)}
              </div>

              {isEnrolled ? (
                <div className="space-y-4">
                  <div className="w-full py-4 bg-emerald-100 text-emerald-800 rounded-2xl font-bold text-center flex items-center justify-center gap-2 border border-emerald-200 shadow-sm transform -rotate-1">
                    <CheckCircle className="w-6 h-6" />
                    ENROLLED
                  </div>
                  <div className="pt-4 border-t-4 border-slate-100">
                    <div className="flex items-center justify-between text-sm font-bold mb-3">
                      <span className="text-slate-400 uppercase tracking-widest">Your Progress</span>
                      <span className="text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                        {Math.round((completedLessons.size / course.lessons.length) * 100 || 0)}%
                      </span>
                    </div>
                    <div className="h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(completedLessons.size / course.lessons.length) * 100 || 0}%` }}
                        className="h-full bg-indigo-500 rounded-full relative"
                      >
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-white/30 rounded-full mx-1 mt-0.5" />
                      </motion.div>
                    </div>
                  </div>
                  {isInstructor && onUnenroll && (
                    <button
                      onClick={() => onUnenroll(course.id)}
                      className="w-full py-2 text-sm font-bold text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      Unenroll (Test Mode)
                    </button>
                  )}
                </div>
              ) : isInstructor ? (
                <div className="space-y-4">
                  <div className="w-full py-4 bg-amber-100 text-amber-800 rounded-2xl font-bold text-center flex items-center justify-center gap-2 border border-amber-200 shadow-sm transform -rotate-1">
                    <Star className="w-6 h-6 fill-current" />
                    INSTRUCTOR PREVIEW
                  </div>
                  <p className="text-sm text-center font-bold text-slate-500">
                    You can preview all lessons without enrolling.
                  </p>
                  <button
                    onClick={() => onEnroll(course.id)}
                    className="btn-fun bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 w-full py-3"
                  >
                    Enroll as Student (Free)
                  </button>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onEnroll(course.id)}
                  className="btn-fun w-full py-5 text-xl relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Sparkles className="w-6 h-6 text-yellow-300 group-hover:animate-spin" />
                    Enroll Now
                    <Sparkles className="w-6 h-6 text-yellow-300 group-hover:animate-spin" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>
              )}

              <div className="mt-8 space-y-4 text-sm text-slate-600 font-bold">
                <motion.div 
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="flex items-center gap-3 bg-slate-50 p-3 rounded-full border border-slate-100 group/benefit cursor-default"
                >
                  <CheckCircle className="w-5 h-5 text-emerald-500 group-hover/benefit:scale-125 transition-transform" />
                  <span className="group-hover/benefit:text-emerald-700 transition-colors">Full lifetime access</span>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="flex items-center gap-3 bg-slate-50 p-3 rounded-full border border-slate-100 group/benefit cursor-default"
                >
                  <CheckCircle className="w-5 h-5 text-emerald-500 group-hover/benefit:scale-125 transition-transform" />
                  <span className="group-hover/benefit:text-emerald-700 transition-colors">Interactive learning path</span>
                </motion.div>
                {course.certificate && (
                  <motion.div 
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="flex flex-col gap-1 bg-slate-50 p-3 rounded-2xl border border-slate-100 group/benefit cursor-default"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500 group-hover/benefit:scale-125 transition-transform" />
                      <span className="group-hover/benefit:text-emerald-700 transition-colors">Certificate of completion</span>
                    </div>
                    {course.certificateName && (
                      <div className="pl-8 text-xs text-slate-500 font-medium">
                        Earn the <span className="font-bold text-indigo-600">{course.certificateName}</span> certificate
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100"
          >
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Delete Course?</h3>
            <p className="text-slate-600 font-medium mb-8">
              Are you sure you want to delete "{course.title}"? This action cannot be undone and all enrollments will be lost.
            </p>
            <div className="flex gap-4 justify-end">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="px-6 py-3 rounded-2xl font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="px-6 py-3 rounded-2xl font-bold bg-rose-500 text-white hover:bg-rose-600 transition-colors shadow-sm"
              >
                Yes, Delete Course
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
