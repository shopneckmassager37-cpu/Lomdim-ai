
import React, { useState, useEffect } from 'react';
import { Subject, Grade, Question, PracticeConfig } from '../types.ts';
import { generateQuestions } from '../services/geminiService.ts';
import LatexRenderer from './LatexRenderer.tsx';
import { Play, CheckCircle, XCircle, ChevronLeft, Lightbulb, MessageCircleQuestion, Clock, BrainCircuit, FileText, Settings2, BarChart3, RotateCcw, Timer, Trophy, ArrowRight, Star } from 'lucide-react';

interface PracticeAreaProps {
  subject: Subject;
  grade: Grade;
  onQuestionAnswered: (question: Question, isCorrect: boolean) => void;
  onAskAI: (questionText: string) => void;
  initialConfig?: PracticeConfig | null;
  recentMistakes: string[];
}

const LOADING_MESSAGES = [
  "מתייעץ עם פרופסורים מאוקספורד...",
  "מחדד את העפרונות הווירטואליים...",
  "סורק מיליוני דפי ספרים...",
  "מכין שאלות מאתגרות במיוחד...",
  "בודק שאין טעויות כתיב...",
  "מתקשר לאיינשטיין להתייעצות...",
  "מארגן את המחשבות...",
  "בונה את המבחן המושלם עבורך..."
];

