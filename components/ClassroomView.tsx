
import React, { useState, useEffect, useRef } from 'react';
import { Classroom, ClassroomMaterial, Subject, Grade, User, Question, MaterialType, Flashcard, ClassroomSubmission } from '../types.ts';
import { generateSummary, generateQuestions, generateAssignment } from '../services/geminiService.ts';
import { 
  School, Plus, Users, UserPlus, BookOpen, FileText, PlusCircle, ArrowRight, Loader2, Sparkles, 
  Copy, Check, Trash2, X, ChevronLeft, Upload, FileDown, Info, Clock, Edit3, Eye, Send, ListChecks, ClipboardList, Layers, Hash, Rotate3d, Lightbulb, Play, Trophy, PlusSquare, MinusCircle, CheckCircle2, Calendar, Paperclip, AlertCircle, BellRing, Type as TypeIcon, MessageSquare, UserCircle, QrCode, ExternalLink, BarChart3, ShieldCheck
} from 'lucide-react';
import LatexRenderer from './LatexRenderer.tsx';

interface ClassroomMessage {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: number;
}

interface ClassroomViewProps {
  user: User;
  onBack: () => void;
  onStartTestPrep: (subject: Subject, grade: Grade, topic: string, days: number, attachment?: any) => void;
}

const ClassroomView: React.FC<ClassroomViewProps> = ({ user, onBack, onStartTestPrep }) => {
  const [classrooms, setClassrooms] = useState<Classroom[]>(() => {
    const saved = localStorage.getItem('user_classrooms');
    if (!saved) {
      return [{
        id: 'DEMO123',
        name: 'כיתת דוגמה - היסטוריה',
        subject: Subject.HISTORY,
        grade: Grade.GRADE_9,
        teacherName: 'המורה אלון',
        teacherId: 'system-demo',
        materials: [
          {
            id: 'm1',
            title: 'מבחן קרוב: המהפכה התעשייתית',
            type: 'UPCOMING_TEST',
            content: 'הנושאים למבחן כוללים את המצאת הקיטור, תנאי העבודה במפעלים ותהליכי העיור באירופה.',
            testDate: new Date(Date.now() + 86400000 * 5).toISOString(),
            timestamp: Date.now() - 86400000,
            isPublished: true
          }
        ],
        studentsCount: 24
      }];
    }
    return JSON.parse(saved);
  });
  
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [activeClassId, setActiveClassId] = useState<string | null>(null);
  const [activeMaterial, setActiveMaterial] = useState<ClassroomMaterial | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'MATERIALS' | 'CHAT'>('MATERIALS');

  // Student Interaction State
  const [activeSubTab, setActiveSubTab] = useState<'SUMMARY' | 'QUIZ' | 'SUBMIT' | 'SUBMISSIONS'>('SUMMARY');
  const [quizAnswers, setQuizAnswers] = useState<Record<string, any>>({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [studentSubmissionFile, setStudentSubmissionFile] = useState<{name: string, data: string, mimeType: string} | null>(null);
  const [viewingSubmission, setViewingSubmission] = useState<ClassroomSubmission | null>(null);

  // Chat State
  const [chatMessages, setChatMessages] = useState<ClassroomMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Teacher Workspace State
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [draftMaterial, setDraftMaterial] = useState<Partial<ClassroomMaterial>>({
    type: 'SUMMARY',
    title: '',
    content: '',
    questions: [],
    testDate: '',
    dueDate: '',
    teacherAttachments: []
  });
  const [aiMcqCount, setAiMcqCount] = useState(3);
  const [aiOpenCount, setAiOpenCount] = useState(2);

  // New class form
  const [joinCode, setJoinCode] = useState('');
  const [newClassName, setNewClassName] = useState('');
  const [newClassSubject, setNewClassSubject] = useState<Subject>(Subject.MATH);
  const [newClassGrade, setNewClassGrade] = useState<Grade>(Grade.GRADE_7);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const studentFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('user_classrooms', JSON.stringify(classrooms));
  }, [classrooms]);

  useEffect(() => {
    if (activeClassId) {
      const saved = localStorage.getItem(`chat_${activeClassId}`);
      if (saved) setChatMessages(JSON.parse(saved));
      else setChatMessages([]);
    }
  }, [activeClassId]);

  useEffect(() => {
    if (activeTab === 'CHAT') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, activeTab]);

  const activeClass = classrooms.find(c => c.id === activeClassId);
  const isTeacher = activeClass?.teacherId === user.id;

  const handleSendMessage = () => {
    if (!chatInput.trim() || !activeClassId) return;
    const newMessage: ClassroomMessage = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name || 'תלמיד',
      text: chatInput.trim(),
      timestamp: Date.now()
    };
    const updated = [...chatMessages, newMessage];
    setChatMessages(updated);
    localStorage.setItem(`chat_${activeClassId}`, JSON.stringify(updated));
    setChatInput('');
  };

  const handleCreateClass = () => {
    if (!newClassName.trim()) return;
    const newClass: Classroom = {
      id: Math.random().toString(36).substring(2, 8).toUpperCase(),
      name: newClassName,
      subject: newClassSubject,
      grade: newClassGrade,
      teacherName: user.name || 'מורה',
      teacherId: user.id,
      materials: [],
      studentsCount: 1
    };
    setClassrooms([newClass, ...classrooms]);
    setIsCreating(false);
    setNewClassName('');
    setActiveClassId(newClass.id);
  };

  const handleJoinClass = () => {
    if (!joinCode.trim()) return;
    const found = classrooms.some(c => c.id === joinCode.toUpperCase());
    if (found) {
      setActiveClassId(joinCode.toUpperCase());
      setIsJoining(false);
      return;
    }
    alert("הכיתה לא נמצאה.");
    setIsJoining(false);
    setJoinCode('');
  };

  const startNewMaterial = () => {
    // Robust check: Only creator can open workspace
    if (!isTeacher) {
      alert("רק מורה הכיתה רשאי להוסיף חומרים.");
      return;
    }
    setDraftMaterial({ type: 'SUMMARY', title: '', content: '', questions: [], testDate: '', dueDate: '', teacherAttachments: [] });
    setWorkspaceOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = (reader.result as string).split(',')[1];
        setDraftMaterial(prev => ({
          ...prev,
          teacherAttachments: [...(prev.teacherAttachments || []), { name: file.name, data: base64Data, mimeType: file.type }]
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateAIContent = async () => {
    if (!activeClass || !draftMaterial.title || !isTeacher) return;
    if (draftMaterial.type === 'ASSIGNMENT' || draftMaterial.type === 'UPCOMING_TEST') return; 
    
    setLoading(true);
    try {
      if (draftMaterial.type === 'SUMMARY') {
        const result = await generateSummary(activeClass.subject, activeClass.grade, draftMaterial.title);
        setDraftMaterial(prev => ({ ...prev, content: result }));
      } else if (draftMaterial.type === 'TEST') {
        const questions = await generateQuestions(
          activeClass.subject, 
          activeClass.grade, 
          draftMaterial.title, 
          [], 
          aiMcqCount + aiOpenCount, 
          'MEDIUM',
          aiMcqCount,
          aiOpenCount
        );
        setDraftMaterial(prev => ({ ...prev, questions }));
      }
    } catch (e) {
      alert("שגיאה בייצור תוכן מה-AI.");
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = () => {
    if (!activeClassId || !draftMaterial.title || !isTeacher) return;
    const newMat: ClassroomMaterial = {
      id: Date.now().toString(),
      title: draftMaterial.title,
      type: draftMaterial.type as MaterialType,
      content: draftMaterial.content || '',
      questions: draftMaterial.questions || [],
      testDate: draftMaterial.testDate,
      dueDate: draftMaterial.dueDate,
      timestamp: Date.now(),
      isPublished: true,
      teacherAttachments: draftMaterial.teacherAttachments,
      submissions: []
    };
    setClassrooms(classrooms.map(c => 
      c.id === activeClassId ? { ...c, materials: [newMat, ...c.materials] } : c
    ));
    setWorkspaceOpen(false);
  };

  const handleStudentFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = (reader.result as string).split(',')[1];
        setStudentSubmissionFile({ name: file.name, data: base64Data, mimeType: file.type });
      };
      reader.readAsDataURL(file);
    }
  };

  // Helper for Unicode-safe Base64
  const toBase64Unicode = (str: string) => {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
      return String.fromCharCode(parseInt(p1, 16));
    }));
  };

  const handleStudentSubmit = () => {
    if (!activeClassId || !activeMaterial) return;

    const submission: ClassroomSubmission = {
      studentId: user.id,
      studentName: user.name || 'תלמיד',
      timestamp: Date.now(),
      attachment: studentSubmissionFile || { 
        name: 'תשובות_מבחן.json', 
        data: toBase64Unicode(JSON.stringify(quizAnswers)), 
        mimeType: 'application/json' 
      },
      quizResults: quizAnswers
    };

    const updatedMaterial = { 
      ...activeMaterial, 
      submissions: [...(activeMaterial.submissions || []), submission] 
    };

    const updatedClassrooms = classrooms.map(c => {
      if (c.id === activeClassId) {
        return {
          ...c,
          materials: c.materials.map(m => (m.id === activeMaterial.id ? updatedMaterial : m))
        };
      }
      return c;
    });

    setClassrooms(updatedClassrooms);
    setActiveMaterial(updatedMaterial); // Critical: Update current view
    setQuizFinished(true);
    alert("ההגשה בוצעה בהצלחה!");
  };

  const openMaterial = (m: ClassroomMaterial) => {
    setActiveMaterial(m);
    setQuizAnswers({});
    setQuizFinished(false);
    setViewingSubmission(null);
    
    // Logic to set default tab based on role and type
    if (m.type === 'TEST') {
      if (isTeacher) setActiveSubTab('SUBMISSIONS');
      else setActiveSubTab('QUIZ');
    } else if (m.type === 'ASSIGNMENT') {
      if (isTeacher) setActiveSubTab('SUMMARY');
      else setActiveSubTab('SUMMARY'); // Students still see instructions first
    } else {
      setActiveSubTab('SUMMARY');
    }
    setStudentSubmissionFile(null);
  };

  const handleStartPrepFromMaterial = (mat: ClassroomMaterial) => {
    if (!activeClass) return;
    
    let prepDays = 3; 
    if (mat.testDate) {
      const now = new Date();
      const testDate = new Date(mat.testDate);
      const diffTime = testDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      prepDays = Math.max(1, Math.min(14, diffDays));
    }
    
    const context = `מבחן בנושא: ${mat.title}\nתיאור וחומר למבחן: ${mat.content}`;
    const mainAttachment = mat.teacherAttachments?.[0];
    onStartTestPrep(activeClass.subject, activeClass.grade, context, prepDays, mainAttachment);
  };

  const calculateScore = (submission: ClassroomSubmission, questions: Question[]) => {
    if (!submission.quizResults || !questions) return 0;
    const mcqs = questions.filter(q => q.type === 'MCQ');
    if (mcqs.length === 0) return 0;
    
    let correct = 0;
    mcqs.forEach(q => {
      if (submission.quizResults![q.id] === q.correctIndex) correct++;
    });
    return Math.round((correct / mcqs.length) * 100);
  };

  if (activeMaterial) {
    const isTest = activeMaterial.type === 'TEST';
    const isAssignment = activeMaterial.type === 'ASSIGNMENT';
    const isUpcomingTest = activeMaterial.type === 'UPCOMING_TEST';
    const mySubmission = activeMaterial.submissions?.find(s => s.studentId === user.id);

    return (
      <div className="max-w-5xl mx-auto p-4 md:p-8 animate-fade-in no-print">
        <button onClick={() => setActiveMaterial(null)} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 font-bold group">
          <ArrowRight size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>חזרה לכיתה</span>
        </button>

        <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 min-h-[600px] flex flex-col overflow-hidden">
          <div className={`p-8 md:p-12 relative text-white ${isUpcomingTest ? 'bg-gradient-to-br from-orange-600 to-yellow-600' : isTest ? 'bg-gradient-to-br from-indigo-700 to-purple-800' : isAssignment ? 'bg-gradient-to-br from-emerald-600 to-teal-700' : 'bg-gray-900'}`}>
             <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="text-right">
                    <div className="flex items-center gap-2 text-white/80 font-bold text-xs uppercase mb-2">
                       {isUpcomingTest ? <BellRing size={16} /> : isTest ? <ListChecks size={16} /> : isAssignment ? <ClipboardList size={16} /> : <FileText size={16} />}
                       <span>{isUpcomingTest ? 'מבחן קרוב' : isTest ? 'מבחן כיתה' : isAssignment ? 'עבודה להגשה' : 'חומר לימודי'}</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black">{activeMaterial.title}</h2>
                    {activeMaterial.testDate && <div className="mt-3 bg-white/20 px-4 py-1 rounded-full text-sm font-bold w-fit flex items-center gap-2"><Calendar size={16}/> מועד: {new Date(activeMaterial.testDate).toLocaleDateString('he-IL')}</div>}
                    {activeMaterial.dueDate && <div className="mt-3 bg-red-500/30 px-4 py-1 rounded-full text-sm font-bold w-fit flex items-center gap-2"><Clock size={16}/> להגשה עד: {new Date(activeMaterial.dueDate).toLocaleDateString('he-IL')}</div>}
                </div>
                {isUpcomingTest && !isTeacher && (
                    <button onClick={() => handleStartPrepFromMaterial(activeMaterial)} className="bg-white text-orange-600 px-8 py-4 rounded-2xl font-black flex items-center gap-2 shadow-lg hover:scale-105 transition-all">
                        <Sparkles size={20} /> התחל הכנה למבחן
                    </button>
                )}
                {isTeacher && (
                  <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-[2rem] border border-white/20 flex flex-col items-center">
                    <ShieldCheck size={24} className="text-blue-300 mb-1" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-100">מצב מורה</span>
                  </div>
                )}
             </div>
             
             <div className="flex gap-2 mt-8 overflow-x-auto no-scrollbar relative z-10">
                {/* 
                  Logic: 
                  - SUMMARY is hidden for tests as requested.
                  - SUMMARY is visible for Assignments and other materials.
                */}
                {!isTest && <button onClick={() => {setActiveSubTab('SUMMARY'); setViewingSubmission(null);}} className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeSubTab === 'SUMMARY' ? 'bg-white text-gray-900' : 'bg-white/10 text-white/60'}`}>הוראות ותוכן</button>}
                
                {/* Students see QUIZ or SUBMIT */}
                {isTest && !isTeacher && <button onClick={() => setActiveSubTab('QUIZ')} className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeSubTab === 'QUIZ' ? 'bg-white text-gray-900' : 'bg-white/10 text-white/60'}`}>ביצוע המבחן</button>}
                {isAssignment && !isTeacher && <button onClick={() => setActiveSubTab('SUBMIT')} className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeSubTab === 'SUBMIT' ? 'bg-white text-gray-900' : 'bg-white/10 text-white/60'}`}>העלאת פתרון</button>}
                
                {/* Teacher sees SUBMISSIONS for both tests and assignments */}
                {isTeacher && (isTest || isAssignment) && (
                  <button onClick={() => {setActiveSubTab('SUBMISSIONS'); setViewingSubmission(null);}} className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeSubTab === 'SUBMISSIONS' ? 'bg-white text-gray-900' : 'bg-white/10 text-white/60'}`}>
                    הגשות ({activeMaterial.submissions?.length || 0})
                  </button>
                )}
             </div>
          </div>

          <div className="p-8 md:p-12 overflow-y-auto flex-1 bg-gray-50/30">
             {activeSubTab === 'SUMMARY' && !isTest && (
                <div className="max-w-4xl mx-auto space-y-8">
                   <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-gray-100">
                      <LatexRenderer text={activeMaterial.content} />
                   </div>
                   {activeMaterial.teacherAttachments && activeMaterial.teacherAttachments.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="font-bold text-gray-800 px-2">קבצים מצורפים:</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {activeMaterial.teacherAttachments.map((f, i) => (
                             <a key={i} href={`data:${f.mimeType};base64,${f.data}`} download={f.name} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 hover:border-blue-500 transition-all shadow-sm">
                                <span className="text-sm font-bold truncate max-w-[150px]">{f.name}</span>
                                <FileDown size={18} className="text-blue-500" />
                             </a>
                          ))}
                        </div>
                      </div>
                   )}
                </div>
             )}

             {activeSubTab === 'SUBMIT' && isAssignment && !isTeacher && (
                <div className="max-w-2xl mx-auto py-10 text-center">
                   <h3 className="text-2xl font-black mb-6">העלאת עבודה פתורה</h3>
                   {mySubmission ? (
                     <div className="bg-green-50 border-2 border-green-200 p-8 rounded-3xl">
                        <CheckCircle2 size={48} className="text-green-600 mx-auto mb-4" />
                        <h4 className="font-black text-green-900">העבודה הוגשה בהצלחה!</h4>
                        <p className="text-sm text-green-700 mt-2">קובץ: {mySubmission.attachment.name}</p>
                     </div>
                   ) : (
                     <div className="space-y-6">
                        <div className="border-4 border-dashed border-gray-200 rounded-[2rem] p-10 hover:border-emerald-300 transition-all cursor-pointer" onClick={() => studentFileInputRef.current?.click()}>
                           <input type="file" ref={studentFileInputRef} onChange={handleStudentFileUpload} className="hidden" />
                           {studentSubmissionFile ? <div className="flex flex-col items-center gap-2"><FileText size={48} className="text-emerald-500" /><span className="font-bold">{studentSubmissionFile.name}</span></div> : <div className="flex flex-col items-center gap-2"><PlusCircle size={48} className="text-gray-200" /><span className="text-gray-400 font-bold">לחץ להעלאת הפתרון</span></div>}
                        </div>
                        <button disabled={!studentSubmissionFile} onClick={handleStudentSubmit} className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-xl shadow-lg hover:bg-emerald-700 disabled:opacity-30">הגש למורה</button>
                     </div>
                   )}
                </div>
             )}

             {activeSubTab === 'QUIZ' && isTest && !isTeacher && (
                <div className="max-w-4xl mx-auto space-y-8">
                   {activeMaterial.questions?.map((q, i) => (
                      <div key={i} className={`bg-white p-8 rounded-[2rem] shadow-sm border-2 ${quizFinished ? 'border-gray-50' : 'border-gray-100'}`}>
                         <div className="flex items-center justify-between mb-4">
                             <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded-md">
                                 {q.type === 'OPEN' ? 'שאלה פתוחה' : 'שאלה אמריקאית'}
                             </div>
                         </div>
                         <h4 className="text-xl font-bold mb-6 flex gap-3"><span className="bg-gray-100 px-3 py-1 rounded-lg text-sm text-gray-400">{i+1}</span><LatexRenderer text={q.text} /></h4>
                         {q.type === 'OPEN' ? (
                            <div className="space-y-4">
                               <textarea disabled={quizFinished} value={quizAnswers[q.id] || ''} onChange={(e) => setQuizAnswers({...quizAnswers, [q.id]: e.target.value})} placeholder="כתוב את תשובתך כאן..." className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl min-h-[120px] outline-none focus:border-indigo-500 transition-all font-bold"/>
                               {quizFinished && (
                                 <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 animate-fade-in">
                                    <p className="text-xs font-black text-blue-800 uppercase mb-2">תשובת מודל להשוואה:</p>
                                    <LatexRenderer text={q.modelAnswer || q.explanation} />
                                 </div>
                               )}
                            </div>
                         ) : (
                            <div className="grid gap-3">
                               {q.options.map((opt, oi) => {
                                  const isSelected = quizAnswers[q.id] === oi;
                                  const isCorrect = oi === q.correctIndex;
                                  let btnClass = "border-gray-100 hover:bg-gray-50";
                                  if (quizFinished) {
                                     if (isCorrect) btnClass = "border-green-500 bg-green-50 text-green-800";
                                     else if (isSelected) btnClass = "border-red-500 bg-red-50 text-red-800";
                                     else btnClass = "opacity-40 grayscale pointer-events-none";
                                  } else if (isSelected) btnClass = "border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm";
                                  return (
                                     <button key={oi} disabled={quizFinished} onClick={() => setQuizAnswers({...quizAnswers, [q.id]: oi})} className={`p-5 rounded-2xl border-2 text-right transition-all font-bold flex justify-between items-center group ${btnClass}`}><LatexRenderer text={opt} />{quizFinished && isCorrect && <CheckCircle2 size={22} className="text-green-600" />}</button>
                                  );
                               })}
                            </div>
                         )}
                      </div>
                   ))}
                   <div className="pt-8 pb-12">
                      {!quizFinished && !mySubmission ? (
                         <button disabled={Object.keys(quizAnswers).length < (activeMaterial.questions?.length || 0)} onClick={handleStudentSubmit} className="w-full bg-indigo-600 text-white py-5 rounded-3xl font-black text-xl shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-3"><Send size={24} /><span>הגש מבחן וקבל ציון</span></button>
                      ) : (
                        <div className="bg-white p-8 rounded-3xl text-center border-2 border-green-500 shadow-xl animate-fade-in"><Trophy size={48} className="mx-auto mb-4 text-yellow-400" /><h3 className="text-2xl font-black mb-2">המבחן הוגש!</h3><button onClick={() => setActiveMaterial(null)} className="mt-4 bg-gray-900 text-white px-10 py-3 rounded-2xl font-bold">חזור לכיתה</button></div>
                      )}
                   </div>
                </div>
             )}

             {activeSubTab === 'SUBMISSIONS' && isTeacher && (
                <div className="max-w-5xl mx-auto space-y-10 animate-fade-in pb-20">
                   {viewingSubmission ? (
                      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden flex flex-col animate-slide-up">
                         <div className="bg-gray-900 p-6 flex justify-between items-center text-white">
                            <div className="flex items-center gap-4">
                               <button onClick={() => setViewingSubmission(null)} className="p-2 hover:bg-white/10 rounded-full transition-all"><ArrowRight size={20}/></button>
                               <div><h3 className="font-black text-xl">{viewingSubmission.studentName}</h3><p className="text-xs text-gray-400">תשובות למבחן • {new Date(viewingSubmission.timestamp).toLocaleString()}</p></div>
                            </div>
                            {isTest && <div className="bg-indigo-500 px-4 py-2 rounded-xl text-lg font-black shadow-lg">ציון: {calculateScore(viewingSubmission, activeMaterial.questions || [])}</div>}
                         </div>
                         <div className="p-8 md:p-12 space-y-10 overflow-y-auto max-h-[600px] bg-gray-50/50">
                            {activeMaterial.questions?.map((q, i) => {
                               const studentAnswer = viewingSubmission.quizResults?.[q.id];
                               const isCorrect = q.type === 'MCQ' ? studentAnswer === q.correctIndex : null;
                               return (
                                  <div key={i} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
                                     <div className="flex items-center justify-between">
                                        <h4 className="font-bold text-lg flex gap-3"><span className="text-gray-400">{i+1}.</span><LatexRenderer text={q.text} /></h4>
                                        {q.type === 'MCQ' && (
                                           <div className={`px-4 py-1 rounded-full text-xs font-black uppercase ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                              {isCorrect ? 'נכון' : 'טעות'}
                                           </div>
                                        )}
                                     </div>
                                     <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                        <p className="text-xs font-black text-gray-400 uppercase mb-2">תשובת התלמיד:</p>
                                        <div className="font-bold text-gray-800">
                                           {q.type === 'MCQ' ? (
                                              <LatexRenderer text={q.options[studentAnswer] || "לא נענה"} />
                                           ) : (
                                              <LatexRenderer text={studentAnswer || "לא נענה"} />
                                           )}
                                        </div>
                                     </div>
                                     {(!isCorrect || q.type === 'OPEN') && (
                                        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                                           <p className="text-xs font-black text-blue-800 uppercase mb-2">תשובה נכונה/מודל:</p>
                                           <LatexRenderer text={q.type === 'MCQ' ? q.options[q.correctIndex] : q.modelAnswer || q.explanation} />
                                        </div>
                                     )}
                                  </div>
                               );
                            })}
                         </div>
                      </div>
                   ) : (
                      <div className="space-y-6">
                         <div className="flex items-center justify-between px-2">
                             <h3 className="text-2xl font-black text-gray-800 flex items-center gap-3"><div className="bg-indigo-100 p-2 rounded-xl text-indigo-600"><Users size={24}/></div>הגשות תלמידים</h3>
                             <div className="flex gap-4">
                                <div className="bg-white px-4 py-2 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3"><BarChart3 size={18} className="text-indigo-500"/><span className="text-xs font-bold text-gray-500">ממוצע כיתתי: {
                                   activeMaterial.submissions?.length ? Math.round(activeMaterial.submissions.reduce((acc, s) => acc + calculateScore(s, activeMaterial.questions || []), 0) / activeMaterial.submissions.length) : 0
                                }%</span></div>
                             </div>
                         </div>
                         <div className="grid gap-4">
                            {activeMaterial.submissions?.length === 0 ? (
                               <div className="bg-white p-20 rounded-[3rem] border-2 border-dashed text-center text-gray-400">טרם התקבלו הגשות.</div>
                            ) : (
                               activeMaterial.submissions?.map((s, i) => (
                                  <div key={i} className="bg-white p-6 rounded-[2rem] border-2 border-gray-50 hover:border-indigo-200 transition-all shadow-sm flex items-center justify-between group">
                                     <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-lg shadow-inner">{s.studentName[0]}</div>
                                        <div>
                                           <h4 className="font-black text-gray-900">{s.studentName}</h4>
                                           <p className="text-xs text-gray-400 flex items-center gap-2"><Clock size={12}/> הוגש ב-{new Date(s.timestamp).toLocaleString()}</p>
                                        </div>
                                     </div>
                                     <div className="flex items-center gap-8">
                                        {isTest && (
                                           <div className="text-left">
                                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">ציון</span>
                                              <span className={`text-xl font-black ${calculateScore(s, activeMaterial.questions || []) >= 80 ? 'text-green-600' : 'text-indigo-600'}`}>{calculateScore(s, activeMaterial.questions || [])}</span>
                                           </div>
                                        )}
                                        <div className="flex gap-2">
                                           {isTest && (
                                              <button onClick={() => setViewingSubmission(s)} className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm group/btn"><Eye size={18}/></button>
                                           )}
                                           <a href={`data:${s.attachment.mimeType};base64,${s.attachment.data}`} download={s.attachment.name} className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"><FileDown size={18}/></a>
                                        </div>
                                     </div>
                                  </div>
                               ))
                            )}
                         </div>
                      </div>
                   )}
                </div>
             )}
          </div>
        </div>
      </div>
    );
  }

  // Teacher Workspace Overlay
  if (workspaceOpen) {
    // Robust internal component check
    if (!isTeacher) return null;

    const isTest = draftMaterial.type === 'TEST';
    const isUpcomingTest = draftMaterial.type === 'UPCOMING_TEST';
    const isAssignment = draftMaterial.type === 'ASSIGNMENT';

    return (
      <div className="fixed inset-0 z-[60] bg-white flex flex-col animate-slide-up overflow-hidden">
        <div className="h-20 bg-gray-900 text-white flex justify-between items-center px-6 shrink-0">
          <div className="flex items-center gap-4">
             <button onClick={() => setWorkspaceOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-all"><X size={24} /></button>
             <h2 className="font-black text-lg">יצירת תוכן - {activeClass?.name}</h2>
          </div>
          <button onClick={handlePublish} disabled={!draftMaterial.title} className="bg-blue-600 hover:bg-blue-500 disabled:opacity-30 px-8 py-2 rounded-xl font-black shadow-lg transition-all">פרסם לכיתה</button>
        </div>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-gray-50">
          <div className="w-full md:w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto space-y-8">
             <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">סוג החומר</label>
                <div className="grid gap-2">
                   {(['SUMMARY', 'ASSIGNMENT', 'TEST', 'UPCOMING_TEST'] as MaterialType[]).map(t => (
                     <button key={t} onClick={() => setDraftMaterial({...draftMaterial, type: t})} className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all font-bold text-sm ${draftMaterial.type === t ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-100 text-gray-400 hover:bg-gray-50'}`}>
                        {t === 'SUMMARY' ? <FileText size={18} /> : t === 'TEST' ? <ListChecks size={18} /> : t === 'UPCOMING_TEST' ? <BellRing size={18} /> : <ClipboardList size={18} />}
                        <span>{t === 'SUMMARY' ? 'סיכום' : t === 'TEST' ? 'מבחן להגשה' : t === 'UPCOMING_TEST' ? 'מבחן קרוב' : 'עבודה להגשה'}</span>
                     </button>
                   ))}
                </div>
             </div>

             {isUpcomingTest && (
               <div>
                  <label className="block text-xs font-black text-gray-400 uppercase mb-3">תאריך המבחן</label>
                  <input type="date" value={draftMaterial.testDate} onChange={(e) => setDraftMaterial({...draftMaterial, testDate: e.target.value})} className="w-full p-3 bg-gray-50 border rounded-xl font-bold"/>
               </div>
             )}

             {(isAssignment || isTest) && (
               <div>
                  <label className="block text-xs font-black text-gray-400 uppercase mb-3">תאריך הגשה סופי</label>
                  <input type="date" value={draftMaterial.dueDate} onChange={(e) => setDraftMaterial({...draftMaterial, dueDate: e.target.value})} className="w-full p-3 bg-gray-50 border rounded-xl font-bold"/>
               </div>
             )}

             {isTest && (
                <div className="space-y-4 bg-gray-50 p-4 rounded-2xl border border-gray-200">
                    <h4 className="text-xs font-black text-gray-400 uppercase">הגדרות כמות שאלות (AI)</h4>
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">אמריקאיות:</span>
                        <div className="flex items-center gap-3">
                            <button onClick={() => setAiMcqCount(Math.max(0, aiMcqCount-1))} className="w-6 h-6 bg-white border rounded flex items-center justify-center font-bold text-xs">-</button>
                            <span className="font-bold text-sm w-4 text-center">{aiMcqCount}</span>
                            <button onClick={() => setAiMcqCount(Math.min(10, aiMcqCount+1))} className="w-6 h-6 bg-white border rounded flex items-center justify-center font-bold text-xs">+</button>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">פתוחות:</span>
                        <div className="flex items-center gap-3">
                            <button onClick={() => setAiOpenCount(Math.max(0, aiOpenCount-1))} className="w-6 h-6 bg-white border rounded flex items-center justify-center font-bold text-xs">-</button>
                            <span className="font-bold text-sm w-4 text-center">{aiOpenCount}</span>
                            <button onClick={() => setAiOpenCount(Math.min(10, aiOpenCount+1))} className="w-6 h-6 bg-white border rounded flex items-center justify-center font-bold text-xs">+</button>
                        </div>
                    </div>
                </div>
             )}

             <div>
                <label className="block text-xs font-black text-gray-400 uppercase mb-3">קבצים (דפי חזרה / הנחיות)</label>
                <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 font-bold hover:border-blue-400">
                   <Paperclip size={18} /> צרף קובץ
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                <div className="mt-3 space-y-2">
                   {draftMaterial.teacherAttachments?.map((f, i) => (
                      <div key={i} className="flex justify-between p-2 bg-gray-50 rounded-lg text-xs font-medium border">
                         <span className="truncate flex-1">{f.name}</span>
                         <button onClick={() => setDraftMaterial({...draftMaterial, teacherAttachments: draftMaterial.teacherAttachments?.filter((_, idx) => idx !== i)})} className="text-red-400 ml-2"><X size={14}/></button>
                      </div>
                   ))}
                </div>
             </div>

             {!isAssignment && !isUpcomingTest && (
                <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100">
                    <h4 className="text-sm font-black text-blue-800 mb-2 flex items-center gap-2"><Sparkles size={16} /> סיוע מהיר (AI)</h4>
                    <button onClick={handleGenerateAIContent} disabled={loading || !draftMaterial.title} className="w-full bg-blue-600 text-white py-3 rounded-xl text-xs font-bold shadow-md hover:bg-blue-700 flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />} ייצר טיוטה חכמה
                    </button>
                </div>
             )}
          </div>

          <div className="flex-1 overflow-y-auto p-6 md:p-12">
             <div className="max-w-4xl mx-auto pb-24">
                <input type="text" value={draftMaterial.title} onChange={(e) => setDraftMaterial({...draftMaterial, title: e.target.value})} placeholder="כותרת החומר / המבחן..." className="w-full bg-transparent border-b-2 border-gray-100 focus:border-blue-600 outline-none text-4xl font-black text-gray-900 transition-all py-2 text-right mb-10" />

                {isTest ? (
                   <div className="space-y-8">
                      <div className="flex items-center justify-between">
                          <h4 className="font-black text-xl">בניית שאלות המבחן</h4>
                          <div className="flex gap-2">
                            <button onClick={() => setDraftMaterial({...draftMaterial, questions: [...(draftMaterial.questions || []), { id: `q-${Date.now()}`, type: 'MCQ', text: '', options: ['', '', '', ''], correctIndex: 0, explanation: '' }]})} className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2"><PlusSquare size={16}/> שאלה אמריקאית</button>
                            <button onClick={() => setDraftMaterial({...draftMaterial, questions: [...(draftMaterial.questions || []), { id: `q-${Date.now()}`, type: 'OPEN', text: '', options: [], correctIndex: 0, modelAnswer: '', explanation: '' }]})} className="bg-purple-50 text-purple-600 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2"><TypeIcon size={16}/> שאלה פתוחה</button>
                          </div>
                      </div>
                      {draftMaterial.questions?.map((q, i) => (
                         <div key={q.id} className="bg-white p-8 rounded-3xl border border-gray-100 space-y-6 relative">
                            <button onClick={() => setDraftMaterial({...draftMaterial, questions: draftMaterial.questions?.filter((_, idx) => idx !== i)})} className="absolute top-6 left-6 text-gray-300 hover:text-red-500"><MinusCircle size={20} /></button>
                            <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest">{q.type === 'MCQ' ? 'שאלה אמריקאית' : 'שאלה פתוחה'}</div>
                            <input value={q.text} onChange={(e) => {
                              const qs = [...(draftMaterial.questions || [])];
                              qs[i].text = e.target.value;
                              setDraftMaterial({...draftMaterial, questions: qs});
                            }} placeholder="תוכן השאלה..." className="w-full p-4 bg-gray-50 border rounded-2xl outline-none focus:border-blue-600 font-bold" />
                            
                            {q.type === 'MCQ' ? (
                               <div className="grid md:grid-cols-2 gap-4">
                                  {q.options.map((opt, oi) => (
                                     <div key={oi} className="flex items-center gap-3">
                                           <input type="radio" checked={q.correctIndex === oi} onChange={() => {
                                              const qs = [...(draftMaterial.questions || [])];
                                              qs[i].correctIndex = oi;
                                              setDraftMaterial({...draftMaterial, questions: qs});
                                           }} />
                                           <input value={opt} onChange={(e) => {
                                              const qs = [...(draftMaterial.questions || [])];
                                              qs[i].options[oi] = e.target.value;
                                              setDraftMaterial({...draftMaterial, questions: qs});
                                           }} placeholder={`אפשרות ${oi+1}`} className="flex-1 p-3 bg-gray-50 border rounded-xl text-sm" />
                                     </div>
                                  ))}
                               </div>
                            ) : (
                               <textarea value={q.modelAnswer} onChange={(e) => {
                                  const qs = [...(draftMaterial.questions || [])];
                                  qs[i].modelAnswer = e.target.value;
                                  setDraftMaterial({...draftMaterial, questions: qs});
                               }} placeholder="תשובה מצופה / מודל (לתלמיד להשוואה)..." className="w-full p-4 bg-gray-50 border rounded-2xl min-h-[100px] text-sm"/>
                            )}
                         </div>
                      ))}
                   </div>
                ) : (
                   <textarea value={draftMaterial.content} onChange={(e) => setDraftMaterial({...draftMaterial, content: e.target.value})} placeholder={isUpcomingTest ? "פרט כאן את נושאי המבחן ודגשים..." : isAssignment ? "כתוב כאן את ההנחיות לעבודה עבור התלמידים..." : "כתוב כאן את תוכן הסיכום..."} className="w-full h-[500px] bg-white p-10 rounded-[2.5rem] border outline-none focus:border-blue-600 text-right text-lg" />
                )}
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 animate-fade-in pb-20">
      {activeClass ? (
        <div className="space-y-8">
            <div className="flex items-center justify-between mb-4">
                <button onClick={() => setActiveClassId(null)} className="p-4 bg-white hover:bg-gray-50 border border-gray-100 rounded-3xl shadow-sm transition-all group">
                   <ArrowRight size={24} className="group-hover:-translate-x-1 transition-transform" />
                </button>
                <div className="text-right flex items-center gap-4">
                    {isTeacher && (
                      <div className="hidden md:flex items-center gap-2 bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-200">
                        <ShieldCheck size={14} />
                        מורה הכיתה
                      </div>
                    )}
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">{activeClass.name}</h2>
                        <div className="flex items-center gap-2 justify-end mt-1 text-gray-400 font-bold text-sm">
                           <span>{activeClass.subject}</span>
                           <div className="w-1 h-1 bg-gray-300 rounded-full" />
                           <span>{activeClass.grade}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-center mb-6">
                <div className="bg-white/60 backdrop-blur-md p-1.5 rounded-3xl shadow-sm border border-gray-100 flex gap-1">
                    <button 
                        onClick={() => setActiveTab('MATERIALS')}
                        className={`flex items-center gap-2 px-8 py-3 rounded-2xl text-sm font-black transition-all ${activeTab === 'MATERIALS' ? 'bg-gray-900 text-white shadow-xl scale-105' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <BookOpen size={18} />
                        חומרי למידה
                    </button>
                    <button 
                        onClick={() => setActiveTab('CHAT')}
                        className={`flex items-center gap-2 px-8 py-3 rounded-2xl text-sm font-black transition-all ${activeTab === 'CHAT' ? 'bg-gray-900 text-white shadow-xl scale-105' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <MessageSquare size={18} />
                        דיון כיתתי
                    </button>
                </div>
            </div>

            {activeTab === 'MATERIALS' ? (
                <div className="grid lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-8 animate-fade-in">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-2xl font-black text-gray-800 flex items-center gap-3">
                                <div className="bg-blue-100 p-2 rounded-xl text-blue-600 shadow-sm"><BookOpen size={24} /></div>
                                חומרים ומבחנים
                            </h3>
                            {isTeacher && <button onClick={startNewMaterial} className="bg-primary text-white px-6 py-2.5 rounded-2xl text-sm font-black shadow-lg shadow-blue-200 hover:bg-blue-600 hover:-translate-y-0.5 transition-all flex items-center gap-2"><PlusCircle size={18} /> הוסף תוכן</button>}
                        </div>
                        <div className="grid gap-5">
                        {activeClass.materials.length > 0 ? activeClass.materials.map(material => {
                            const isUpcoming = material.type === 'UPCOMING_TEST';
                            const isTest = material.type === 'TEST';
                            const isAssignment = material.type === 'ASSIGNMENT';
                            return (
                            <button key={material.id} onClick={() => openMaterial(material)} className={`w-full flex items-center justify-between p-7 bg-white rounded-[2.5rem] shadow-sm border-2 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group text-right ${isUpcoming ? 'border-orange-50 bg-orange-50/10' : isTest ? 'border-indigo-50 bg-indigo-50/10' : isAssignment ? 'border-emerald-50 bg-emerald-50/10' : 'border-gray-50'}`}>
                                <div className="flex items-center gap-6">
                                    <div className={`p-5 rounded-[1.75rem] text-white shadow-lg ${isUpcoming ? 'bg-gradient-to-br from-orange-400 to-orange-600' : isTest ? 'bg-gradient-to-br from-indigo-500 to-indigo-700' : isAssignment ? 'bg-gradient-to-br from-emerald-500 to-emerald-700' : 'bg-gradient-to-br from-blue-400 to-blue-600'}`}>
                                    {isUpcoming ? <BellRing size={26} /> : isTest ? <ListChecks size={26} /> : isAssignment ? <ClipboardList size={26} /> : <FileText size={26} />}
                                    </div>
                                    <div className="space-y-1">
                                    <h4 className="font-black text-gray-900 text-xl group-hover:text-blue-600 transition-colors">{material.title}</h4>
                                    <div className="flex items-center gap-3 text-xs text-gray-400 font-bold uppercase tracking-tight">
                                        <span className={`px-2 py-0.5 rounded-md ${isUpcoming ? 'text-orange-600 bg-orange-100' : isTest ? 'text-indigo-600 bg-indigo-100' : isAssignment ? 'text-emerald-600 bg-emerald-100' : 'text-blue-600 bg-blue-100'}`}>
                                            {isUpcoming ? 'מבחן קרוב' : isTest ? 'מבחן להגשה' : isAssignment ? 'עבודה' : 'סיכום לימודי'}
                                        </span>
                                        {material.dueDate && <span className="text-red-500 flex items-center gap-1"><Clock size={12} /> עד: {new Date(material.dueDate).toLocaleDateString('he-IL')}</span>}
                                    </div>
                                    </div>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-full group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                   <ChevronLeft size={20} className="rotate-180" />
                                </div>
                            </button>
                            );
                        }) : (
                            <div className="bg-white/50 p-20 rounded-[3rem] border-2 border-dashed border-gray-100 text-center flex flex-col items-center gap-4">
                                <div className="p-4 bg-gray-50 rounded-full text-gray-300"><FileText size={48} /></div>
                                <p className="text-gray-400 font-bold text-lg">אין עדיין חומרי לימוד בכיתה זו.</p>
                            </div>
                        )}
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-br-[4rem] -z-0 transition-transform group-hover:scale-110" />
                            <h3 className="text-xl font-black mb-8 flex items-center gap-3 relative z-10"><div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Users size={22} /></div>מידע כיתתי</h3>
                            <div className="space-y-6 relative z-10">
                                <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                                    <span className="text-xs text-gray-400 font-black uppercase">מורה</span>
                                    <span className="text-sm font-black text-gray-800">{activeClass.teacherName}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                                    <span className="text-xs text-gray-400 font-black uppercase">תלמידים</span>
                                    <span className="text-sm font-black text-gray-800">{activeClass.studentsCount} רשומים</span>
                                </div>
                                <div className="pt-2">
                                    <span className="block text-[10px] font-black text-gray-400 mb-3 uppercase tracking-widest text-center">קוד כיתה להצטרפות</span>
                                    <div className="bg-gray-900 p-6 rounded-[2rem] font-mono font-black text-white text-3xl flex items-center justify-between shadow-2xl group/code">
                                        <span className="tracking-tighter">{activeClass.id}</span>
                                        <button onClick={() => { navigator.clipboard.writeText(activeClass.id); alert('הקוד הועתק!'); }} className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all"><Copy size={20}/></button>
                                    </div>
                                </div>
                                <div className="pt-6">
                                    <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100/50 flex items-start gap-4">
                                        <div className="p-2 bg-white rounded-xl shadow-sm text-blue-600"><QrCode size={18} /></div>
                                        <p className="text-[11px] font-bold text-blue-800 leading-relaxed">שתף את הקוד עם התלמידים. הקוד מאפשר להם להיכנס לכיתה ולצפות בחומרים בזמן אמת.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="max-w-4xl mx-auto h-[650px] bg-white rounded-[3rem] shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-fade-in">
                    <div className="bg-gray-900 p-6 text-white flex items-center justify-between px-10">
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-500 p-2.5 rounded-2xl shadow-lg shadow-blue-500/20"><MessageSquare size={22} className="text-white" /></div>
                            <div>
                                <h3 className="font-black text-lg">דיון כיתתי</h3>
                                <p className="text-[10px] text-gray-400 font-bold uppercase">{activeClass.name}</p>
                            </div>
                        </div>
                        <div className="bg-white/10 px-4 py-1.5 rounded-full text-[10px] font-black text-blue-300 border border-white/5">{chatMessages.length} הודעות</div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-8 space-y-5 bg-gray-50/30">
                        {chatMessages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-4">
                                <div className="p-6 bg-white rounded-full shadow-sm"><MessageSquare size={56} className="opacity-10" /></div>
                                <p className="font-bold text-lg">אין עדיין הודעות. היו הראשונים לשאול שאלה!</p>
                            </div>
                        ) : (
                            chatMessages.map(msg => (
                                <div key={msg.id} className={`flex gap-4 ${msg.userId === user.id ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className="shrink-0 pt-1">
                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black shadow-sm ${msg.userId === activeClass.teacherId ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white' : 'bg-gradient-to-br from-blue-400 to-blue-600 text-white'}`}>
                                            {msg.userName[0]}
                                        </div>
                                    </div>
                                    <div className={`max-w-[75%] ${msg.userId === user.id ? 'text-left' : 'text-right'}`}>
                                        <div className="flex items-center gap-3 mb-1.5 px-1 justify-end flex-row-reverse">
                                            <span className="text-[11px] font-black text-gray-900">{msg.userName} {msg.userId === activeClass.teacherId && <span className="text-orange-500 text-[10px] font-black mr-1">(מורה)</span>}</span>
                                            <span className="text-[9px] text-gray-400 font-medium">{new Date(msg.timestamp).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <div className={`p-4 rounded-3xl text-sm font-medium shadow-md border ${msg.userId === user.id ? 'bg-primary text-white rounded-tl-none border-blue-400' : 'bg-white text-gray-800 rounded-tr-none border-gray-100'}`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                        <div ref={chatEndRef} />
                    </div>
                    <div className="p-6 bg-white border-t border-gray-100 flex gap-4">
                        <input 
                            type="text" 
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="כתוב הודעה לכיתה..." 
                            className="flex-1 p-5 bg-gray-50 border border-gray-200 rounded-[1.75rem] outline-none focus:border-blue-600 focus:bg-white transition-all text-sm font-bold shadow-inner"
                        />
                        <button 
                            onClick={handleSendMessage}
                            disabled={!chatInput.trim()}
                            className="bg-gray-900 text-white p-5 rounded-2xl shadow-xl hover:bg-black hover:-translate-y-1 disabled:opacity-20 disabled:translate-y-0 transition-all"
                        >
                            <Send size={22} />
                        </button>
                    </div>
                </div>
            )}
        </div>
      ) : (
        <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16 text-right">
                <div className="max-w-2xl">
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">הכיתות שלי</h2>
                    <p className="text-xl text-gray-500 font-medium leading-relaxed">נהלו את הלמידה המשותפת, צפו בחומרים שהועלו על ידי המורים והשתתפו בדיונים כיתתיים.</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto shrink-0">
                    <button onClick={() => setIsCreating(true)} className="flex-1 md:flex-none bg-gray-900 text-white px-10 py-5 rounded-3xl font-black shadow-2xl shadow-gray-200 hover:-translate-y-1.5 hover:bg-black transition-all flex items-center justify-center gap-3 group">
                        <Plus size={22} className="group-hover:rotate-90 transition-transform" /> 
                        יצירת כיתה
                    </button>
                    <button onClick={() => setIsJoining(true)} className="flex-1 md:flex-none bg-white border-2 border-gray-100 text-gray-800 px-10 py-5 rounded-3xl font-black hover:bg-gray-50 hover:shadow-lg transition-all flex items-center justify-center gap-3">
                        <UserPlus size={22} /> 
                        הצטרפות
                    </button>
                </div>
            </div>
            {isCreating && (
                <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-gray-100 mb-16 animate-slide-up relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[4rem] -z-0" />
                   <button onClick={() => setIsCreating(false)} className="absolute top-8 left-8 p-3 hover:bg-gray-100 rounded-2xl text-gray-400 transition-colors z-10"><X size={24} /></button>
                   <div className="relative z-10">
                        <h3 className="text-3xl font-black mb-10 flex items-center gap-4"><div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200"><Plus size={28}/></div> הקמת כיתה חדשה</h3>
                        <div className="grid md:grid-cols-3 gap-6 mb-10">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pr-4">שם הכיתה</label>
                                <input type="text" value={newClassName} onChange={(e) => setNewClassName(e.target.value)} placeholder="לדוגמה: י'2 מדעים..." className="w-full p-5 bg-gray-50 border-2 border-gray-100 rounded-[1.75rem] font-black outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all"/>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pr-4">מקצוע</label>
                                <select value={newClassSubject} onChange={(e) => setNewClassSubject(e.target.value as Subject)} className="w-full p-5 bg-gray-50 border-2 border-gray-100 rounded-[1.75rem] font-black appearance-none focus:border-primary outline-none">{Object.values(Subject).map(s => <option key={s} value={s}>{s}</option>)}</select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pr-4">שכבת גיל</label>
                                <select value={newClassGrade} onChange={(e) => setNewClassGrade(e.target.value as Grade)} className="w-full p-5 bg-gray-50 border-2 border-gray-100 rounded-[1.75rem] font-black appearance-none focus:border-primary outline-none">{Object.values(Grade).map(g => <option key={g} value={g}>{g}</option>)}</select>
                            </div>
                        </div>
                        <button onClick={handleCreateClass} className="w-full bg-primary text-white py-6 rounded-3xl font-black text-xl shadow-xl shadow-blue-200 hover:bg-blue-600 hover:-translate-y-1 transition-all">צור כיתה וקבל קוד מורה</button>
                   </div>
                </div>
            )}
            {isJoining && (
                <div className="bg-white p-12 rounded-[4rem] shadow-2xl border border-gray-100 mb-16 text-center max-w-2xl mx-auto relative animate-slide-up">
                   <button onClick={() => setIsJoining(false)} className="absolute top-8 left-8 p-3 hover:bg-gray-100 rounded-2xl text-gray-400 transition-colors"><X size={24} /></button>
                   <h3 className="text-3xl font-black mb-10 flex flex-col items-center gap-4"><div className="p-4 bg-gray-900 text-white rounded-3xl shadow-xl"><UserPlus size={32}/></div> הצטרפות לשיעור</h3>
                   <div className="space-y-4 mb-10">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">הזן את הקוד שקיבלת מהמורה</label>
                        <input type="text" value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase())} placeholder="XXXXXX" className="w-full p-8 bg-gray-50 border-4 border-gray-100 rounded-[2.5rem] font-mono font-black text-6xl text-center text-primary outline-none focus:border-primary focus:bg-white transition-all" maxLength={8} />
                   </div>
                   <button onClick={handleJoinClass} className="w-full bg-gray-900 text-white py-6 rounded-3xl font-black text-2xl shadow-2xl hover:bg-black hover:-translate-y-1 transition-all">הצטרף לכיתה עכשיו</button>
                </div>
            )}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {classrooms.map(classroom => (
                    <button key={classroom.id} onClick={() => setActiveClassId(classroom.id)} className="group bg-white p-10 rounded-[3rem] shadow-sm border border-gray-50 hover:shadow-2xl hover:border-blue-100 hover:-translate-y-3 transition-all duration-500 text-right overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/30 rounded-bl-[5rem] -z-0 transition-transform group-hover:scale-110" />
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-10">
                                <div className="bg-white p-5 rounded-[1.75rem] text-blue-600 shadow-xl shadow-blue-100/50 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                                    <School size={32} />
                                </div>
                                <span className="bg-gray-100 text-gray-500 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border border-gray-200/50">{classroom.id}</span>
                            </div>
                            <h3 className="text-2xl font-black group-hover:text-blue-600 transition-colors mb-3 leading-tight min-h-[3rem]">{classroom.name}</h3>
                            <div className="flex items-center gap-3 text-sm font-bold text-gray-400 mb-10">
                                <span>{classroom.subject}</span>
                                <div className="w-1 h-1 bg-gray-300 rounded-full" />
                                <span>{classroom.grade}</span>
                            </div>
                            <div className="flex items-center justify-between pt-8 border-t border-gray-100">
                                <div className="flex items-center -space-x-2 rtl:space-x-reverse">
                                    {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-400">{i}</div>)}
                                    <span className="text-[11px] font-black text-gray-400 mr-4">+{classroom.studentsCount - 3} תלמידים</span>
                                </div>
                                <div className="flex items-center gap-1 text-sm font-black text-blue-600 group-hover:translate-x-[-8px] transition-transform">
                                    <span>כניסה</span>
                                    <ChevronLeft size={20} className="rotate-180" />
                                </div>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default ClassroomView;
