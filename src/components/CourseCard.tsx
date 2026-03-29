import React from "react";
import { Course } from "../data/mockData";
import { cn, formatCurrency } from "../lib/utils";
import { motion } from "motion/react";
import { Star, Users, Clock, PlayCircle, BookOpen, BadgeCheck } from "lucide-react";

interface CourseCardProps {
  course: Course;
  onClick: () => void;
  isWatchlisted?: boolean;
  onToggleWatchlist?: () => void;
  progress?: number;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onClick, isWatchlisted, onToggleWatchlist, progress }) => {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group card-fun overflow-hidden cursor-pointer flex flex-col h-full"
    >
      {/* Image Header */}
      <div className="relative h-48 w-full bg-indigo-50 overflow-hidden border-b border-slate-200">
        {course.image ? (
          <img 
            src={course.image} 
            alt={course.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-300">
            <BookOpen className="w-16 h-16" />
          </div>
        )}
        
        {/* Play Overlay */}
        <div className="absolute inset-0 bg-indigo-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
          >
            <PlayCircle className="w-8 h-8 text-indigo-600 ml-1" />
          </motion.div>
        </div>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {course.status === 'draft' && (
            <motion.span 
              whileHover={{ scale: 1.1, rotate: [-2, 2, -2, 0] }}
              className="px-3 py-1 bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-sm shadow-slate-200/20 cursor-default"
            >
              Draft
            </motion.span>
          )}
          <motion.span 
            whileHover={{ scale: 1.1, rotate: [-2, 2, -2, 0] }}
            className="px-3 py-1 bg-white text-slate-800 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm shadow-slate-200/20 cursor-default"
          >
            {course.category}
          </motion.span>
          <motion.span 
            whileHover={{ scale: 1.1, rotate: [-2, 2, -2, 0] }}
            className={cn(
              "px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm shadow-slate-200/20 cursor-default",
              course.level === 'Beginner' ? "bg-emerald-100 text-emerald-800" :
              course.level === 'Intermediate' ? "bg-amber-100 text-amber-800" :
              "bg-rose-100 text-rose-800"
            )}
          >
            {course.level}
          </motion.span>
        </div>

        {/* Watchlist Button */}
        {onToggleWatchlist && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWatchlist();
            }}
            className={cn(
              "absolute top-3 right-3 p-2.5 rounded-full transition-all shadow-sm shadow-slate-200/20",
              isWatchlisted 
                ? "bg-amber-400 text-white hover:bg-amber-300" 
                : "bg-white text-slate-400 hover:bg-amber-50 hover:text-amber-500"
            )}
          >
            <Star className={cn("w-5 h-5", isWatchlisted && "fill-current")} />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-slate-900 leading-tight mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
          {course.title}
        </h3>
        
        <p className="text-sm font-medium text-slate-500 line-clamp-2 mb-4 flex-1">
          {course.description}
        </p>

        {/* Instructor */}
        <div className="flex items-center gap-3 mb-4 group/instructor">
          <motion.div 
            whileHover={{ scale: 1.2, rotate: 10 }}
            className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 overflow-hidden shadow-sm"
          >
            <img 
              src={course.instructor.avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + course.instructor.avatarSeed} 
              alt={course.instructor.name}
              className="w-full h-full object-cover"
            />
          </motion.div>
          <span className="text-sm font-bold text-slate-700 group-hover/instructor:text-indigo-600 transition-colors flex items-center gap-1">
            {course.instructor.name}
            {["mgethmikadinujakumarathunga@gmail.com", "thewantab2012@gmail.com", "therevisionplan@gmail.com"].includes(course.instructor.email || "") && (
              <BadgeCheck className="w-4 h-4 text-blue-500" title="Co-founder" />
            )}
          </span>
        </div>

        {/* Stats Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
          <div className="flex items-center gap-4 text-sm font-bold text-slate-500">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-400 fill-current" />
              <span className="text-slate-700">{course.rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-indigo-400" />
              <span>{course.students.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <PlayCircle className="w-4 h-4 text-emerald-400" />
              <span>{course.lessons.length}</span>
            </div>
          </div>
          
          {progress === undefined && (
            <div className="text-xl font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              {course.price === 0 ? "Free" : formatCurrency(course.price)}
            </div>
          )}
        </div>

        {/* Progress Bar (if enrolled) */}
        {progress !== undefined && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span className="text-slate-400 uppercase tracking-wider">Progress</span>
              <span className="text-indigo-600">{Math.round(progress)}%</span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-indigo-500 rounded-full"
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