const PracticeArea: React.FC<PracticeAreaProps> = ({ subject, grade, onQuestionAnswered, onAskAI, initialConfig, recentMistakes }) => {
  const [topic, setTopic] = useState('');
  const [questionCount, setQuestionCount] = useState(5);
  const [difficulty, setDifficulty] = useState<'MEDIUM' | 'HARD'>('MEDIUM');
  const [mode, setMode] = useState<'PRACTICE' | 'TEST'>('PRACTICE');

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({}); 
  const [isAnswerChecked, setIsAnswerChecked] = useState(false); 
  const [showSummary, setShowSummary] = useState(false);
  
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState<ReturnType<typeof setInterval> | null>(null);

  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);

  useEffect(() => {
    if (initialConfig) {
      setTopic(initialConfig.topic || '');
      setQuestionCount(initialConfig.count);
      setMode(initialConfig.mode);
      setDifficulty(initialConfig.difficulty);
      handleGenerate(initialConfig.topic || undefined, initialConfig.count, initialConfig.difficulty);
    }
  }, [initialConfig]);

  useEffect(() => {
    let interval: any;
    if (loading) {
      setLoadingMsgIndex(0);
      interval = setInterval(() => {
         setLoadingMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    if (questions.length > 0 && !showSummary && !loading) {
        const interval = setInterval(() => {
            setElapsedTime(prev => prev + 1);
        }, 1000);
        setTimerInterval(interval);
        return () => clearInterval(interval);
    } else {
        if (timerInterval) clearInterval(timerInterval);
    }
  }, [questions.length, showSummary, loading]);

  const handleGenerate = async (
    overrideTopic?: string, 
    overrideCount?: number, 
    overrideDifficulty?: 'MEDIUM' | 'HARD'
  ) => {
    setLoading(true);
    setQuestions([]);
    setCurrentIndex(0);
    setUserAnswers({});
    setIsAnswerChecked(false);
    setShowSummary(false);
    setElapsedTime(0);
    
    const targetTopic = overrideTopic !== undefined ? overrideTopic : topic;
    const targetCount = overrideCount || questionCount;
    const targetDiff = overrideDifficulty || difficulty;

    const shouldUsePersonalized = recentMistakes.length > 0 && !targetTopic;

    try {
      const newQuestions = await generateQuestions(
          subject, 
          grade, 
          targetTopic, 
          shouldUsePersonalized ? recentMistakes : undefined,
          targetCount,
          targetDiff
      );
      
      if (newQuestions && newQuestions.length > 0) {
        setQuestions(newQuestions);
      } else {
        alert("לא הצלחנו לייצר שאלות. אנא נסה נושא אחר או נסה שוב מאוחר יותר.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnswer = (idx: number) => {
    if (showSummary) return;
    if (mode === 'PRACTICE' && isAnswerChecked) return;

    setUserAnswers(prev => ({
        ...prev,
        [currentIndex]: idx
    }));
  };

  const handleCheckPracticeAnswer = () => {
    if (userAnswers[currentIndex] === undefined) return;
    
    setIsAnswerChecked(true);
    const currentQ = questions[currentIndex];
    const isCorrect = userAnswers[currentIndex] === currentQ.correctIndex;
    onQuestionAnswered(currentQ, isCorrect);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      if (mode === 'PRACTICE') {
          setIsAnswerChecked(false);
      }
    } else {
        finishTest();
    }
  };

  const finishTest = () => {
    setShowSummary(true);
    if (mode === 'TEST') {
        questions.forEach((q, idx) => {
            const answer = userAnswers[idx];
            if (answer !== undefined) {
                onQuestionAnswered(q, answer === q.correctIndex);
            }
        });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const resetAll = () => {
      setQuestions([]);
      setTopic('');
      setElapsedTime(0);
      setUserAnswers({});
      setCurrentIndex(0);
      setShowSummary(false);
      setIsAnswerChecked(false);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-[2.5rem] shadow-lg p-12 text-center max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[400px]">
         <div className="relative mb-8">
            <div className={`absolute inset-0 rounded-full animate-ping opacity-25 bg-blue-100`}></div>
            <div className={`relative p-6 rounded-full bg-blue-50`}>
                {mode === 'TEST' ? <FileText className="animate-pulse text-indigo-600" size={64} /> : <BrainCircuit className="animate-pulse text-primary" size={64} />}
            </div>
         </div>
         <h3 className="text-2xl font-bold text-gray-800 mb-2">{mode === 'TEST' ? 'בונה את המבחן...' : `מייצר תרגול בנושא: ${topic || 'כללי'}`}</h3>
         <div className="h-8 mb-6 flex items-center justify-center">
            <p className="text-gray-500 font-medium animate-fade-in transition-all duration-500 text-lg text-center px-4">{LOADING_MESSAGES[loadingMsgIndex]}</p>
         </div>
      </div>
    );
  }

  // Summary Screen
  if (showSummary) {
    const correctCount = questions.reduce((acc, q, idx) => {
        return acc + (userAnswers[idx] === q.correctIndex ? 1 : 0);
    }, 0);
    const score = Math.round((correctCount / questions.length) * 100);

    return (
      <div className="max-w-3xl mx-auto animate-fade-in">
        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100">
            <div className="bg-gray-900 p-10 md:p-16 text-center text-white relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="relative z-10">
                    <div className="bg-white/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-md border border-white/20">
                        <Trophy size={48} className="text-yellow-400" />
                    </div>
                    <h2 className="text-4xl font-black mb-2">כל הכבוד!</h2>
                    <p className="text-gray-400 font-bold">סיימת את {mode === 'TEST' ? 'המבחן' : 'התרגול'}</p>
                </div>
            </div>

            <div className="p-8 md:p-12 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-50 p-6 rounded-3xl text-center border border-gray-100">
                        <div className="text-3xl font-black text-gray-900 mb-1">{score}%</div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">ציון סופי</div>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-3xl text-center border border-gray-100">
                        <div className="text-3xl font-black text-green-600 mb-1">{correctCount}/{questions.length}</div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">תשובות נכונות</div>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-3xl text-center border border-gray-100">
                        <div className="text-3xl font-black text-blue-600 mb-1">{formatTime(elapsedTime)}</div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">זמן עבודה</div>
                    </div>
                </div>

                <div className="space-y-4 pt-4">
                    <button 
                        onClick={() => handleGenerate()} 
                        className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black text-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                    >
                        <RotateCcw size={24} />
                        <span>נסה שוב באותו נושא</span>
                    </button>
                    <button 
                        onClick={resetAll} 
                        className="w-full bg-white text-gray-700 border-2 border-gray-200 py-5 rounded-2xl font-black text-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-3"
                    >
                        <ArrowRight size={24} />
                        <span>חזרה לבחירת נושאים</span>
                    </button>
                </div>
            </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-3xl shadow-lg p-8 max-w-2xl mx-auto border border-gray-100">
          <div className="text-center mb-8">
             <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600"><Settings2 size={32} /></div>
             <h3 className="text-3xl font-bold text-gray-800 mb-2">הגדרת תרגול</h3>
             <p className="text-gray-500">התאם את חווית הלמידה שלך</p>
          </div>
          <div className="space-y-6">
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">נושא התרגול (אופציונלי)</label>
                <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="לדוגמה: שברים, המהפכה הצרפתית..." className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-primary focus:bg-white outline-none transition-all" />
             </div>
             <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setMode('PRACTICE')} className={`p-4 rounded-xl border-2 text-center transition-all ${mode === 'PRACTICE' ? 'border-primary bg-blue-50 text-primary' : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'}`}>
                    <BrainCircuit className="mx-auto mb-2" />
                    <div className="font-bold">תרגול רגיל</div>
                </button>
                <button onClick={() => setMode('TEST')} className={`p-4 rounded-xl border-2 text-center transition-all ${mode === 'TEST' ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'}`}>
                    <FileText className="mx-auto mb-2" />
                    <div className="font-bold">מצב מבחן</div>
                </button>
             </div>
             <div>
                <div className="flex justify-between mb-2">
                    <label className="text-sm font-bold text-gray-700">מספר שאלות</label>
                    <span className="text-sm font-bold text-primary bg-blue-50 px-2 rounded">{questionCount}</span>
                </div>
                <input type="range" min="5" max="20" step="5" value={questionCount} onChange={(e) => setQuestionCount(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary" />
             </div>
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">רמת קושי</label>
                <div className="flex gap-3">
                    <button onClick={() => setDifficulty('MEDIUM')} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${difficulty === 'MEDIUM' ? 'bg-green-100 text-green-700 ring-2 ring-green-500 ring-offset-2' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>רגיל</button>
                    <button onClick={() => setDifficulty('HARD')} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${difficulty === 'HARD' ? 'bg-red-100 text-red-700 ring-2 ring-red-500 ring-offset-2' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>מתקדם</button>
                </div>
             </div>
             <button onClick={() => handleGenerate()} className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2 mt-4">
                <Play size={20} /> התחל {mode === 'TEST' ? 'מבחן' : 'תרגול'}
             </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-gray-50 p-4 flex justify-between items-center border-b border-gray-200">
            <div className="flex items-center gap-4">
                <span className="font-bold text-gray-700">{mode === 'TEST' ? 'מבחן' : 'תרגול'}</span>
                {mode === 'TEST' && <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-sm text-indigo-600 font-mono font-bold"><Timer size={16} />{formatTime(elapsedTime)}</div>}
            </div>
            <div className="text-sm font-bold text-gray-500">שאלה {currentIndex + 1} / {questions.length}</div>
        </div>
        <div className="h-1.5 bg-gray-100 w-full"><div className={`h-full transition-all duration-500 ${mode === 'TEST' ? 'bg-indigo-500' : 'bg-primary'}`} style={{ width: `${progress}%` }} /></div>
        <div className="p-6 md:p-10">
          <div className="text-xl md:text-2xl font-bold text-gray-800 mb-8 leading-relaxed text-center"><LatexRenderer text={currentQ.text} /></div>
          <div className="space-y-3 mb-8">
            {currentQ.options.map((option, idx) => {
              let btnClass = "border-2 border-gray-200 hover:bg-gray-50";
              const isSelected = userAnswers[currentIndex] === idx;
              if (mode === 'PRACTICE' && isAnswerChecked) {
                 if (idx === currentQ.correctIndex) btnClass = "border-green-500 bg-green-50 text-green-700";
                 else if (isSelected) btnClass = "border-red-500 bg-red-50 text-red-700";
                 else btnClass = "border-gray-100 text-gray-400 opacity-60";
              } else if (isSelected) btnClass = "border-primary bg-blue-50 text-primary ring-1 ring-primary";
              return (
                <button key={idx} onClick={() => handleSelectAnswer(idx)} className={`w-full p-4 rounded-xl text-right transition-all duration-200 font-medium ${btnClass}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm font-bold shrink-0 ${(mode === 'PRACTICE' && isAnswerChecked && idx === currentQ.correctIndex) || (isSelected && (mode === 'TEST' || !isAnswerChecked)) ? 'border-transparent bg-primary text-white' : (mode === 'PRACTICE' && isAnswerChecked && isSelected && idx !== currentQ.correctIndex) ? 'border-red-500 bg-red-500 text-white' : 'border-current'}`}>{idx + 1}</div>
                    <LatexRenderer text={option} />
                  </div>
                </button>
              );
            })}
          </div>
          {mode === 'PRACTICE' && isAnswerChecked && (
            <div className={`mb-6 p-4 rounded-xl border animate-fade-in ${userAnswers[currentIndex] === currentQ.correctIndex ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-start gap-3">
                <Lightbulb className={`flex-shrink-0 mt-1 ${userAnswers[currentIndex] === currentQ.correctIndex ? 'text-green-600' : 'text-red-600'}`} size={20} />
                <div><p className={`font-bold mb-1 ${userAnswers[currentIndex] === currentQ.correctIndex ? 'text-green-800' : 'text-red-800'}`}>{userAnswers[currentIndex] === currentQ.correctIndex ? 'נכון מאוד!' : 'לא נכון...'}</p><div className="text-gray-700 text-sm leading-relaxed"><LatexRenderer text={currentQ.explanation} /></div></div>
              </div>
            </div>
          )}
          <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-100">
             <button onClick={resetAll} className="text-gray-400 hover:text-gray-600 text-sm font-medium hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors">צא מהתרגול</button>
             <div className="flex gap-3">
                <button onClick={() => onAskAI(`השאלה: ${currentQ.text}\nאפשרויות: ${currentQ.options.join(', ')}\nאני צריך עזרה להבין את זה.`)} className="p-3 text-accent hover:bg-purple-50 rounded-xl transition-colors" title="התייעץ עם המורה"><MessageCircleQuestion size={24} /></button>
                {mode === 'PRACTICE' && !isAnswerChecked ? (
                  <button onClick={handleCheckPracticeAnswer} disabled={userAnswers[currentIndex] === undefined} className="bg-primary hover:bg-blue-600 disabled:bg-gray-300 text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-md">בדוק תשובה</button>
                ) : (
                  <button onClick={handleNext} disabled={userAnswers[currentIndex] === undefined && mode === 'TEST'} className="bg-gray-900 hover:bg-black text-white px-8 py-3 rounded-xl font-bold transition-colors flex items-center gap-2 shadow-md">
                    {currentIndex === questions.length - 1 ? 'סיים והגש' : 'הבא'}
                    <ChevronLeft size={18} />
                  </button>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeArea;
