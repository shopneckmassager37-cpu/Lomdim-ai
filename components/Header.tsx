
import React, { useState } from 'react';
import { BookOpen, GraduationCap, History, ChevronDown, Settings, LayoutGrid, User, School, LogOut, UserCircle } from 'lucide-react';
import { Grade } from '../types';

interface HeaderProps {
  onHomeClick: () => void;
  onHistoryClick: () => void;
  onClassroomClick: () => void;
  onLogout: () => void;
  onProfileClick: () => void;
  selectedGrade: Grade | null;
  onChangeGrade: () => void;
  userName?: string | null;
  userPhoto?: string;
  userEmail?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  onHomeClick, 
  onHistoryClick, 
  onClassroomClick,
  onLogout,
  onProfileClick,
  selectedGrade, 
  onChangeGrade, 
  userName,
  userEmail
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button 
            onClick={onHomeClick}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="bg-primary p-2 rounded-lg text-white">
              < GraduationCap size={24} />
            </div>
            <div className="text-right">
              <h1 className="text-xl font-bold text-gray-900 leading-tight">Lomdim</h1>
              <p className="text-[10px] text-gray-500">המורה החכם שלך</p>
            </div>
          </button>
          
          <div className="flex items-center gap-1 md:gap-3">
             <button
               onClick={onClassroomClick}
               className="flex flex-col md:flex-row items-center text-[10px] md:text-sm text-gray-500 hover:text-primary hover:bg-blue-50 px-2 py-1 rounded-lg transition-colors"
               title="הכיתה שלי"
             >
                <School size={18} className="md:ml-2" />
                <span className="hidden md:inline">כיתה</span>
             </button>

             <button
               onClick={onHomeClick}
               className="flex flex-col md:flex-row items-center text-[10px] md:text-sm text-gray-500 hover:text-primary hover:bg-gray-50 px-2 py-1 rounded-lg transition-colors"
               title="בחירת מקצוע"
             >
                <LayoutGrid size={18} className="md:ml-2" />
                <span className="hidden md:inline">מקצועות</span>
             </button>

             <button
               onClick={onHistoryClick}
               className="flex flex-col md:flex-row items-center text-[10px] md:text-sm text-gray-500 hover:text-primary hover:bg-gray-50 px-2 py-1 rounded-lg transition-colors"
               title="היסטוריית תרגול"
             >
                <History size={18} className="md:ml-2" />
                <span className="hidden md:inline">היסטוריה</span>
             </button>

            {/* Profile Section */}
            <div className="flex items-center border-r border-gray-100 pr-1 md:pr-4 mr-1 md:mr-2 gap-1 md:gap-3">
              <div className="relative">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-1 p-1 hover:bg-gray-100 rounded-full transition-all"
                >
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                    {userName ? userName[0] : <User size={16} />}
                  </div>
                  <ChevronDown size={12} className={`text-gray-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
                </button>

                {showProfileMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowProfileMenu(false)}></div>
                    <div className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-20 animate-fade-in text-right">
                      <div className="px-4 py-3 border-b border-gray-50 mb-1">
                        <p className="text-sm font-bold text-gray-900 truncate">{userName || 'תלמיד'}</p>
                        <p className="text-xs text-gray-400 truncate">{userEmail}</p>
                      </div>
                      
                      <button 
                        onClick={() => { onProfileClick(); setShowProfileMenu(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors"
                      >
                        <UserCircle size={16} />
                        <span>עריכת פרופיל</span>
                      </button>

                      <button 
                        onClick={() => { onChangeGrade(); setShowProfileMenu(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors"
                      >
                        <Settings size={16} />
                        <span>הגדרות כיתה ({selectedGrade || 'לא נבחרה'})</span>
                      </button>

                      <div className="border-t border-gray-50 mt-1 pt-1">
                        <button 
                          onClick={() => { onLogout(); setShowProfileMenu(false); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={16} />
                          <span>התנתק</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
