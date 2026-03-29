import React from "react";
import { motion } from "motion/react";
import { ShieldAlert, Scale, UserX, Clock, ArrowLeft } from "lucide-react";

interface TermsOfServiceProps {
  onBack: () => void;
}

export function TermsOfService({ onBack }: TermsOfServiceProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto py-12 px-6"
    >
      <button 
        onClick={onBack}
        className="flex items-center text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-all mb-8 uppercase tracking-widest bg-white px-4 py-2 rounded-xl border border-indigo-100 shadow-sm hover:-translate-y-0.5"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to App
      </button>

      <div className="card-fun bg-white p-8 md:p-12">
        <div className="flex items-center gap-6 mb-12">
          <div className="w-20 h-20 bg-indigo-100 rounded-3xl flex items-center justify-center border border-indigo-200 shadow-sm transform -rotate-6">
            <Scale className="w-10 h-10 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-none mb-2">Terms of Service</h1>
            <p className="text-indigo-500 font-bold uppercase tracking-[0.2em] text-sm">Last Updated: February 2026</p>
          </div>
        </div>

        <div className="space-y-12 text-slate-600 leading-relaxed">
          <section className="relative pl-16">
            <div className="absolute left-0 top-0 w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center border border-rose-200 shadow-sm transform rotate-3">
              <UserX className="w-6 h-6 text-rose-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 uppercase tracking-tight">1. Age Requirement & Eligibility</h2>
            <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 mb-6 shadow-sm">
              <p className="text-rose-900 font-bold text-lg mb-2 flex items-center gap-2">
                <ShieldAlert className="w-6 h-6" />
                CRITICAL NOTICE: MINIMUM AGE REQUIREMENT
              </p>
              <p className="text-rose-800 font-bold">
                You MUST be at least 12 years of age to use CALCULATED. If you are under the age of 12, you are strictly prohibited from creating an account or accessing any part of the service.
              </p>
            </div>
            <p className="font-medium text-lg">
              CALCULATED is designed for users who have reached a level of maturity to understand the concepts taught. Users under 12 years old lack the legal capacity and cognitive development required to navigate the complexities of our platform. We take this requirement seriously to ensure a safe environment for our community.
            </p>
          </section>

          <section className="relative pl-16">
            <div className="absolute left-0 top-0 w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center border border-emerald-200 shadow-sm transform -rotate-3">
              <Clock className="w-6 h-6 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 uppercase tracking-tight">2. Why the 12+ Restriction?</h2>
            <p className="mb-6 font-medium text-lg">
              Our 12-year-old age limit is not arbitrary. It is based on several key factors:
            </p>
            <ul className="space-y-4 font-medium text-lg">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2.5 flex-shrink-0" />
                <span><span className="text-slate-900 font-bold">Data Privacy (COPPA):</span> We comply with international data protection laws that restrict the collection of personal information from children under 13.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2.5 flex-shrink-0" />
                <span><span className="text-slate-900 font-bold">Risk Management:</span> Advanced learning involves analyzing complex data and understanding probability. Research suggests that cognitive abilities for these tasks mature significantly around age 12.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2.5 flex-shrink-0" />
                <span><span className="text-slate-900 font-bold">Community Safety:</span> CALCULATED is a social platform. Maintaining an age floor helps us foster a more mature and responsible community interaction.</span>
              </li>
            </ul>
          </section>

          <section className="relative pl-16">
            <div className="absolute left-0 top-0 w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center border border-amber-200 shadow-sm transform rotate-6">
              <Scale className="w-6 h-6 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 uppercase tracking-tight">3. Account Termination</h2>
            <p className="font-medium text-lg">
              If we discover that an account has been created by a user under the age of 12, we will immediately terminate the account and delete all associated data without prior notice. We reserve the right to request proof of age at any time if we have reason to believe a user is underage.
            </p>
          </section>

          <section className="relative pl-16">
            <div className="absolute left-0 top-0 w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center border border-slate-200 shadow-sm transform -rotate-6">
              <ShieldAlert className="w-6 h-6 text-slate-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 uppercase tracking-tight">4. Boring Legal Stuff</h2>
            <p className="text-lg font-bold italic text-slate-500 bg-slate-50 p-6 rounded-3xl border border-slate-100">
              By using CALCULATED, you agree that you are not a tiny child. You agree that you will not lie about your age. You agree that if you are caught being 11 years old, you will accept your ban with dignity. We are not responsible for your tears if your account is deleted because you were born in 2015 or later.
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t-4 border-slate-100 text-center">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.3em]">
            BRILLIANT &bull; AN APP BY BUSSIN INDUSTRIES ↈ∭ &bull; &copy; 2026
          </p>
        </div>
      </div>
    </motion.div>
  );
}
