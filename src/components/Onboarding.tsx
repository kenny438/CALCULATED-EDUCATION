import React, { useState } from "react";
import { motion } from "motion/react";
import { Check, GraduationCap } from "lucide-react";

export interface OnboardingData {
  age: number;
  isAdult: boolean;
  canCreateCourses: boolean;
}

interface OnboardingProps {
  onComplete: (data: OnboardingData) => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [age, setAge] = useState<string>("");
  const [isAdult, setIsAdult] = useState<boolean>(false);
  const [canCreateCourses, setCanCreateCourses] = useState<boolean>(false);

  const isValid = age !== "" && parseInt(age) > 0;

  const handleSubmit = () => {
    if (isValid) {
      onComplete({
        age: parseInt(age),
        isAdult,
        canCreateCourses
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full bg-white rounded-[2rem] p-8 md:p-12 shadow-xl border border-slate-100"
      >
        <div className="text-center mb-10 flex flex-col items-center">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center transform -rotate-6 shadow-lg mb-6">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">Welcome to CALCULATED</h1>
          <p className="text-lg text-slate-500 font-medium">Let's set up your profile to get started.</p>
        </div>

        <div className="space-y-6 mb-10">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-widest">Your Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-0 transition-colors font-medium"
              placeholder="e.g. 25"
              min="1"
            />
          </div>

          <label className="flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-100 hover:border-slate-200 cursor-pointer transition-colors">
            <div className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${isAdult ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300'}`}>
              {isAdult && <Check className="w-4 h-4 text-white" />}
            </div>
            <input 
              type="checkbox" 
              checked={isAdult}
              onChange={(e) => setIsAdult(e.target.checked)}
              className="hidden"
            />
            <div>
              <p className="font-bold text-slate-900">I am an adult</p>
              <p className="text-sm text-slate-500 font-medium">Confirm you are 18 years or older</p>
            </div>
          </label>

          <label className="flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-100 hover:border-slate-200 cursor-pointer transition-colors">
            <div className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${canCreateCourses ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300'}`}>
              {canCreateCourses && <Check className="w-4 h-4 text-white" />}
            </div>
            <input 
              type="checkbox" 
              checked={canCreateCourses}
              onChange={(e) => setCanCreateCourses(e.target.checked)}
              className="hidden"
            />
            <div>
              <p className="font-bold text-slate-900">Enable Course Creation</p>
              <p className="text-sm text-slate-500 font-medium">I want to create and publish my own courses</p>
            </div>
          </label>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
            isValid 
              ? 'bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/30 border-b border-indigo-700 active:border-b-0 active:translate-y-1' 
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          {isValid ? "Let's Go!" : "Please enter your age"}
        </button>
      </motion.div>

      <div className="absolute bottom-4 left-0 w-full text-center text-slate-400 text-xs font-medium px-4 pointer-events-none">
        by (BUSSIN)Bureau de l’Unité des Systèmes et Intelligence Numérique industries
      </div>
    </div>
  );
}
