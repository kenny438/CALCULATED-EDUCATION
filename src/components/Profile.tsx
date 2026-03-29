import React, { useState } from "react";
import { UserProfile, Course, Enrollment } from "../data/mockData";
import { User, Mail, Calendar, Edit2, Save, LogOut, BookOpen, Award, Star, Flame, Trophy, Zap, PlusCircle, GraduationCap, PlayCircle, Settings, RefreshCw, Tag, AlignLeft, BadgeCheck, Upload } from "lucide-react";
import { useToast } from "./ui/Toast";
import { motion } from "motion/react";

interface ProfileProps {
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onSignOut: () => void;
  onCreateCourse?: () => void;
  createdCourses?: Course[];
  onEditCourse?: (course: Course) => void;
  enrollments?: Enrollment[];
}

export function Profile({ profile, onUpdateProfile, onSignOut, onCreateCourse, createdCourses = [], onEditCourse, enrollments = [] }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);
  const { addToast } = useToast();

  const isCoFounder = ["mgethmikadinujakumarathunga@gmail.com", "thewantab2012@gmail.com", "therevisionplan@gmail.com"].includes(profile.email || "");

  const handleSave = () => {
    if (!editedProfile.username.trim()) {
      addToast("Username cannot be empty", "error");
      return;
    }
    onUpdateProfile(editedProfile);
    setIsEditing(false);
    addToast("Profile updated successfully", "success");
  };

  const handleRandomizeAvatar = () => {
    setEditedProfile({ ...editedProfile, avatarSeed: Math.random().toString(36).substring(7), avatarUrl: undefined });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedProfile({ ...editedProfile, avatarUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInterestsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const interests = e.target.value.split(',').map(i => i.trim()).filter(i => i);
    setEditedProfile({ ...editedProfile, interests });
  };

  const completedCourses = enrollments.filter(e => e.progress === 100).length;

  const stats = [
    { label: "Courses Enrolled", value: enrollments.length.toString(), icon: BookOpen, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Courses Completed", value: completedCourses.toString(), icon: Award, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "Certificates", value: completedCourses.toString(), icon: Trophy, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Current Streak", value: `${profile.dailyStreak || 0} Days`, icon: Flame, color: "text-orange-500", bg: "bg-orange-50" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Student Profile</h1>
          <p className="text-slate-500 mt-2 font-bold">Manage your learning journey and personal details.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="card-fun bg-white p-8 flex flex-col items-center text-center">
            <div className="relative group mb-6">
              <div className="w-36 h-36 rounded-3xl bg-indigo-100 border border-indigo-200 shadow-inner overflow-hidden flex items-center justify-center transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <img 
                  src={isEditing ? (editedProfile.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${editedProfile.avatarSeed || 'default'}`) : (profile.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.avatarSeed || 'default'}`)}
                  alt="Profile" 
                  className="w-32 h-32 object-cover rounded-2xl"
                />
              </div>
              {isEditing && (
                <div className="absolute -bottom-2 -right-2 flex gap-2">
                  <label className="bg-emerald-600 text-white p-2 rounded-xl shadow-lg hover:bg-emerald-500 transition-colors border-2 border-white cursor-pointer" title="Upload Photo">
                    <Upload className="w-5 h-5" />
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                  <button 
                    onClick={handleRandomizeAvatar}
                    className="bg-indigo-600 text-white p-2 rounded-xl shadow-lg hover:bg-indigo-500 transition-colors border-2 border-white"
                    title="Randomize Avatar"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
            
            {isEditing ? (
              <div className="w-full space-y-4 text-left">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Username</label>
                  <input
                    type="text"
                    value={editedProfile.username}
                    onChange={(e) => setEditedProfile({ ...editedProfile, username: e.target.value })}
                    className="mt-1 text-lg font-bold text-slate-900 bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2 w-full focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 flex items-center gap-1"><AlignLeft className="w-3 h-3"/> Bio</label>
                  <textarea
                    value={editedProfile.bio || ""}
                    onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                    className="mt-1 text-sm font-bold text-slate-700 bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2 w-full focus:outline-none focus:border-indigo-500 resize-none h-20"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 flex items-center gap-1"><GraduationCap className="w-3 h-3"/> Qualifications</label>
                  <textarea
                    value={editedProfile.qualifications || ""}
                    onChange={(e) => setEditedProfile({ ...editedProfile, qualifications: e.target.value })}
                    placeholder="e.g. BSc Computer Science..."
                    className="mt-1 text-sm font-bold text-slate-700 bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2 w-full focus:outline-none focus:border-indigo-500 resize-none h-20"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 flex items-center gap-1"><Tag className="w-3 h-3"/> Interests (comma separated)</label>
                  <input
                    type="text"
                    value={(editedProfile.interests || []).join(", ")}
                    onChange={handleInterestsChange}
                    placeholder="e.g. React, Design, Python..."
                    className="mt-1 text-sm font-bold text-slate-700 bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2 w-full focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-2">
                  {profile.username}
                  {isCoFounder && (
                    <span className="flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-bold border border-blue-200">
                      <BadgeCheck className="w-3 h-3 text-blue-500" />
                      Co-founder
                    </span>
                  )}
                </h2>
                <p className="text-slate-500 mt-3 flex items-center justify-center gap-2 font-bold bg-slate-100 px-4 py-2 rounded-full w-full">
                  <Mail className="w-4 h-4 text-indigo-400" />
                  <span className="truncate">{profile.email}</span>
                </p>
                {profile.bio && (
                  <p className="text-sm font-medium text-slate-600 mt-4 italic">
                    "{profile.bio}"
                  </p>
                )}
                
                <div className="w-full mt-6 text-left space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-indigo-500" />
                      Qualifications
                    </h3>
                    <p className="text-sm font-bold text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      {profile.qualifications || "No qualifications added yet."}
                    </p>
                  </div>
                  
                  {profile.interests && profile.interests.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Tag className="w-4 h-4 text-emerald-500" />
                        Interests
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.interests.map((interest, idx) => (
                          <span key={idx} className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider rounded-lg border border-emerald-100">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
            
            <div className="w-full mt-8 pt-8 border-t-4 border-slate-100 flex flex-col gap-4">
              {isEditing ? (
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditedProfile(profile);
                    }}
                    className="flex-1 btn-fun-rose py-4 flex items-center justify-center gap-2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 btn-fun-emerald py-4 flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    Save
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full btn-fun py-4 flex items-center justify-center gap-2"
                >
                  <Edit2 className="w-5 h-5" />
                  Edit Profile
                </button>
              )}
              
              {!isEditing && onCreateCourse && profile.canCreateCourses && (
                <button
                  onClick={onCreateCourse}
                  className="w-full btn-fun bg-indigo-600 hover:bg-indigo-500 py-4 flex items-center justify-center gap-2"
                >
                  <PlusCircle className="w-5 h-5" />
                  Create a Course
                </button>
              )}
              {!isEditing && (
                <button
                  onClick={onSignOut}
                  className="w-full btn-fun-rose py-4 flex items-center justify-center gap-2"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="card-fun bg-white p-6 flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-b border-r-4 border-black/5 ${stat.bg} ${stat.color}`}>
                  <stat.icon className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {profile.canCreateCourses && (
            <div className="card-fun bg-white p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-indigo-500" />
                My Created Courses
              </h3>
              {createdCourses.length > 0 ? (
                <div className="space-y-4">
                  {createdCourses.map((course) => (
                    <div key={course.id} className="flex items-center justify-between p-5 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all bg-slate-50/50">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                          <PlayCircle className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg text-slate-900">{course.title}</h4>
                          <p className="text-sm font-bold text-slate-500">{course.status === 'published' ? 'Published' : 'Draft'} • {course.students} Students</p>
                        </div>
                      </div>
                      {onEditCourse && (
                        <button 
                          onClick={() => onEditCourse(course)}
                          className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                        >
                          <Settings className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border border-dashed border-slate-200 rounded-2xl bg-slate-50">
                  <p className="text-base text-slate-500 font-bold mb-4">You haven't created any courses yet.</p>
                  {onCreateCourse && (
                    <button 
                      onClick={onCreateCourse}
                      className="btn-fun bg-indigo-600 hover:bg-indigo-500 px-6 py-2"
                    >
                      Create Your First Course
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="card-fun bg-white p-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <Trophy className="w-8 h-8 text-amber-500" />
              Recent Achievements
            </h3>
            <div className="space-y-4">
              {[
                { title: "Fast Learner", desc: "Completed 3 lessons in one day", icon: Zap, color: "text-amber-500", bg: "bg-amber-100", border: "border-amber-200" },
                { title: "Perfect Score", desc: "Got 100% on the React Basics Quiz", icon: Star, color: "text-emerald-500", bg: "bg-emerald-100", border: "border-emerald-200" },
                { title: "Consistency", desc: "Maintained a 7-day learning streak", icon: Flame, color: "text-orange-500", bg: "bg-orange-100", border: "border-orange-200" },
              ].map((achievement, i) => (
                <div key={i} className="flex items-center gap-5 p-5 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all hover:-translate-y-1 bg-slate-50/50">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-b border-r-4 ${achievement.bg} ${achievement.color} ${achievement.border}`}>
                    <achievement.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-slate-900">{achievement.title}</h4>
                    <p className="text-sm font-bold text-slate-500">{achievement.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
