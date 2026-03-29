import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, Settings, ListVideo, Plus, Trash2, GripVertical, 
  Save, X, Image as ImageIcon, Video, HelpCircle, ChevronRight, Map, Eye, Check 
} from "lucide-react";
import MDEditor from '@uiw/react-md-editor';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import '@google/model-viewer';
import { Course, Lesson, Question, UserProfile } from "../data/mockData";
import { cn } from "../lib/utils";
import { CourseDetail } from "./CourseDetail";

interface CourseCreatorWorkspaceProps {
  onClose: () => void;
  onSave: (course: Partial<Course>) => void;
  onDelete?: (courseId: string) => void;
  initialData?: Partial<Course>;
  userProfile: UserProfile;
}

export function CourseCreatorWorkspace({ onClose, onSave, onDelete, initialData, userProfile }: CourseCreatorWorkspaceProps) {
  const [activeMenu, setActiveMenu] = useState<"overview" | "settings" | string>("overview");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState<string | null>(null);
  const [questionToDelete, setQuestionToDelete] = useState<{lessonId: string, questionId: string} | null>(null);
  
  const [courseData, setCourseData] = useState<Partial<Course>>({
    title: "",
    description: "",
    category: "Technology",
    level: "Beginner",
    price: 0,
    image: "",
    lessons: [],
    ...initialData
  });

  const handleSave = (status: 'published' | 'draft') => {
    onSave({ ...courseData, status });
  };

  const addLesson = () => {
    const newLesson: Lesson = {
      id: "l_" + Math.random().toString(36).substr(2, 9),
      title: "New Lesson",
      duration: "10:00",
      content: "",
      questions: []
    };
    setCourseData(prev => ({
      ...prev,
      lessons: [...(prev.lessons || []), newLesson]
    }));
    setActiveMenu(newLesson.id);
  };

  const updateLesson = (id: string, updates: Partial<Lesson>) => {
    setCourseData(prev => ({
      ...prev,
      lessons: prev.lessons?.map(l => l.id === id ? { ...l, ...updates } : l)
    }));
  };

  const deleteLesson = (id: string) => {
    setCourseData(prev => ({
      ...prev,
      lessons: prev.lessons?.filter(l => l.id !== id)
    }));
    if (activeMenu === id) setActiveMenu("overview");
  };

  const addQuestion = (lessonId: string) => {
    const newQuestion: Question = {
      id: "q_" + Math.random().toString(36).substr(2, 9),
      type: "multiple-choice",
      question: "New Question",
      options: ["Option 1", "Option 2"],
      correctAnswer: "Option 1"
    };
    
    setCourseData(prev => ({
      ...prev,
      lessons: prev.lessons?.map(l => {
        if (l.id === lessonId) {
          return { ...l, questions: [...(l.questions || []), newQuestion] };
        }
        return l;
      })
    }));
  };

  const updateQuestion = (lessonId: string, questionId: string, updates: Partial<Question>) => {
    setCourseData(prev => ({
      ...prev,
      lessons: prev.lessons?.map(l => {
        if (l.id === lessonId) {
          return {
            ...l,
            questions: l.questions?.map(q => q.id === questionId ? { ...q, ...updates } : q)
          };
        }
        return l;
      })
    }));
  };

  const deleteQuestion = (lessonId: string, questionId: string) => {
    setCourseData(prev => ({
      ...prev,
      lessons: prev.lessons?.map(l => {
        if (l.id === lessonId) {
          return {
            ...l,
            questions: l.questions?.filter(q => q.id !== questionId)
          };
        }
        return l;
      })
    }));
  };

  const activeLesson = courseData.lessons?.find(l => l.id === activeMenu);

  if (isPreviewMode) {
    return (
      <div className="fixed inset-0 z-50 bg-indigo-50 overflow-y-auto">
        <div className="sticky top-0 z-50 bg-white border-b-4 border-slate-200 p-4 flex justify-between items-center shadow-sm">
          <h2 className="text-xl font-black text-slate-900">Preview Mode</h2>
          <button 
            onClick={() => setIsPreviewMode(false)}
            className="btn-fun bg-white text-slate-700 border-slate-200 hover:bg-slate-50 px-6 py-2"
          >
            Exit Preview
          </button>
        </div>
        <div className="p-8">
          <CourseDetail
            course={{
              ...courseData,
              id: courseData.id || "preview-id",
              instructor: courseData.instructor || { 
                id: "preview-inst", 
                name: userProfile.username || "You", 
                avatarSeed: userProfile.avatarSeed || "you", 
                bio: userProfile.bio || "",
                qualifications: userProfile.qualifications || ""
              },
              students: 0,
              rating: 0,
              comments: [],
            } as Course}
            onBack={() => setIsPreviewMode(false)}
            onEnroll={() => {}}
            isWatchlisted={false}
            onToggleWatchlist={() => {}}
            isEnrolled={false}
            progress={0}
            isInstructor={true}
          />
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-50 bg-indigo-50 flex flex-col h-screen overflow-hidden"
    >
      {/* Topbar */}
      <header className="h-20 bg-white border-b-4 border-slate-200 flex items-center justify-between px-6 flex-shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-3 hover:bg-rose-100 rounded-2xl transition-colors text-slate-500 hover:text-rose-600">
            <X className="w-6 h-6" />
          </button>
          <div className="h-8 w-1 bg-slate-200 rounded-full" />
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Course Creator</h1>
          <span className={cn(
            "px-3 py-1.5 text-xs font-black uppercase tracking-widest rounded-xl border-2",
            courseData.status === 'published' 
              ? "bg-emerald-100 text-emerald-700 border-emerald-200" 
              : "bg-amber-100 text-amber-700 border-amber-200"
          )}>
            {courseData.status === 'published' ? 'Published' : 'Draft'}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsPreviewMode(true)}
            className="btn-fun bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50 px-6 py-3 flex items-center gap-2"
          >
            <Eye className="w-5 h-5" />
            Preview
          </button>
          <button 
            onClick={() => handleSave('draft')}
            className="btn-fun bg-white text-slate-700 border-slate-200 hover:bg-slate-50 px-6 py-3"
          >
            {courseData.status === 'published' ? 'Unpublish to Draft' : 'Save Draft'}
          </button>
          <button 
            onClick={() => handleSave('published')}
            className="btn-fun-indigo px-8 py-3 flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            {courseData.status === 'published' ? 'Save Changes' : 'Publish Course'}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Fun background elements */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob pointer-events-none" />
        <div className="absolute top-40 right-20 w-64 h-64 bg-amber-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 pointer-events-none" />

        {/* Sidebar */}
        <aside className="w-80 bg-white border-r-4 border-slate-200 flex flex-col overflow-y-auto z-10 shadow-sm">
          <div className="p-6 space-y-2">
            <button
              onClick={() => setActiveMenu("overview")}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-base font-bold transition-all border-2",
                activeMenu === "overview" 
                  ? "bg-indigo-50 text-indigo-700 border-indigo-200 shadow-sm" 
                  : "text-slate-600 border-transparent hover:bg-slate-50 hover:border-slate-200"
              )}
            >
              <BookOpen className="w-5 h-5" />
              Overview
            </button>
            <button
              onClick={() => setActiveMenu("map")}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-base font-bold transition-all border-2",
                activeMenu === "map" 
                  ? "bg-indigo-50 text-indigo-700 border-indigo-200 shadow-sm" 
                  : "text-slate-600 border-transparent hover:bg-slate-50 hover:border-slate-200"
              )}
            >
              <Map className="w-5 h-5" />
              Progression Map
            </button>
            <button
              onClick={() => setActiveMenu("settings")}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-base font-bold transition-all border-2",
                activeMenu === "settings" 
                  ? "bg-indigo-50 text-indigo-700 border-indigo-200 shadow-sm" 
                  : "text-slate-600 border-transparent hover:bg-slate-50 hover:border-slate-200"
              )}
            >
              <Settings className="w-5 h-5" />
              Settings
            </button>
          </div>

          <div className="px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Curriculum</h3>
              <button onClick={addLesson} className="p-2 bg-emerald-100 hover:bg-emerald-200 rounded-xl text-emerald-600 transition-colors">
                <Plus className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-2">
              {courseData.lessons?.map((lesson, index) => (
                <button
                  key={lesson.id}
                  onClick={() => setActiveMenu(lesson.id)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-4 rounded-2xl text-sm font-bold transition-all border-2 group",
                    activeMenu === lesson.id 
                      ? "bg-indigo-50 text-indigo-700 border-indigo-200 shadow-sm" 
                      : "text-slate-600 border-transparent hover:bg-slate-50 hover:border-slate-200"
                  )}
                >
                  <div className="flex items-center gap-3 truncate">
                    <div className={cn(
                      "w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black",
                      activeMenu === lesson.id ? "bg-indigo-200 text-indigo-800" : "bg-slate-200 text-slate-600"
                    )}>
                      {index + 1}
                    </div>
                    <span className="truncate">{lesson.title}</span>
                  </div>
                  <ChevronRight className={cn(
                    "w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity",
                    activeMenu === lesson.id && "opacity-100"
                  )} />
                </button>
              ))}
              {courseData.lessons?.length === 0 && (
                <div className="text-center py-8 px-4 border-4 border-dashed border-slate-200 rounded-2xl bg-slate-50">
                  <div className="w-12 h-12 bg-indigo-100 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <p className="text-sm text-slate-500 font-bold mb-4">Your curriculum is empty. Start by adding your first lesson!</p>
                  <button onClick={addLesson} className="btn-fun-indigo px-4 py-2 text-sm w-full">
                    Add First Lesson
                  </button>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main Workspace */}
        <main className="flex-1 overflow-y-auto p-8 relative z-10">
          <div className="max-w-6xl mx-auto">
            <AnimatePresence mode="wait">
              {activeMenu === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                >
                  <div className="lg:col-span-2 space-y-8">
                    <div>
                      <h2 className="text-3xl font-black text-slate-900 mb-6">Course Overview</h2>
                      <div className="card-fun bg-white p-8 space-y-6">
                        <div>
                          <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-widest">Course Title</label>
                          <input
                            type="text"
                            value={courseData.title}
                            onChange={e => setCourseData({ ...courseData, title: e.target.value })}
                            placeholder="e.g. Advanced Mathematics"
                            className="w-full px-4 py-4 bg-slate-50 border-4 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all outline-none font-bold text-slate-700 placeholder-slate-400 text-lg"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-widest">Description</label>
                          <textarea
                            value={courseData.description}
                            onChange={e => setCourseData({ ...courseData, description: e.target.value })}
                            placeholder="What will students learn?"
                            rows={4}
                            className="w-full px-4 py-4 bg-slate-50 border-4 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all outline-none font-bold text-slate-700 placeholder-slate-400 text-lg resize-none"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-widest">Category</label>
                            <select
                              value={courseData.category}
                              onChange={e => setCourseData({ ...courseData, category: e.target.value as any })}
                              className="w-full px-4 py-4 bg-slate-50 border-4 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all outline-none font-bold text-slate-700 text-lg appearance-none"
                            >
                              <option>Technology</option>
                              <option>Business</option>
                              <option>Arts</option>
                              <option>Science</option>
                              <option>Lifestyle</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-widest">Level</label>
                            <select
                              value={courseData.level}
                              onChange={e => setCourseData({ ...courseData, level: e.target.value as any })}
                              className="w-full px-4 py-4 bg-slate-50 border-4 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all outline-none font-bold text-slate-700 text-lg appearance-none"
                            >
                              <option>Beginner</option>
                              <option>Intermediate</option>
                              <option>Advanced</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-widest">Tags / Keywords</label>
                          <input
                            type="text"
                            value={courseData.tags?.join(", ") || ""}
                            onChange={e => setCourseData({ ...courseData, tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) })}
                            placeholder="e.g. React, JavaScript, Frontend (comma separated)"
                            className="w-full px-4 py-4 bg-slate-50 border-4 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all outline-none font-bold text-slate-700 placeholder-slate-400 text-lg"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-widest">Cover Image</label>
                          {!courseData.image ? (
                            <div className="mt-2 flex justify-center rounded-3xl border-4 border-dashed border-slate-200 px-6 py-12 hover:border-indigo-400 hover:bg-indigo-50 transition-colors cursor-pointer group">
                              <div className="text-center">
                                <ImageIcon className="mx-auto h-12 w-12 text-slate-300 group-hover:text-indigo-400 transition-colors" aria-hidden="true" />
                                <div className="mt-4 flex text-sm leading-6 text-slate-600 justify-center">
                                  <label
                                    htmlFor="file-upload"
                                    className="relative cursor-pointer rounded-md font-bold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                  >
                                    <span>Upload a file</span>
                                    <input id="file-upload" name="file-upload" type="file" accept="image/*" className="sr-only" onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                          setCourseData({ ...courseData, image: reader.result as string });
                                        };
                                        reader.readAsDataURL(file);
                                      }
                                    }} />
                                  </label>
                                  <p className="pl-1 font-medium">or drag and drop</p>
                                </div>
                                <p className="text-xs leading-5 text-slate-500 font-medium mt-2">PNG, JPG, GIF up to 10MB</p>
                              </div>
                            </div>
                          ) : (
                            <div className="relative mt-2 rounded-3xl overflow-hidden border-4 border-slate-100 h-64 bg-slate-50 shadow-sm group">
                              <img src={courseData.image} alt="Preview" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button 
                                  onClick={() => setCourseData({ ...courseData, image: "" })}
                                  className="btn-fun bg-white text-rose-600 hover:bg-rose-50 px-6 py-3"
                                >
                                  Remove Image
                                </button>
                              </div>
                            </div>
                          )}
                          <div className="mt-4 flex gap-4">
                            <input
                              type="text"
                              value={courseData.image}
                              onChange={e => setCourseData({ ...courseData, image: e.target.value })}
                              placeholder="Or paste an image URL here..."
                              className="flex-1 px-4 py-3 bg-slate-50 border-4 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all outline-none font-bold text-slate-700 placeholder-slate-400 text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <h2 className="text-3xl font-black text-slate-900 mb-6">Publishing</h2>
                      <div className="card-fun bg-white p-6 space-y-6">
                        <h3 className="text-lg font-black text-slate-800">Checklist</h3>
                        <ul className="space-y-4">
                          <li className="flex items-center gap-3">
                            <div className={cn("w-6 h-6 rounded-full flex items-center justify-center", courseData.title ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400")}>
                              <Check className="w-4 h-4" />
                            </div>
                            <span className={cn("font-bold", courseData.title ? "text-slate-700" : "text-slate-400")}>Add a title</span>
                          </li>
                          <li className="flex items-center gap-3">
                            <div className={cn("w-6 h-6 rounded-full flex items-center justify-center", courseData.description ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400")}>
                              <Check className="w-4 h-4" />
                            </div>
                            <span className={cn("font-bold", courseData.description ? "text-slate-700" : "text-slate-400")}>Add a description</span>
                          </li>
                          <li className="flex items-center gap-3">
                            <div className={cn("w-6 h-6 rounded-full flex items-center justify-center", courseData.image ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400")}>
                              <Check className="w-4 h-4" />
                            </div>
                            <span className={cn("font-bold", courseData.image ? "text-slate-700" : "text-slate-400")}>Add a cover image</span>
                          </li>
                          <li className="flex items-center gap-3">
                            <div className={cn("w-6 h-6 rounded-full flex items-center justify-center", (courseData.lessons?.length || 0) > 0 ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400")}>
                              <Check className="w-4 h-4" />
                            </div>
                            <span className={cn("font-bold", (courseData.lessons?.length || 0) > 0 ? "text-slate-700" : "text-slate-400")}>Add at least 1 lesson</span>
                          </li>
                        </ul>
                        
                        <div className="pt-6 border-t-4 border-slate-100">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-black text-slate-500 uppercase tracking-widest">Completion</span>
                            <span className="text-sm font-black text-indigo-600">{Math.round(((courseData.title ? 1 : 0) + (courseData.description ? 1 : 0) + (courseData.image ? 1 : 0) + ((courseData.lessons?.length || 0) > 0 ? 1 : 0)) / 4 * 100)}%</span>
                          </div>
                          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                              style={{ width: `${((courseData.title ? 1 : 0) + (courseData.description ? 1 : 0) + (courseData.image ? 1 : 0) + ((courseData.lessons?.length || 0) > 0 ? 1 : 0)) / 4 * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="card-fun bg-indigo-600 p-6 text-white">
                        <h3 className="text-xl font-black mb-2 flex items-center gap-2">
                          <HelpCircle className="w-6 h-6" />
                          Creator Tips
                        </h3>
                        <p className="text-indigo-100 font-medium mb-4">
                          High-quality cover images and detailed descriptions increase enrollment by up to 300%.
                        </p>
                        <button className="w-full py-3 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-colors">
                          Read Creator Guide
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeMenu === "map" && (
                <motion.div
                  key="map"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-black text-slate-900">Progression Map</h2>
                    <button 
                      onClick={addLesson}
                      className="btn-fun-emerald px-6 py-3 flex items-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Add Lesson
                    </button>
                  </div>
                  
                  <div className="card-fun bg-white p-8 overflow-hidden">
                    <div className="relative py-8">
                      {/* Winding Path Line */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                        <path 
                          d="M 50,0 Q 50,100 200,100 T 350,200 T 200,300 T 50,400" 
                          fill="none" 
                          stroke="#E2E8F0" 
                          strokeWidth="8"
                          strokeLinecap="round"
                          className="path-line"
                        />
                      </svg>

                      <div className="relative z-10 space-y-16">
                        {courseData.lessons?.map((lesson, index) => {
                          // Alternate sides for the winding path effect
                          const isLeft = index % 2 === 0;
                          
                          return (
                            <div key={lesson.id} className={cn(
                              "flex items-center gap-6",
                              isLeft ? "flex-row" : "flex-row-reverse"
                            )}>
                              {/* Node */}
                              <div className="relative group cursor-pointer" onClick={() => setActiveMenu(lesson.id)}>
                                <div className={cn(
                                  "w-20 h-20 rounded-full flex items-center justify-center border-4 shadow-lg relative z-10 transition-all duration-300 group-hover:scale-110",
                                  "bg-white border-indigo-500 text-indigo-500"
                                )}>
                                  <span className="text-2xl font-black">{index + 1}</span>
                                </div>
                              </div>

                              {/* Content Card */}
                              <div 
                                className={cn(
                                  "flex-1 max-w-sm bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-[0_8px_0_rgb(226,232,240)] cursor-pointer hover:border-indigo-300 hover:shadow-[0_8px_0_rgb(199,210,254)] transition-all group",
                                  isLeft ? "text-left" : "text-right"
                                )}
                                onClick={() => setActiveMenu(lesson.id)}
                              >
                                <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                                  {lesson.title}
                                </h3>
                                <div className={cn(
                                  "flex items-center gap-4 text-sm font-bold text-slate-500",
                                  isLeft ? "justify-start" : "justify-end"
                                )}>
                                  <span className="flex items-center gap-1">
                                    <ListVideo className="w-4 h-4" />
                                    {lesson.duration}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <HelpCircle className="w-4 h-4" />
                                    {lesson.questions?.length || 0} Questions
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        {courseData.lessons?.length === 0 && (
                          <div className="text-center py-16 px-4 border-4 border-dashed border-slate-200 rounded-3xl bg-slate-50 relative z-10">
                            <div className="w-20 h-20 bg-indigo-100 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 transform rotate-12">
                              <Map className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-800 mb-3">Your Map is Empty</h3>
                            <p className="text-lg text-slate-500 font-bold max-w-md mx-auto mb-8">Add lessons to your curriculum to see them appear on the progression map.</p>
                            <button onClick={addLesson} className="btn-fun-indigo px-8 py-4 text-lg">
                              Add First Lesson
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeMenu === "settings" && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
                      <Settings className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-slate-900">Course Settings</h2>
                      <p className="text-slate-500 font-bold">Configure pricing, visibility, and other options</p>
                    </div>
                  </div>

                  <div className="card-fun bg-white p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b-4 border-slate-100">
                          <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                            <span className="font-black text-sm">$</span>
                          </div>
                          <h3 className="text-lg font-black text-slate-800">Pricing & Access</h3>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-widest">Price (Tokens)</label>
                          <input
                            type="number"
                            value={courseData.price}
                            onChange={e => setCourseData({ ...courseData, price: Number(e.target.value) })}
                            className="w-full px-4 py-4 bg-slate-50 border-4 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all outline-none font-bold text-slate-700 text-lg"
                          />
                          <p className="text-sm font-bold text-slate-400 mt-3">Set to 0 to make the course free.</p>
                        </div>

                        <div>
                          <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-widest">Visibility</label>
                          <select
                            value={courseData.visibility || 'public'}
                            onChange={e => setCourseData({ ...courseData, visibility: e.target.value as 'public' | 'unlisted' | 'private' })}
                            className="w-full px-4 py-4 bg-slate-50 border-4 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all outline-none font-bold text-slate-700 text-lg appearance-none"
                          >
                            <option value="public">Public (Marketplace)</option>
                            <option value="unlisted">Unlisted (Link Only)</option>
                            <option value="private">Private (Only Me)</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b-4 border-slate-100">
                          <div className="w-8 h-8 bg-sky-100 text-sky-600 rounded-lg flex items-center justify-center">
                            <Map className="w-4 h-4" />
                          </div>
                          <h3 className="text-lg font-black text-slate-800">Display & Format</h3>
                        </div>

                        <div>
                          <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-widest">UI Style</label>
                          <select
                            value={courseData.uiStyle || 'standard'}
                            onChange={e => setCourseData({ ...courseData, uiStyle: e.target.value as 'standard' | 'progression-map' })}
                            className="w-full px-4 py-4 bg-slate-50 border-4 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all outline-none font-bold text-slate-700 text-lg appearance-none"
                          >
                            <option value="standard">Standard List</option>
                            <option value="progression-map">Progression Map / Level Map</option>
                          </select>
                          <p className="text-sm font-bold text-slate-400 mt-3">Choose how the lessons are displayed to students.</p>
                        </div>

                        <div>
                          <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-widest">Language</label>
                          <select
                            value={courseData.language || 'English'}
                            onChange={e => setCourseData({ ...courseData, language: e.target.value })}
                            className="w-full px-4 py-4 bg-slate-50 border-4 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all outline-none font-bold text-slate-700 text-lg appearance-none"
                          >
                            <option value="English">English</option>
                            <option value="Spanish">Spanish</option>
                            <option value="French">French</option>
                            <option value="German">German</option>
                            <option value="Chinese">Chinese</option>
                            <option value="Japanese">Japanese</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t-4 border-slate-100">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-widest">Estimated Total Time</label>
                          <input
                            type="text"
                            value={courseData.estimatedTime || ""}
                            onChange={e => setCourseData({ ...courseData, estimatedTime: e.target.value })}
                            placeholder="e.g. 4 hours 30 mins"
                            className="w-full px-4 py-4 bg-slate-50 border-4 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all outline-none font-bold text-slate-700 text-lg"
                          />
                        </div>

                        <div className="flex flex-col justify-end">
                          <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-widest">Certification</label>
                          <div className="flex items-center gap-4 p-4 bg-slate-50 border-4 border-slate-100 rounded-2xl h-[60px]">
                            <input
                              type="checkbox"
                              id="certificate"
                              checked={courseData.certificate || false}
                              onChange={e => setCourseData({ ...courseData, certificate: e.target.checked })}
                              className="w-6 h-6 text-indigo-600 rounded-xl border-slate-300 focus:ring-indigo-500"
                            />
                            <label htmlFor="certificate" className="text-lg font-bold text-slate-700 cursor-pointer select-none">
                              Offer Certificate of Completion
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {onDelete && courseData.id && (
                      <div className="mt-8 pt-8 border-t-4 border-rose-100">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-8 h-8 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center">
                            <Trash2 className="w-4 h-4" />
                          </div>
                          <h3 className="text-xl font-black text-rose-600">Danger Zone</h3>
                        </div>
                        <p className="text-slate-500 font-bold mb-6">Once you delete a course, there is no going back. Please be certain.</p>
                        <button
                          onClick={() => setShowDeleteConfirm(true)}
                          className="btn-fun bg-rose-100 text-rose-700 hover:bg-rose-200 px-8 py-4 flex items-center gap-3 text-lg"
                        >
                          <Trash2 className="w-6 h-6" />
                          Delete Course
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeLesson && (
                <motion.div
                  key={activeLesson.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-black text-slate-900">Edit Lesson</h2>
                        <p className="text-slate-500 font-bold">Configure content and interactive elements</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                        <button 
                          onClick={() => {
                            const idx = courseData.lessons?.findIndex(l => l.id === activeLesson.id) ?? -1;
                            if (idx > 0) {
                              const newLessons = [...(courseData.lessons || [])];
                              const temp = newLessons[idx];
                              newLessons[idx] = newLessons[idx - 1];
                              newLessons[idx - 1] = temp;
                              setCourseData({ ...courseData, lessons: newLessons });
                            }
                          }}
                          disabled={courseData.lessons?.findIndex(l => l.id === activeLesson.id) === 0}
                          className="p-2 text-slate-500 hover:bg-white hover:text-indigo-600 rounded-lg transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-slate-500"
                          title="Move Up"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                        </button>
                        <button 
                          onClick={() => {
                            const idx = courseData.lessons?.findIndex(l => l.id === activeLesson.id) ?? -1;
                            if (idx < (courseData.lessons?.length || 0) - 1) {
                              const newLessons = [...(courseData.lessons || [])];
                              const temp = newLessons[idx];
                              newLessons[idx] = newLessons[idx + 1];
                              newLessons[idx + 1] = temp;
                              setCourseData({ ...courseData, lessons: newLessons });
                            }
                          }}
                          disabled={courseData.lessons?.findIndex(l => l.id === activeLesson.id) === (courseData.lessons?.length || 0) - 1}
                          className="p-2 text-slate-500 hover:bg-white hover:text-indigo-600 rounded-lg transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-slate-500"
                          title="Move Down"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </button>
                      </div>
                      <button 
                        onClick={() => setLessonToDelete(activeLesson.id)}
                        className="p-3 text-rose-500 hover:bg-rose-100 rounded-xl transition-colors"
                        title="Delete Lesson"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                      <div className="card-fun bg-white p-8 space-y-6">
                        <div className="flex items-center gap-3 mb-6 pb-6 border-b-4 border-slate-100">
                          <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                            <Settings className="w-5 h-5" />
                          </div>
                          <h3 className="text-xl font-black text-slate-800">Basic Details</h3>
                        </div>

                        <div>
                          <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-widest">Lesson Title</label>
                          <input
                            type="text"
                            value={activeLesson.title}
                            onChange={e => updateLesson(activeLesson.id, { title: e.target.value })}
                            placeholder="e.g. Introduction to the Course"
                            className="w-full px-4 py-4 bg-slate-50 border-4 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all outline-none font-bold text-slate-700 text-xl"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-widest">Duration</label>
                            <input
                              type="text"
                              value={activeLesson.duration}
                              onChange={e => updateLesson(activeLesson.id, { duration: e.target.value })}
                              placeholder="e.g. 10:00"
                              className="w-full px-4 py-4 bg-slate-50 border-4 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all outline-none font-bold text-slate-700 text-lg"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-widest">Video URL (Optional)</label>
                            <input
                              type="text"
                              value={activeLesson.videoUrl || ""}
                              onChange={e => updateLesson(activeLesson.id, { videoUrl: e.target.value })}
                              placeholder="https://youtube.com/..."
                              className="w-full px-4 py-4 bg-slate-50 border-4 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all outline-none font-bold text-slate-700 text-lg"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="card-fun bg-white p-8 space-y-6">
                        <div className="flex items-center gap-3 mb-6 pb-6 border-b-4 border-slate-100">
                          <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                            <BookOpen className="w-5 h-5" />
                          </div>
                          <h3 className="text-xl font-black text-slate-800">Lesson Content</h3>
                        </div>

                        <div>
                          <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-widest">Content (Markdown)</label>
                          <div data-color-mode="light">
                            <MDEditor
                              value={activeLesson.content}
                              onChange={(val) => {
                                let newValue = val || '';
                                // Handle slash commands
                                if (newValue.match(/(^|\n|\s)\/3d$/)) {
                                  newValue = newValue.replace(/\/3d$/, '\n```3d-model\nhttps://example.com/model.glb\n```\n');
                                } else if (newValue.match(/(^|\n|\s)\/math$/)) {
                                  newValue = newValue.replace(/\/math$/, '\n```math\nE = mc^2\n```\n');
                                }
                                updateLesson(activeLesson.id, { content: newValue });
                              }}
                              preview="edit"
                              height={400}
                              className="w-full bg-slate-50 border-4 border-slate-100 rounded-2xl overflow-hidden focus-within:ring-4 focus-within:ring-indigo-500/20 focus-within:border-indigo-400 transition-all font-mono text-sm"
                              previewOptions={{
                                components: {
                                  code: ({ inline, className, children, ...props }: any) => {
                                    const match = /language-(\w+)/.exec(className || '');
                                    if (!inline && match && match[1] === '3d-model') {
                                      return (
                                        <div className="w-full h-64 bg-slate-100 rounded-xl relative overflow-hidden my-4">
                                          {/* @ts-ignore */}
                                          <model-viewer src={String(children).trim()} auto-rotate camera-controls style={{ width: '100%', height: '100%' }}></model-viewer>
                                        </div>
                                      );
                                    }
                                    if (!inline && match && match[1] === 'math') {
                                      return (
                                        <div className="p-4 bg-slate-50 rounded-xl overflow-x-auto my-4">
                                          <BlockMath math={String(children).trim()} />
                                        </div>
                                      );
                                    }
                                    return <code className={className} {...props}>{children}</code>;
                                  }
                                }
                              }}
                            />
                            <p className="text-xs font-bold text-slate-400 mt-2">Tip: Type <code className="bg-slate-200 px-1 rounded">/3d</code> or <code className="bg-slate-200 px-1 rounded">/math</code> to insert interactive blocks.</p>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-widest">Mindmap (Mermaid Syntax)</label>
                          <textarea
                            value={activeLesson.mindmap || ""}
                            onChange={e => updateLesson(activeLesson.id, { mindmap: e.target.value })}
                            placeholder="e.g. mindmap\n  Root\n    Child 1\n    Child 2"
                            className="w-full px-4 py-4 bg-slate-50 border-4 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all outline-none font-mono text-slate-700 text-sm h-32"
                          />
                          <p className="text-xs font-bold text-slate-400 mt-2">Use Mermaid.js syntax to create a mindmap for your students.</p>
                        </div>

                        <div>
                          <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-widest">Tutor Notes</label>
                          <div data-color-mode="light">
                            <MDEditor
                              value={activeLesson.tutorNotes || ""}
                              onChange={(val) => updateLesson(activeLesson.id, { tutorNotes: val || '' })}
                              preview="edit"
                              height={200}
                              className="w-full bg-slate-50 border-4 border-slate-100 rounded-2xl overflow-hidden focus-within:ring-4 focus-within:ring-indigo-500/20 focus-within:border-indigo-400 transition-all font-mono text-sm"
                            />
                            <p className="text-xs font-bold text-slate-400 mt-2">Add extra notes, tips, or summaries for your students.</p>
                          </div>
                        </div>
                      </div>

                      {/* Questions Section */}
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
                              <HelpCircle className="w-5 h-5" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900">Interactive Questions</h3>
                          </div>
                          <button 
                            onClick={() => addQuestion(activeLesson.id)}
                            className="btn-fun-emerald px-6 py-3 flex items-center gap-2"
                          >
                            <Plus className="w-5 h-5" />
                            Add Question
                          </button>
                        </div>

                        {activeLesson.questions?.length === 0 && (
                          <div className="text-center py-12 px-4 border-4 border-dashed border-slate-200 rounded-3xl bg-slate-50">
                            <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                              <HelpCircle className="w-8 h-8" />
                            </div>
                            <h4 className="text-lg font-black text-slate-700 mb-2">No questions yet</h4>
                            <p className="text-slate-500 font-bold max-w-sm mx-auto mb-6">Add interactive questions to test your students' knowledge and keep them engaged.</p>
                            <button onClick={() => addQuestion(activeLesson.id)} className="btn-fun-amber px-6 py-3">
                              Create First Question
                            </button>
                          </div>
                        )}

                    {activeLesson.questions?.map((q, qIndex) => (
                      <div key={q.id} className="card-fun bg-white p-8 space-y-6 relative group">
                        <button 
                          onClick={() => setQuestionToDelete({ lessonId: activeLesson.id, questionId: q.id })}
                          className="absolute top-6 right-6 p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-100 rounded-2xl transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-black text-lg">
                            {qIndex + 1}
                          </div>
                          <select
                            value={q.type}
                            onChange={e => {
                              const newType = e.target.value as any;
                              let updates: Partial<Question> = { type: newType };
                              if (newType === 'multiple-choice' || newType === 'poll') {
                                updates.options = q.options && q.options.length > 0 ? q.options : ['Option 1', 'Option 2'];
                                if (newType === 'multiple-choice' && !updates.options.includes(q.correctAnswer || '')) {
                                  updates.correctAnswer = updates.options[0];
                                }
                              } else if (newType === 'true-false') {
                                updates.correctAnswer = ['True', 'False'].includes(q.correctAnswer || '') ? q.correctAnswer : 'True';
                              } else if (newType === 'flashcard') {
                                updates.front = q.front || 'Term';
                                updates.back = q.back || 'Definition';
                              } else if (newType === 'checklist') {
                                updates.items = q.items && q.items.length > 0 ? q.items : ['Item 1', 'Item 2'];
                              }
                              updateQuestion(activeLesson.id, q.id, updates);
                            }}
                            className="px-4 py-2 bg-slate-50 border-4 border-slate-100 rounded-xl text-sm font-black text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-400 appearance-none"
                          >
                            <option value="multiple-choice">Multiple Choice</option>
                            <option value="text">Text Input</option>
                            <option value="true-false">True / False</option>
                            <option value="flashcard">Flashcard</option>
                            <option value="checklist">Checklist</option>
                            <option value="poll">Poll</option>
                          </select>
                        </div>

                        <div>
                          <input
                            type="text"
                            value={q.question}
                            onChange={e => updateQuestion(activeLesson.id, q.id, { question: e.target.value })}
                            placeholder={q.type === 'flashcard' ? "Flashcard Title (Optional)" : q.type === 'checklist' ? "Checklist Title" : "Enter your question..."}
                            className="w-full px-4 py-4 bg-slate-50 border-4 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all outline-none font-bold text-xl"
                          />
                        </div>

                        {q.type === 'multiple-choice' && (
                          <div className="space-y-4 pl-14">
                            {q.options?.map((opt, oIndex) => (
                              <div key={oIndex} className="flex items-center gap-4">
                                <input 
                                  type="radio" 
                                  name={`correct-${q.id}`}
                                  checked={q.correctAnswer === opt}
                                  onChange={() => updateQuestion(activeLesson.id, q.id, { correctAnswer: opt })}
                                  className="w-6 h-6 text-emerald-500 border-2 border-slate-300 focus:ring-emerald-500 cursor-pointer"
                                />
                                <input
                                  type="text"
                                  value={opt}
                                  onChange={e => {
                                    const newOptions = [...(q.options || [])];
                                    newOptions[oIndex] = e.target.value;
                                    // Update correct answer if it was this option
                                    const newCorrect = q.correctAnswer === opt ? e.target.value : q.correctAnswer;
                                    updateQuestion(activeLesson.id, q.id, { options: newOptions, correctAnswer: newCorrect });
                                  }}
                                  className="flex-1 px-4 py-3 bg-white border-4 border-slate-100 rounded-xl focus:outline-none focus:border-indigo-400 transition-colors text-base font-bold"
                                />
                                <button 
                                  onClick={() => {
                                    const newOptions = q.options?.filter((_, i) => i !== oIndex);
                                    updateQuestion(activeLesson.id, q.id, { options: newOptions });
                                  }}
                                  className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                                >
                                  <X className="w-5 h-5" />
                                </button>
                              </div>
                            ))}
                            <button 
                              onClick={() => {
                                const newOptions = [...(q.options || []), `Option ${(q.options?.length || 0) + 1}`];
                                updateQuestion(activeLesson.id, q.id, { options: newOptions });
                              }}
                              className="text-base font-black text-indigo-500 hover:text-indigo-600 transition-colors ml-10"
                            >
                              + Add Option
                            </button>
                          </div>
                        )}
                        
                        {q.type === 'text' && (
                          <div className="pl-14">
                            <label className="block text-sm font-black text-slate-500 mb-2 uppercase tracking-widest">Correct Answer (Exact match)</label>
                            <input
                              type="text"
                              value={q.correctAnswer || ""}
                              onChange={e => updateQuestion(activeLesson.id, q.id, { correctAnswer: e.target.value })}
                              placeholder="Enter the correct answer..."
                              className="w-full px-4 py-4 bg-white border-4 border-slate-100 rounded-xl focus:outline-none focus:border-indigo-400 transition-colors text-base font-bold"
                            />
                          </div>
                        )}

                        {q.type === 'true-false' && (
                          <div className="space-y-4 pl-14">
                            {['True', 'False'].map((opt) => (
                              <div key={opt} className="flex items-center gap-4">
                                <input 
                                  type="radio" 
                                  name={`correct-${q.id}`}
                                  checked={q.correctAnswer === opt}
                                  onChange={() => updateQuestion(activeLesson.id, q.id, { correctAnswer: opt })}
                                  className="w-6 h-6 text-emerald-500 border-2 border-slate-300 focus:ring-emerald-500 cursor-pointer"
                                />
                                <span className="text-lg font-black text-slate-700">{opt}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {q.type === 'flashcard' && (
                          <div className="space-y-6 pl-14">
                            <div>
                              <label className="block text-sm font-black text-slate-500 mb-2 uppercase tracking-widest">Front (Term)</label>
                              <input
                                type="text"
                                value={q.front || ""}
                                onChange={e => updateQuestion(activeLesson.id, q.id, { front: e.target.value })}
                                placeholder="Enter the term..."
                                className="w-full px-4 py-4 bg-white border-4 border-slate-100 rounded-xl focus:outline-none focus:border-indigo-400 transition-colors text-base font-bold"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-black text-slate-500 mb-2 uppercase tracking-widest">Back (Definition)</label>
                              <textarea
                                value={q.back || ""}
                                onChange={e => updateQuestion(activeLesson.id, q.id, { back: e.target.value })}
                                placeholder="Enter the definition..."
                                rows={3}
                                className="w-full px-4 py-4 bg-white border-4 border-slate-100 rounded-xl focus:outline-none focus:border-indigo-400 transition-colors text-base font-bold resize-y"
                              />
                            </div>
                          </div>
                        )}

                        {q.type === 'checklist' && (
                          <div className="space-y-4 pl-14">
                            {q.items?.map((item, iIndex) => (
                              <div key={iIndex} className="flex items-center gap-4">
                                <div className="w-6 h-6 border-4 border-slate-200 rounded-md flex-shrink-0" />
                                <input
                                  type="text"
                                  value={item}
                                  onChange={e => {
                                    const newItems = [...(q.items || [])];
                                    newItems[iIndex] = e.target.value;
                                    updateQuestion(activeLesson.id, q.id, { items: newItems });
                                  }}
                                  placeholder="Checklist item..."
                                  className="flex-1 px-4 py-3 bg-white border-4 border-slate-100 rounded-xl focus:outline-none focus:border-indigo-400 transition-colors text-base font-bold"
                                />
                                <button 
                                  onClick={() => {
                                    const newItems = q.items?.filter((_, i) => i !== iIndex);
                                    updateQuestion(activeLesson.id, q.id, { items: newItems });
                                  }}
                                  className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                                >
                                  <X className="w-5 h-5" />
                                </button>
                              </div>
                            ))}
                            <button 
                              onClick={() => {
                                const newItems = [...(q.items || []), "New Item"];
                                updateQuestion(activeLesson.id, q.id, { items: newItems });
                              }}
                              className="text-base font-black text-indigo-500 hover:text-indigo-600 transition-colors ml-10"
                            >
                              + Add Item
                            </button>
                          </div>
                        )}

                        {q.type === 'poll' && (
                          <div className="space-y-4 pl-14">
                            {q.options?.map((opt, oIndex) => (
                              <div key={oIndex} className="flex items-center gap-4">
                                <div className="w-6 h-6 rounded-full border-4 border-slate-200 flex-shrink-0" />
                                <input
                                  type="text"
                                  value={opt}
                                  onChange={e => {
                                    const newOptions = [...(q.options || [])];
                                    newOptions[oIndex] = e.target.value;
                                    updateQuestion(activeLesson.id, q.id, { options: newOptions });
                                  }}
                                  placeholder={`Poll Option ${oIndex + 1}`}
                                  className="flex-1 px-4 py-3 bg-white border-4 border-slate-100 rounded-xl focus:outline-none focus:border-indigo-400 transition-colors text-base font-bold"
                                />
                                <button 
                                  onClick={() => {
                                    const newOptions = q.options?.filter((_, i) => i !== oIndex);
                                    updateQuestion(activeLesson.id, q.id, { options: newOptions });
                                  }}
                                  className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                                >
                                  <X className="w-5 h-5" />
                                </button>
                              </div>
                            ))}
                            <button 
                              onClick={() => {
                                const newOptions = [...(q.options || []), `Option ${(q.options?.length || 0) + 1}`];
                                updateQuestion(activeLesson.id, q.id, { options: newOptions });
                              }}
                              className="text-base font-black text-indigo-500 hover:text-indigo-600 transition-colors ml-10"
                            >
                              + Add Option
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sidebar for Lesson */}
                <div className="space-y-6">
                  <div className="card-fun bg-white p-6 space-y-6">
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b-4 border-slate-100">
                      <div className="w-8 h-8 bg-sky-100 text-sky-600 rounded-lg flex items-center justify-center">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                      <h3 className="text-lg font-black text-slate-800">Resources</h3>
                    </div>

                    <div className="space-y-4">
                      {activeLesson.resources?.map((res, rIndex) => (
                        <div key={rIndex} className="bg-slate-50 p-4 rounded-2xl border-4 border-slate-100 space-y-3 relative group">
                          <button 
                            onClick={() => {
                              const newResources = activeLesson.resources?.filter((_, i) => i !== rIndex);
                              updateLesson(activeLesson.id, { resources: newResources });
                            }}
                            className="absolute top-2 right-2 p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <div>
                            <label className="block text-xs font-black text-slate-500 mb-1 uppercase tracking-widest">Title</label>
                            <input
                              type="text"
                              value={res.title}
                              onChange={e => {
                                const newResources = [...(activeLesson.resources || [])];
                                newResources[rIndex].title = e.target.value;
                                updateLesson(activeLesson.id, { resources: newResources });
                              }}
                              placeholder="e.g. Cheat Sheet PDF"
                              className="w-full px-3 py-2 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 font-bold text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-black text-slate-500 mb-1 uppercase tracking-widest">URL</label>
                            <input
                              type="text"
                              value={res.url}
                              onChange={e => {
                                const newResources = [...(activeLesson.resources || [])];
                                newResources[rIndex].url = e.target.value;
                                updateLesson(activeLesson.id, { resources: newResources });
                              }}
                              placeholder="https://..."
                              className="w-full px-3 py-2 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 font-bold text-sm"
                            />
                          </div>
                        </div>
                      ))}

                      <button 
                        onClick={() => {
                          const newResources = [...(activeLesson.resources || []), { title: 'New Resource', url: '' }];
                          updateLesson(activeLesson.id, { resources: newResources });
                        }}
                        className="w-full py-3 border-4 border-dashed border-slate-200 rounded-2xl text-slate-500 font-bold hover:bg-slate-50 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Resource
                      </button>
                    </div>
                  </div>

                  <div className="card-fun bg-indigo-50 p-6 border-indigo-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-indigo-200 text-indigo-700 rounded-lg flex items-center justify-center">
                        <HelpCircle className="w-4 h-4" />
                      </div>
                      <h3 className="text-lg font-black text-indigo-900">Lesson Tips</h3>
                    </div>
                    <ul className="space-y-3 text-sm font-bold text-indigo-700/80">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 text-indigo-500 flex-shrink-0" />
                        Keep videos under 10 minutes for better retention.
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 text-indigo-500 flex-shrink-0" />
                        Use Markdown to format your text with headings and bold text.
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 text-indigo-500 flex-shrink-0" />
                        Add at least one interactive question to test knowledge.
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 text-indigo-500 flex-shrink-0" />
                        Teaching STEM? Use the "Math Equation" and "3D Model" interactive blocks!
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
            </AnimatePresence>
          </div>
        </main>
      </div>
      
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border-4 border-slate-100"
          >
            <h3 className="text-2xl font-black text-slate-900 mb-4">Delete Course?</h3>
            <p className="text-slate-600 font-medium mb-8">
              Are you sure you want to delete "{courseData.title || 'this course'}"? This action cannot be undone.
            </p>
            <div className="flex gap-4 justify-end">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="px-6 py-3 rounded-2xl font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setShowDeleteConfirm(false);
                  if (courseData.id) onDelete(courseData.id);
                }}
                className="px-6 py-3 rounded-2xl font-bold bg-rose-500 text-white hover:bg-rose-600 transition-colors shadow-sm"
              >
                Yes, Delete Course
              </button>
            </div>
          </motion.div>
        </div>
      )}
      {lessonToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border-4 border-slate-100"
          >
            <h3 className="text-2xl font-black text-slate-900 mb-4">Delete Lesson?</h3>
            <p className="text-slate-600 font-medium mb-8">
              Are you sure you want to delete this lesson? This action cannot be undone.
            </p>
            <div className="flex gap-4 justify-end">
              <button 
                onClick={() => setLessonToDelete(null)}
                className="px-6 py-3 rounded-2xl font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  deleteLesson(lessonToDelete);
                  setLessonToDelete(null);
                }}
                className="px-6 py-3 rounded-2xl font-bold bg-rose-500 text-white hover:bg-rose-600 transition-colors shadow-sm"
              >
                Yes, Delete Lesson
              </button>
            </div>
          </motion.div>
        </div>
      )}
      {questionToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border-4 border-slate-100"
          >
            <h3 className="text-2xl font-black text-slate-900 mb-4">Delete Question?</h3>
            <p className="text-slate-600 font-medium mb-8">
              Are you sure you want to delete this question? This action cannot be undone.
            </p>
            <div className="flex gap-4 justify-end">
              <button 
                onClick={() => setQuestionToDelete(null)}
                className="px-6 py-3 rounded-2xl font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  deleteQuestion(questionToDelete.lessonId, questionToDelete.questionId);
                  setQuestionToDelete(null);
                }}
                className="px-6 py-3 rounded-2xl font-bold bg-rose-500 text-white hover:bg-rose-600 transition-colors shadow-sm"
              >
                Yes, Delete Question
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
