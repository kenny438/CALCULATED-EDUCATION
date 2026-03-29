import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, XCircle, ArrowRight, CheckCircle, RotateCcw, CheckCircle2 } from 'lucide-react';
import Markdown from 'react-markdown';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import '@google/model-viewer';
import { Lesson, Question } from '../data/mockData';
import { cn } from '../lib/utils';
import { Mermaid } from './Mermaid';

interface LessonPlayerProps {
  lesson: Lesson;
  onClose: () => void;
  onComplete: () => void;
}

export function LessonPlayer({ lesson, onClose, onComplete }: LessonPlayerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checkedState, setCheckedState] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  
  // Interactive states
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [checkedItems, setCheckedItems] = useState<Record<string, Record<number, boolean>>>({});

  const steps = [
    ...((lesson.content || lesson.videoUrl || lesson.mindmap || lesson.tutorNotes || (lesson.resources && lesson.resources.length > 0)) ? [{ type: 'content', id: 'content' }] : []),
    ...(lesson.questions || []).map(q => ({ type: 'question', id: q.id, question: q }))
  ];

  const step = steps[currentStep];
  
  if (!step) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">This lesson is empty.</h2>
        <button onClick={onComplete} className="px-8 py-3 bg-indigo-500 text-white rounded-xl font-bold hover:bg-indigo-600 transition-colors">
          Complete Lesson
        </button>
      </div>
    );
  }

  const isQuestion = step?.type === 'question';
  const q = isQuestion && 'question' in step ? step.question as Question : null;

  const progress = ((currentStep) / steps.length) * 100;

  const isGradable = q && ['multiple-choice', 'text', 'true-false'].includes(q.type);
  const hasAnsweredCurrent = q ? !!answers[q.id] : true;

  const handleCheck = () => {
    if (!q || !isGradable) {
      handleContinue();
      return;
    }

    const userAnswer = answers[q.id];
    if (!userAnswer) return;

    const isCorrect = (userAnswer || "").trim().toLowerCase() === (q.correctAnswer || "").trim().toLowerCase();
    setCheckedState(isCorrect ? 'correct' : 'incorrect');
  };

  const handleContinue = () => {
    if (checkedState === 'incorrect') {
      // Reset to try again
      setCheckedState('idle');
      setAnswers(prev => ({ ...prev, [q!.id]: '' }));
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      setCheckedState('idle');
    } else {
      onComplete();
    }
  };

  const toggleChecklistItem = (questionId: string, itemIndex: number) => {
    setCheckedItems(prev => ({
      ...prev,
      [questionId]: {
        ...(prev[questionId] || {}),
        [itemIndex]: !prev[questionId]?.[itemIndex]
      }
    }));
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col font-sans">
      {/* Top Bar */}
      <div className="h-20 flex items-center px-4 md:px-8 gap-6 flex-shrink-0 border-b-2 border-slate-200 bg-white">
        <motion.button 
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-2xl transition-colors"
        >
          <X className="w-6 h-6" />
        </motion.button>
        <div className="flex-1 max-w-2xl mx-auto">
          <div className="h-4 bg-slate-100 rounded-full overflow-hidden border-2 border-slate-200">
            <motion.div 
              className="h-full bg-emerald-400 rounded-full relative"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-white/30 rounded-full mx-1 mt-0.5" />
            </motion.div>
          </div>
        </div>
        <div className="w-12" /> {/* Spacer for balance */}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto pb-32 bg-indigo-50/30">
        <div className="max-w-2xl mx-auto px-6 py-8 md:py-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {step.type === 'content' && (
                <div className="space-y-8">
                  {lesson.videoUrl && (
                    <div className="rounded-3xl overflow-hidden border-4 border-slate-200 shadow-[0_8px_0_rgb(226,232,240)] bg-black aspect-video relative">
                      {lesson.videoUrl.includes('youtube.com') || lesson.videoUrl.includes('youtu.be') ? (
                        <iframe 
                          src={lesson.videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')} 
                          className="absolute inset-0 w-full h-full"
                          allowFullScreen
                        />
                      ) : (
                        <video src={lesson.videoUrl} controls className="absolute inset-0 w-full h-full object-contain" />
                      )}
                    </div>
                  )}
                  
                  {lesson.mindmap && (
                    <div className="bg-white p-8 rounded-3xl border-2 border-slate-200 shadow-[0_8px_0_rgb(226,232,240)]">
                      <h3 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                        </div>
                        Lesson Mindmap
                      </h3>
                      <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-100 overflow-hidden">
                        <Mermaid chart={lesson.mindmap} />
                      </div>
                    </div>
                  )}

                  {lesson.content && (
                    <div className="prose prose-lg prose-slate max-w-none prose-headings:font-black prose-p:text-slate-700 prose-p:leading-relaxed bg-white p-8 rounded-3xl border-2 border-slate-200 shadow-[0_8px_0_rgb(226,232,240)]">
                      <Markdown
                        components={{
                          code: ({ inline, className, children, ...props }: any) => {
                            const match = /language-(\w+)/.exec(className || '');
                            if (!inline && match && match[1] === '3d-model') {
                              return (
                                <div className="w-full h-80 bg-slate-100 rounded-2xl relative overflow-hidden my-6 border-4 border-slate-200">
                                  {/* @ts-ignore */}
                                  <model-viewer src={String(children).trim()} auto-rotate camera-controls style={{ width: '100%', height: '100%' }}></model-viewer>
                                </div>
                              );
                            }
                            if (!inline && match && match[1] === 'math') {
                              return (
                                <div className="p-6 bg-slate-50 rounded-2xl overflow-x-auto my-6 border-4 border-slate-100">
                                  <BlockMath math={String(children).trim()} />
                                </div>
                              );
                            }
                            return <code className={className} {...props}>{children}</code>;
                          }
                        }}
                      >
                        {lesson.content}
                      </Markdown>
                    </div>
                  )}

                  {lesson.tutorNotes && (
                    <div className="bg-amber-50 p-8 rounded-3xl border-2 border-amber-200 shadow-[0_8px_0_rgb(253,230,138)]">
                      <h3 className="text-xl font-black text-amber-900 mb-4 flex items-center gap-2">
                        <div className="w-8 h-8 bg-amber-200 text-amber-700 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </div>
                        Tutor Notes
                      </h3>
                      <div className="prose prose-amber max-w-none prose-p:text-amber-800 prose-headings:text-amber-900">
                        <Markdown>{lesson.tutorNotes}</Markdown>
                      </div>
                    </div>
                  )}

                  {lesson.resources && lesson.resources.length > 0 && (
                    <div className="bg-indigo-50 p-8 rounded-3xl border-2 border-indigo-100 shadow-[0_8px_0_rgb(224,231,255)]">
                      <h3 className="text-xl font-black text-indigo-900 mb-4 flex items-center gap-2">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Downloadable Resources
                      </h3>
                      <div className="grid gap-3">
                        {lesson.resources.map((res, idx) => (
                          <a 
                            key={idx}
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-4 bg-white rounded-2xl border-2 border-indigo-100 hover:border-indigo-300 hover:shadow-sm transition-all group"
                          >
                            <span className="font-bold text-indigo-700 group-hover:text-indigo-800">{res.title}</span>
                            <ArrowRight className="w-5 h-5 text-indigo-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-transform" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {isQuestion && q && (
                <div className="space-y-8">
                  {q.type !== 'flashcard' && (
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
                      {q.question}
                    </h2>
                  )}

                  {/* Multiple Choice & True/False */}
                  {(q.type === 'multiple-choice' || q.type === 'true-false') && (
                    <div className="space-y-4">
                      {(q.type === 'true-false' ? ['True', 'False'] : (q.options || [])).map((option, oIndex) => {
                        const isSelected = answers[q.id] === option;
                        const showCorrect = checkedState === 'correct' && isSelected;
                        const showIncorrect = checkedState === 'incorrect' && isSelected;

                        return (
                          <button
                            key={oIndex}
                            onClick={() => checkedState === 'idle' && setAnswers(prev => ({ ...prev, [q.id]: option }))}
                            disabled={checkedState !== 'idle'}
                            className={cn(
                              "w-full text-left p-5 md:p-6 rounded-3xl border-2 transition-all duration-200 relative overflow-hidden group",
                              checkedState === 'idle' ? (
                                isSelected 
                                  ? "border-indigo-500 bg-indigo-50 shadow-[0_6px_0_rgb(99,102,241)] -translate-y-1" 
                                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-[0_6px_0_rgb(226,232,240)] -translate-y-1 bg-white"
                              ) : (
                                showCorrect ? "border-emerald-500 bg-emerald-50 text-emerald-900 shadow-[0_6px_0_rgb(16,185,129)] -translate-y-1" :
                                showIncorrect ? "border-rose-500 bg-rose-50 text-rose-900 shadow-[0_6px_0_rgb(244,63,94)] -translate-y-1" :
                                "border-slate-200 opacity-50 bg-white"
                              )
                            )}
                          >
                            <div className="flex items-center gap-5">
                              <div className={cn(
                                "w-8 h-8 rounded-xl border-2 flex items-center justify-center flex-shrink-0 transition-colors",
                                isSelected ? "border-indigo-500 bg-white" : "border-slate-300 bg-white",
                                showCorrect && "border-emerald-500 bg-emerald-500",
                                showIncorrect && "border-rose-500 bg-rose-500"
                              )}>
                                {showCorrect && <Check className="w-5 h-5 text-white" />}
                                {showIncorrect && <X className="w-5 h-5 text-white" />}
                                {isSelected && checkedState === 'idle' && <div className="w-3.5 h-3.5 rounded-md bg-indigo-500" />}
                              </div>
                              <span className="text-xl font-bold">{option}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Text Input */}
                  {q.type === 'text' && (
                    <div className="space-y-4">
                      <input 
                        type="text"
                        value={answers[q.id] || ''}
                        onChange={(e) => checkedState === 'idle' && setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                        placeholder="Type your answer..."
                        disabled={checkedState !== 'idle'}
                        className={cn(
                          "w-full p-6 text-2xl font-bold rounded-3xl border-2 outline-none transition-all shadow-[0_6px_0_rgb(226,232,240)] -translate-y-1 bg-white",
                          checkedState === 'idle' ? "border-slate-200 focus:border-indigo-500 focus:shadow-[0_6px_0_rgb(99,102,241)]" :
                          checkedState === 'correct' ? "border-emerald-500 bg-emerald-50 text-emerald-900 shadow-none translate-y-0" :
                          "border-rose-500 bg-rose-50 text-rose-900 shadow-none translate-y-0"
                        )}
                      />
                    </div>
                  )}

                  {/* Flashcard */}
                  {q.type === 'flashcard' && (
                    <div className="space-y-8">
                      <div 
                        onClick={() => setFlippedCards(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                        className="relative w-full h-80 md:h-96 cursor-pointer group"
                        style={{ perspective: "1000px" }}
                      >
                        <motion.div
                          initial={false}
                          animate={{ rotateY: flippedCards[q.id] ? 180 : 0 }}
                          transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                          className="w-full h-full relative"
                          style={{ transformStyle: "preserve-3d" }}
                        >
                          {/* Front */}
                          <div 
                            className="absolute inset-0 bg-white border-2 border-slate-200 rounded-3xl flex flex-col items-center justify-center p-8 text-center group-hover:border-indigo-300 transition-colors shadow-[0_8px_0_rgb(226,232,240)]"
                            style={{ backfaceVisibility: "hidden" }}
                          >
                            <span className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Term</span>
                            <h4 className="text-4xl md:text-5xl font-black text-slate-900">{q.front}</h4>
                            <p className="absolute bottom-8 text-sm font-bold text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                              Click to flip <RotateCcw className="w-4 h-4" />
                            </p>
                          </div>
                          {/* Back */}
                          <div 
                            className="absolute inset-0 bg-indigo-50 border-2 border-indigo-200 rounded-3xl flex flex-col items-center justify-center p-8 text-center shadow-[0_8px_0_rgb(199,210,254)]"
                            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                          >
                            <span className="text-sm font-black text-indigo-400 uppercase tracking-widest mb-6">Definition</span>
                            <p className="text-2xl md:text-3xl font-bold text-slate-800 leading-tight">{q.back}</p>
                          </div>
                        </motion.div>
                      </div>

                      <AnimatePresence>
                        {flippedCards[q.id] && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="flex items-center justify-center gap-4"
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setAnswers(prev => ({ ...prev, [q.id]: 'incorrect' }));
                              }}
                              className={cn(
                                "flex-1 btn-fun-rose py-4 flex flex-col items-center gap-1",
                                answers[q.id] === 'incorrect' && "ring-4 ring-rose-500 ring-offset-2"
                              )}
                            >
                              <XCircle className="w-6 h-6" />
                              <span className="text-sm">Still Learning</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setAnswers(prev => ({ ...prev, [q.id]: 'correct' }));
                              }}
                              className={cn(
                                "flex-1 btn-fun-emerald py-4 flex flex-col items-center gap-1",
                                answers[q.id] === 'correct' && "ring-4 ring-emerald-500 ring-offset-2"
                              )}
                            >
                              <CheckCircle2 className="w-6 h-6" />
                              <span className="text-sm">Got It</span>
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Checklist */}
                  {q.type === 'checklist' && q.items && (
                    <div className="space-y-4">
                      {q.items.map((item, iIndex) => {
                        const isChecked = checkedItems[q.id]?.[iIndex] || false;
                        return (
                          <motion.label 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            key={iIndex}
                            className={cn(
                              "flex items-center gap-5 p-5 md:p-6 rounded-3xl border-2 cursor-pointer transition-colors",
                              isChecked 
                                ? "border-emerald-500 bg-emerald-50 shadow-[0_6px_0_rgb(16,185,129)] -translate-y-1" 
                                : "border-slate-200 hover:border-slate-300 bg-white shadow-[0_6px_0_rgb(226,232,240)] -translate-y-1"
                            )}
                          >
                            <div className={cn(
                              "w-8 h-8 rounded-xl flex items-center justify-center border-2 transition-colors flex-shrink-0",
                              isChecked ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300 bg-white"
                            )}>
                              {isChecked && <Check className="w-5 h-5" />}
                            </div>
                            <input 
                              type="checkbox" 
                              className="hidden"
                              checked={isChecked}
                              onChange={() => toggleChecklistItem(q.id, iIndex)}
                            />
                            <span className={cn(
                              "text-xl font-bold transition-colors",
                              isChecked ? "text-slate-400 line-through" : "text-slate-700"
                            )}>{item}</span>
                          </motion.label>
                        );
                      })}
                    </div>
                  )}

                  {/* Poll */}
                  {q.type === 'poll' && q.options && (
                    <div className="space-y-4">
                      {q.options.map((option, oIndex) => {
                        const isSelected = answers[q.id] === option;
                        const hasVoted = !!answers[q.id];
                        // Mock percentage for visual effect
                        const percentage = isSelected ? 65 : Math.floor(Math.random() * 30);
                        
                        return (
                          <motion.div 
                            whileHover={!hasVoted ? { scale: 1.02 } : {}}
                            whileTap={!hasVoted ? { scale: 0.98 } : {}}
                            key={oIndex}
                            onClick={() => !hasVoted && setAnswers(prev => ({ ...prev, [q.id]: option }))}
                            className={cn(
                              "relative overflow-hidden p-5 md:p-6 rounded-3xl border-2 transition-colors",
                              hasVoted 
                                ? isSelected ? "border-indigo-500 bg-indigo-50 shadow-[0_6px_0_rgb(99,102,241)] -translate-y-1" : "border-slate-200 bg-slate-50 opacity-70"
                                : "border-slate-200 hover:border-slate-300 bg-white cursor-pointer shadow-[0_6px_0_rgb(226,232,240)] -translate-y-1"
                            )}
                          >
                            {hasVoted && (
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className={cn(
                                  "absolute inset-y-0 left-0 opacity-20",
                                  isSelected ? "bg-indigo-500" : "bg-slate-400"
                                )}
                              />
                            )}
                            <div className="relative flex items-center justify-between z-10">
                              <span className={cn(
                                "text-xl font-bold",
                                isSelected ? "text-indigo-900" : "text-slate-700"
                              )}>{option}</span>
                              {hasVoted && (
                                <span className={cn(
                                  "text-xl font-black",
                                  isSelected ? "text-indigo-600" : "text-slate-500"
                                )}>{percentage}%</span>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}

                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className={cn(
        "fixed bottom-0 left-0 right-0 border-t-2 transition-colors duration-300",
        checkedState === 'idle' ? "bg-white border-slate-200" :
        checkedState === 'correct' ? "bg-emerald-100 border-emerald-200" :
        "bg-rose-100 border-rose-200"
      )}>
        <div className="max-w-4xl mx-auto px-6 py-4 md:py-6 flex items-center justify-between">
          <div className="flex-1">
            {checkedState === 'correct' && (
              <div className="flex items-center gap-4 text-emerald-700">
                <div className="w-12 h-12 rounded-2xl bg-emerald-200 flex items-center justify-center border-2 border-emerald-300">
                  <Check className="w-8 h-8" />
                </div>
                <span className="text-3xl font-black">Excellent!</span>
              </div>
            )}
            {checkedState === 'incorrect' && (
              <div className="flex items-center gap-4 text-rose-700">
                <div className="w-12 h-12 rounded-2xl bg-rose-200 flex items-center justify-center border-2 border-rose-300">
                  <X className="w-8 h-8" />
                </div>
                <span className="text-3xl font-black">Not quite.</span>
              </div>
            )}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={checkedState === 'idle' ? handleCheck : handleContinue}
            disabled={(checkedState === 'idle' && isGradable && !hasAnsweredCurrent) || (q?.type === 'flashcard' && !flippedCards[q.id]) || (q?.type === 'poll' && !answers[q.id])}
            className={cn(
              "px-10 py-4 rounded-2xl font-black text-xl transition-colors border-b-4",
              checkedState === 'idle' 
                ? "bg-indigo-500 hover:bg-indigo-600 text-white border-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:border-slate-300 disabled:translate-y-1" 
                : checkedState === 'correct'
                  ? "bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-700"
                  : "bg-rose-500 hover:bg-rose-600 text-white border-rose-700"
            )}
          >
            {checkedState === 'idle' ? (isGradable ? 'Check' : 'Continue') : 
             checkedState === 'correct' ? 'Continue' : 'Try Again'}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
