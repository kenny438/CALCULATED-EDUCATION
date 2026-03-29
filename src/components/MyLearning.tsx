import React from "react";
import { Enrollment, Course } from "../data/mockData";
import { motion } from "motion/react";
import { PlayCircle, CheckCircle, Clock, BookOpen } from "lucide-react";
import { cn } from "../lib/utils";

interface MyLearningProps {
  enrollments: Enrollment[];
  courses: Course[];
  onSelectCourse: (courseId: string) => void;
}

export function MyLearning({ enrollments, courses, onSelectCourse }: MyLearningProps) {
  const getCourse = (id: string) => courses.find((c) => c.id === id);

  if (enrollments.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-[2.5rem] border border-slate-200 border-dashed">
        <BookOpen className="w-20 h-20 text-slate-300 mx-auto mb-6" />
        <h3 className="text-3xl font-bold text-slate-900 mb-3">You aren't enrolled in any courses yet</h3>
        <p className="text-slate-500 mb-8 font-bold text-lg">Start exploring to find your next skill.</p>
        <button 
          onClick={() => onSelectCourse("")} 
          className="btn-fun-emerald py-4 px-8 text-lg"
        >
          Explore Courses
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-20"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {enrollments.map((enrollment) => {
          const course = getCourse(enrollment.courseId);
          if (!course) return null;

          return (
            <motion.div 
              key={enrollment.courseId}
              whileHover={{ y: -8 }}
              onClick={() => onSelectCourse(course.id)}
              className="card-fun bg-white rounded-[2rem] overflow-hidden cursor-pointer flex flex-col h-full group"
            >
              <div className="relative h-48 w-full bg-indigo-50 overflow-hidden border-b border-slate-100">
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
                <div className="absolute inset-0 bg-indigo-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl transform scale-50 group-hover:scale-100 transition-transform duration-300">
                    <PlayCircle className="w-8 h-8 text-indigo-600 ml-1" />
                  </div>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-slate-900 leading-tight mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                  {course.title}
                </h3>
                
                <p className="text-sm font-bold text-slate-500 mb-6 flex items-center gap-2 bg-slate-50 w-fit px-3 py-1.5 rounded-full border border-slate-100">
                  <Clock className="w-4 h-4 text-indigo-400" /> 
                  Last accessed {new Date(enrollment.lastAccessed).toLocaleDateString()}
                </p>

                <div className="mt-auto">
                  <div className="flex justify-between text-sm font-bold text-slate-700 mb-3">
                    <span className="uppercase tracking-widest text-slate-400">Progress</span>
                    <span className="text-indigo-600">{Math.round(enrollment.progress || 0)}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all duration-1000 relative",
                        enrollment.progress >= 100 ? "bg-emerald-400" : "bg-indigo-500"
                      )}
                      style={{ width: `${enrollment.progress || 0}%` }}
                    >
                      <div className="absolute top-0 left-0 right-0 h-1.5 bg-white/30 rounded-full mx-1 mt-0.5" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
