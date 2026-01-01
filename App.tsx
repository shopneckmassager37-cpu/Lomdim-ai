
import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header.tsx';
import SubjectSelector from './components/SubjectSelector.tsx';
import PracticeArea from './components/PracticeArea.tsx';
import ChatBot from './components/ChatBot.tsx';
import ProgressChart from './components/ProgressChart.tsx';
import HistoryView from './components/HistoryView.tsx';
import ResourcesView from './components/ResourcesView.tsx';
import TestPrepView from './components/TestPrepView.tsx';
import LoginView from './components/LoginView.tsx';
import PrivacyView from './components/PrivacyView.tsx';
import ProfileModal from './components/ProfileModal.tsx';
import ClassroomView from './components/ClassroomView.tsx';
import { Subject, Grade, ViewMode, UserStats, HistoryItem, Question, PracticeConfig, User } from './types.ts';
import { PenTool, MessageCircle, BookOpen, GraduationCap, Calendar, School } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user_auth');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(() => {
    const saved = localStorage.getItem('user_grade');
    return saved as Grade || null;
  });
  
  const [userName, setUserName] = useState<string | null>(() => {
    const savedName = localStorage.getItem('user_name');
    if (savedName) return savedName;
    const savedAuth = localStorage.getItem('user_auth');
    if (savedAuth) {
      try {
        return JSON.parse(savedAuth).name;
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [viewMode, setViewMode] = useState<ViewMode>('DASHBOARD');
  const [previousViewMode, setPreviousViewMode] = useState<ViewMode>('DASHBOARD');
  
  const [activeTab, setActiveTab] = useState<'practice' | 'chat' | 'resources' | 'test-prep'>('practice');
  const [chatContext, setChatContext] = useState<string | null>(null);
  const [practiceConfig, setPracticeConfig] = useState<PracticeConfig | null>(null);
  const [testPrepInitialData, setTestPrepInitialData] = useState<{topic: string, days: number, attachment?: any} | null>(null);
  const [summaryToOpen, setSummaryToOpen] = useState<{title: string, content: string} | null>(null);

  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('study_history');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [stats, setStats] = useState<UserStats[]>(() => {
    const saved = localStorage.getItem('user_stats');
    return saved ? JSON.parse(saved) : Object.values(Subject).map(s => ({
      subject: s,
      correct: 0,
      total: 0
    }));
  });

  useEffect(() => {
    if (!user) return;
    if (selectedGrade) localStorage.setItem('user_grade', selectedGrade);
    if (userName) localStorage.setItem('user_name', userName);
    localStorage.setItem('user_auth', JSON.stringify(user));
    localStorage.setItem('study_history', JSON.stringify(history));
    localStorage.setItem('user_stats', JSON.stringify(stats));
  }, [selectedGrade, userName, history, stats, user]);

  const recentMistakes = useMemo(() => {
    if (!selectedSubject) return [];
    return history
      .filter(item => item.subject === selectedSubject && item.type === 'PRACTICE' && !item.isCorrect)
      .slice(-5)
      .map(item => item.title);
  }, [history, selectedSubject]);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    setUserName(newUser.name || null);
    localStorage.setItem('user_auth', JSON.stringify(newUser));
    localStorage.setItem('user_name', newUser.name || '');
  };

  const handleLogout = () => {
    const keysToRemove = ['user_auth', 'user_name', 'user_grade', 'is_pro', 'study_history', 'user_stats', 'referral_count', 'referred_by', 'enrolled_courses'];
    keysToRemove.forEach(key => localStorage.removeItem(key));
    setUser(null);
    setUserName(null);
    setSelectedGrade(null);
    setSelectedSubject(null);
    setViewMode('DASHBOARD');
    setHistory([]);
    setStats(Object.values(Subject).map(s => ({ subject: s, correct: 0, total: 0 })));
    window.location.href = window.location.origin + window.location.pathname;
  };

  const handleUpdateProfile = (name: string, photoUrl: string) => {
    if (user) {
      const updatedUser = { ...user, name, photoUrl };
      setUser(updatedUser);
      setUserName(name);
      localStorage.setItem('user_auth', JSON.stringify(updatedUser));
      localStorage.setItem('user_name', name);
    }
  };

  const handleGradeSelect = (grade: Grade) => setSelectedGrade(grade);
  const handleChangeGrade = () => {
    setSelectedGrade(null);
    setSelectedSubject(null);
    setViewMode('DASHBOARD');
    setChatContext(null);
    setPracticeConfig(null);
  };

  const handleSubjectSelect = (subject: Subject) => {
    setSelectedSubject(subject);
    setViewMode('PRACTICE');
    setActiveTab('practice'); 
    setPracticeConfig(null);
  };

  const handleHomeClick = () => {
    setViewMode('DASHBOARD');
    setActiveTab('practice');
    setChatContext(null);
    setSelectedSubject(null); 
    setPracticeConfig(null);
    setSummaryToOpen(null);
  };

  const handleHistoryClick = () => {
    if (viewMode !== 'HISTORY') {
      setPreviousViewMode(viewMode);
      setViewMode('HISTORY');
    }
  };

  const handleClassroomClick = () => {
    if (viewMode !== 'CLASSROOM') {
      setPreviousViewMode(viewMode);
      setViewMode('CLASSROOM');
    }
  };

  const handleBackFromGenericView = () => setViewMode(previousViewMode);

  const handleStartTestFromResource = (config: PracticeConfig) => {
    setPracticeConfig(config);
    setActiveTab('practice');
  };

  const handleStartTestPrepFromClassroom = (subject: Subject, grade: Grade, topic: string, days: number, attachment?: any) => {
    setSelectedSubject(subject);
    setSelectedGrade(grade);
    setTestPrepInitialData({ topic, days, attachment });
    setActiveTab('test-prep');
    setViewMode('PRACTICE');
  };

  const handleQuestionAnswered = (question: Question, isCorrect: boolean) => {
    if (!selectedSubject || !selectedGrade) return;
    setStats(prev => prev.map(s => {
      if (s.subject === selectedSubject) {
        return { ...s, correct: s.correct + (isCorrect ? 1 : 0), total: s.total + 1 };
      }
      return s;
    }));
    const newItem: HistoryItem = { id: Date.now().toString(), timestamp: Date.now(), subject: selectedSubject, grade: selectedGrade, type: 'PRACTICE', title: question.text, isCorrect: isCorrect };
    setHistory(prev => [...prev, newItem]);
  };

  const handleSummaryGenerated = (title: string, content: string) => {
    if (!selectedSubject || !selectedGrade) return;
    const isDuplicate = history.some(h => h.type === 'SUMMARY' && h.title === title && h.subject === selectedSubject && (Date.now() - h.timestamp) < 60000);
    if (!isDuplicate) {
      const newItem: HistoryItem = { id: Date.now().toString(), timestamp: Date.now(), subject: selectedSubject, grade: selectedGrade, type: 'SUMMARY', title: title, content: content };
      setHistory(prev => [...prev, newItem]);
    }
  };

  const handleOpenSummaryFromHistory = (item: HistoryItem) => {
    setSelectedSubject(item.subject);
    setSelectedGrade(item.grade);
    setActiveTab('resources');
    setSummaryToOpen({ title: item.title, content: item.content || '' });
    setViewMode('PRACTICE');
  };

  const handleAskAI = (questionText: string) => {
    setChatContext(questionText);
    setActiveTab('chat');
  };

  const handlePrivacyClick = () => {
    setPreviousViewMode(viewMode);
    setViewMode('PRIVACY');
  };

  if (!user && viewMode === 'PRIVACY') {
      return <PrivacyView onBack={() => setViewMode('DASHBOARD')} />;
  }

  if (!user) {
    return <LoginView onLogin={handleLogin} onPrivacyClick={handlePrivacyClick} />;
  }

  const isMainToolVisible = viewMode === 'PRACTICE' || (viewMode === 'HISTORY' && previousViewMode === 'PRACTICE') || (viewMode === 'CLASSROOM' && previousViewMode === 'PRACTICE');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header 
        onHomeClick={handleHomeClick} 
        onHistoryClick={handleHistoryClick} 
        onClassroomClick={handleClassroomClick}
        onLogout={handleLogout}
        onProfileClick={() => setIsProfileModalOpen(true)}
        selectedGrade={selectedGrade}
        onChangeGrade={handleChangeGrade}
        userName={userName}
        userPhoto={user.photoUrl}
        userEmail={user.email}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8">
        {viewMode === 'DASHBOARD' && (
          <div className="flex flex-col gap-8 animate-fade-in">
            {!selectedGrade ? (
              <SubjectSelector
                mode="GRADE_SELECTION"
                selectedSubject={selectedSubject}
                selectedGrade={selectedGrade}
                userName={userName}
                onSelectSubject={handleSubjectSelect}
                onSelectGrade={handleGradeSelect}
              />
            ) : (
              <>
                <SubjectSelector
                  mode="SUBJECT_SELECTION"
                  selectedSubject={selectedSubject}
                  selectedGrade={selectedGrade}
                  userName={userName}
                  onSelectSubject={handleSubjectSelect}
                  onSelectGrade={handleGradeSelect}
                />
                {stats.some(s => s.total > 0) && (
                  <div className="max-w-4xl mx-auto w-full mt-4">
                    <ProgressChart stats={stats} />
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {viewMode === 'HISTORY' && <HistoryView history={history} onBack={handleBackFromGenericView} onOpenSummary={handleOpenSummaryFromHistory} />}
        {viewMode === 'CLASSROOM' && <ClassroomView user={user} onBack={handleHomeClick} onStartTestPrep={handleStartTestPrepFromClassroom} />}
        {viewMode === 'PRIVACY' && <PrivacyView onBack={handleHomeClick} />}

        {selectedSubject && isMainToolVisible && viewMode === 'PRACTICE' && (
          <div className="flex flex-col lg:flex-row gap-8 animate-fade-in">
            <div className="hidden lg:flex lg:w-1/4 flex-col gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                <div className="mb-6 pb-4 border-b border-gray-100">
                   <h2 className="text-xl font-bold text-gray-800">{selectedSubject}</h2>
                   <p className="text-gray-500">{selectedGrade}</p>
                </div>
                <nav className="flex flex-col gap-3">
                    <button onClick={() => setActiveTab('practice')} className={`p-4 rounded-xl flex items-center gap-3 transition-all text-right font-medium ${activeTab === 'practice' ? 'bg-blue-50 text-primary shadow-sm ring-1 ring-blue-100' : 'text-gray-600 hover:bg-gray-50'}`}><PenTool size={22} /><span>תרגול שאלות</span></button>
                    <button onClick={() => setActiveTab('resources')} className={`p-4 rounded-xl flex items-center gap-3 transition-all text-right font-medium ${activeTab === 'resources' ? 'bg-green-50 text-green-600 shadow-sm ring-1 ring-green-100' : 'text-gray-600 hover:bg-gray-50'}`}><BookOpen size={22} /><span>חומרי לימוד</span></button>
                    <button onClick={() => setActiveTab('test-prep')} className={`p-4 rounded-xl flex items-center gap-3 transition-all text-right font-medium ${activeTab === 'test-prep' ? 'bg-yellow-50 text-yellow-700 shadow-sm ring-1 ring-yellow-200' : 'text-gray-600 hover:bg-gray-50'}`}><div className="flex items-center gap-3"><Calendar size={22} className={activeTab === 'test-prep' ? 'text-yellow-600' : ''} /><span>הכנה למבחן</span></div></button>
                    <button onClick={() => setActiveTab('chat')} className={`p-4 rounded-xl flex items-center gap-3 transition-all text-right font-medium ${activeTab === 'chat' ? 'bg-purple-50 text-accent shadow-sm ring-1 ring-purple-100' : 'text-gray-600 hover:bg-gray-50'}`}><MessageCircle size={22} /><span>צ'אט עם מורה</span></button>
                </nav>
                <div className="mt-8 pt-6 border-t border-gray-100"><button onClick={handleHomeClick} className="w-full py-2 text-sm text-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center gap-2"><span>החלף מקצוע</span></button></div>
              </div>
            </div>

            <div className="lg:w-3/4 w-full">
                <div className={activeTab === 'practice' ? 'block' : 'hidden'}><PracticeArea subject={selectedSubject} grade={selectedGrade!} onQuestionAnswered={handleQuestionAnswered} onAskAI={handleAskAI} initialConfig={practiceConfig} recentMistakes={recentMistakes} /></div>
                <div className={activeTab === 'resources' ? 'block' : 'hidden'}><ResourcesView subject={selectedSubject} grade={selectedGrade!} onStartTest={handleStartTestFromResource} onSummaryGenerated={handleSummaryGenerated} onAskAI={handleAskAI} initialSummaryToOpen={summaryToOpen} /></div>
                <div className={activeTab === 'test-prep' ? 'block' : 'hidden'}><TestPrepView subject={selectedSubject} grade={selectedGrade!} initialSharedData={testPrepInitialData} onClearInitialData={() => setTestPrepInitialData(null)} /></div>
                <div className={activeTab === 'chat' ? 'block' : 'hidden'}><ChatBot subject={selectedSubject} grade={selectedGrade!} userName={userName} initialMessage={chatContext} /></div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden z-40 pb-safe">
              <div className="flex justify-around items-center p-2">
                <button onClick={() => setActiveTab('practice')} className={`flex flex-col items-center p-2 rounded-lg min-w-[64px] ${activeTab === 'practice' ? 'text-primary bg-blue-50' : 'text-gray-500'}`}><PenTool size={24} /><span className="text-[10px] mt-1 font-medium">תרגול</span></button>
                <button onClick={() => setActiveTab('resources')} className={`flex flex-col items-center p-2 rounded-lg min-w-[64px] ${activeTab === 'resources' ? 'text-green-600 bg-green-50' : 'text-gray-500'}`}><BookOpen size={24} /><span className="text-[10px] mt-1 font-medium">חומרים</span></button>
                <button onClick={handleClassroomClick} className={`flex flex-col items-center p-2 rounded-lg min-w-[64px] ${viewMode === 'CLASSROOM' ? 'text-blue-600 bg-blue-50' : 'text-gray-500'}`}><School size={24} /><span className="text-[10px] mt-1 font-medium">כיתה</span></button>
                <button onClick={() => setActiveTab('test-prep')} className={`relative flex flex-col items-center p-2 rounded-lg min-w-[64px] ${activeTab === 'test-prep' ? 'text-yellow-700 bg-yellow-50' : 'text-gray-500'}`}><Calendar size={24} /><span className="text-[10px] mt-1 font-medium">מבחן</span></button>
                <button onClick={() => setActiveTab('chat')} className={`flex flex-col items-center p-2 rounded-lg min-w-[64px] ${activeTab === 'chat' ? 'text-accent bg-purple-50' : 'text-gray-500'}`}><MessageCircle size={24} /><span className="text-[10px] mt-1 font-medium">מורה</span></button>
              </div>
            </div>
          </div>
        )}
      </main>

      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} userName={userName || ''} userPhoto={user.photoUrl || ''} onUpdate={handleUpdateProfile} />
    </div>
  );
};

export default App;
