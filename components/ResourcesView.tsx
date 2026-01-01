
import React, { useEffect, useState } from 'react';
import { Subject, Grade, StudyTopic, PracticeConfig } from '../types.ts';
import { getStudyTopics, generateSummary } from '../services/geminiService.ts';
import LatexRenderer from './LatexRenderer.tsx';
import { FileText, CheckSquare, Loader2, ChevronRight, X, Copy, Check, ArrowLeft, Search, Sparkles, MessageCircleQuestion, FileDown } from 'lucide-react';

interface ResourcesViewProps {
  subject: Subject;
  grade: Grade;
  onStartTest: (config: PracticeConfig) => void;
  onSummaryGenerated: (title: string, content: string) => void;
  onAskAI: (question: string) => void;
  initialSummaryToOpen?: {title: string, content: string} | null;
}

const LOADING_MESSAGES = [
    "קורא את כל החומר הלימודי...",
    "מסכם עבורך את הנקודות החשובות...",
    "מנסח הסברים ברורים...",
    "בודק עובדות היסטוריות...",
    "מארגן את המידע בצורה נוחה...",
    "מכין לך סיכום מעולה..."
];

const ResourcesView: React.FC<ResourcesViewProps> = ({ 
  subject, 
  grade, 
  onStartTest, 
  onSummaryGenerated,
  onAskAI,
  initialSummaryToOpen
}) => {
  const [topics, setTopics] = useState<{summaries: StudyTopic[], tests: StudyTopic[]}>({ summaries: [], tests: [] });
  const [selectedContent, setSelectedContent] = useState<{title: string, content: string, type: 'SUMMARY'} | null>(null);
  const [loadingContent, setLoadingContent] = useState(false);
  const [customTopic, setCustomTopic] = useState('');
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);

  useEffect(() => {
    let interval: any;
    if (loadingContent) {
      setLoadingMsgIndex(0);
      interval = setInterval(() => {
         setLoadingMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [loadingContent]);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const data = await getStudyTopics(subject, grade);
        setTopics(data);
      } catch (err) {
        console.error("Failed to fetch topics:", err);
      }
    };
    fetchTopics();
  }, [subject, grade]);

  useEffect(() => {
    if (initialSummaryToOpen) {
      setSelectedContent({
        title: initialSummaryToOpen.title,
        content: initialSummaryToOpen.content,
        type: 'SUMMARY'
      });
    }
  }, [initialSummaryToOpen]);

  const handleSummaryClick = async (topicTitle: string) => {
    if (!topicTitle.trim()) return;
    
    const cacheKey = `cached_summary_${subject}_${grade}_${topicTitle.trim().toLowerCase()}`;
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      setSelectedContent({ title: topicTitle, content: cached, type: 'SUMMARY' });
      onSummaryGenerated(topicTitle, cached);
      return;
    }

    setLoadingContent(true);
    setSelectedContent({ title: topicTitle, content: '', type: 'SUMMARY' });
    
    try {
      const content = await generateSummary(subject, grade, topicTitle);
      localStorage.setItem(cacheKey, content);
      onSummaryGenerated(topicTitle, content);
      setSelectedContent({ title: topicTitle, content, type: 'SUMMARY' });
    } catch (err) {
      console.error(err);
      setSelectedContent(null);
      alert("מצטערים, אירעה שגיאה בייצור הסיכום.");
    } finally {
      setLoadingContent(false);
      setCustomTopic('');
    }
  };

  const handleCustomTestClick = () => {
    if (customTopic.trim()) {
      onStartTest({
          count: 10,
          mode: 'TEST',
          difficulty: 'MEDIUM',
          topic: customTopic
      });
      setCustomTopic('');
    }
  };

  const handleCloseContent = () => {
    setSelectedContent(null);
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const handleAskAIWithSelection = () => {
    if (!selectedContent) return;
    
    const selection = window.getSelection()?.toString().trim();
    if (selection) {
      onAskAI(`הנה קטע שסימנתי מהסיכום על "${selectedContent.title}":\n\n> ${selection}\n\nאשמח להסבר נוסף על החלק הזה.`);
    } else {
      alert("אנא סמן עם העכבר את קטע הטקסט בסיכום שלא הבנת, ולאחר מכן לחץ שוב על כפתור העזרה.");
    }
  };

  if (selectedContent) {
    return (
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 h-[calc(100vh-140px)] flex flex-col animate-fade-in no-print summary-print-container">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center rounded-t-3xl sticky top-0 z-10 bg-gray-50 text-gray-800 no-print">
           <div className="flex items-center gap-3">
             <button onClick={handleCloseContent} className="lg:hidden p-2 -mr-2 text-gray-500"><ArrowLeft size={24} /></button>
             <h3 className="font-bold text-xl md:text-2xl">{selectedContent.title}</h3>
           </div>
           <div className="flex gap-3">
             <button 
                onClick={handleAskAIWithSelection} 
                className="p-3 rounded-full shadow-sm transition-all bg-white text-accent border border-gray-200 hover:bg-purple-50 flex items-center gap-2" 
                title="שאל את ה-AI על הסיכום (סמן טקסט כדי לשאול עליו ספציפית)"
             >
                <MessageCircleQuestion size={20} />
             </button>
             <button onClick={handleDownloadPDF} className="p-3 rounded-full shadow-sm transition-all bg-white text-primary border border-gray-200 hover:bg-blue-50 flex items-center gap-2" title="הורד כ-PDF / הדפס">
                <FileDown size={20} />
             </button>
             <button onClick={handleCloseContent} className="hidden lg:block p-3 rounded-full shadow-sm transition-all bg-white text-gray-500 border border-gray-200 hover:bg-red-50 hover:text-red-500"><X size={20} /></button>
           </div>
        </div>
        <div id="summary-to-print" className="p-8 md:p-12 overflow-y-auto flex-1 leading-loose text-lg text-gray-700 relative summary-print-container">
           {loadingContent ? (
             <div className="flex flex-col items-center justify-center h-full gap-8 min-h-[300px] no-print">
                <div className="relative p-6 rounded-full bg-blue-50"><FileText className="animate-pulse text-primary" size={64} /></div>
                <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">כותב את הסיכום...</h3>
                    <p className="text-gray-500 font-medium animate-fade-in text-lg">{LOADING_MESSAGES[loadingMsgIndex % LOADING_MESSAGES.length]}</p>
                </div>
             </div>
           ) : (
             <div className="font-sans max-w-3xl mx-auto">
               <div className="hidden print:block mb-8 pb-4 border-b">
                 <h1 className="text-3xl font-black">{selectedContent.title}</h1>
                 <p className="text-gray-500">נוצר ע"י Lomdim AI עבור {grade}</p>
               </div>
               <LatexRenderer text={selectedContent.content} />
             </div>
           )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto pb-20 no-print">
      <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
          <input 
            type="text" 
            value={customTopic} 
            onChange={(e) => setCustomTopic(e.target.value)} 
            placeholder="הקלד כל נושא לסיכום או מבחן אישי..." 
            className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
            onKeyDown={(e) => { if (e.key === 'Enter' && customTopic.trim()) handleSummaryClick(customTopic); }}
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button onClick={() => handleSummaryClick(customTopic)} disabled={!customTopic.trim()} className="flex-1 md:flex-none px-6 py-3 bg-blue-50 text-primary hover:bg-primary hover:text-white font-bold rounded-xl transition-all disabled:opacity-50 text-xs flex items-center justify-center gap-2">סיכום</button>
          <button onClick={handleCustomTestClick} disabled={!customTopic.trim()} className="flex-1 md:flex-none px-6 py-3 bg-gray-900 text-white hover:bg-black font-bold rounded-xl transition-all disabled:opacity-50 text-xs flex items-center justify-center gap-2">מבחן</button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2 px-2">
              <div className="bg-blue-100 p-1.5 rounded-lg text-primary"><FileText size={20} /></div>
              <h3 className="text-xl font-bold text-gray-800">סיכומים ל{grade}</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {topics.summaries.length > 0 ? topics.summaries.map((topic, idx) => (
                  <button key={idx} onClick={() => handleSummaryClick(topic.title)} className="group bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary transition-all text-right flex flex-col justify-between h-32 relative overflow-hidden">
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-6 h-6 rounded-full bg-blue-50 text-primary flex items-center justify-center font-bold text-xs">{idx + 1}</span>
                        <h4 className="font-bold text-gray-900 group-hover:text-primary transition-colors text-sm md:text-base line-clamp-1">{topic.title}</h4>
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-2">{topic.description}</p>
                    </div>
                    <div className="relative z-10 mt-2 flex items-center justify-between">
                       <span className="text-[10px] font-bold text-gray-300">קרא סיכום</span>
                       <div className="bg-primary/10 p-1.5 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-all">
                          <ChevronRight size={14} className="rotate-180" />
                       </div>
                    </div>
                  </button>
              )) : (
                <div className="col-span-full p-8 text-center bg-gray-50 rounded-2xl text-gray-400 border border-dashed border-gray-200">אין נושאים זמינים כרגע. נסה להשתמש בחיפוש המותאם אישית.</div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2 px-2">
              <div className="bg-green-100 p-1.5 rounded-lg text-green-600"><CheckSquare size={20} /></div>
              <h3 className="text-xl font-bold text-gray-800">מבחנים ל{grade}</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {topics.tests.length > 0 ? topics.tests.map((topic, idx) => (
                <button key={idx} onClick={() => onStartTest({ count: 10, mode: 'TEST', difficulty: 'MEDIUM', topic: topic.title })} className="group bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-green-500 transition-all text-right flex flex-col justify-between h-32 relative overflow-hidden">
                   <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-6 h-6 rounded-full bg-green-50 text-green-600 flex items-center justify-center font-bold text-xs">{idx + 1}</span>
                        <h4 className="font-bold text-gray-900 group-hover:text-green-600 transition-colors text-sm md:text-base line-clamp-1">{topic.title}</h4>
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-2">{topic.description}</p>
                    </div>
                    <div className="relative z-10 mt-2 flex items-center justify-between">
                       <span className="text-[10px] font-bold text-gray-300">10 שאלות</span>
                       <div className="bg-green-600 text-white px-3 py-1.5 rounded-lg font-bold text-[10px] shadow-sm group-hover:bg-green-700 transition-all">תרגל</div>
                    </div>
                </button>
              )) : (
                <div className="col-span-full p-8 text-center bg-gray-50 rounded-2xl text-gray-400 border border-dashed border-gray-200">אין מבחנים זמינים כרגע.</div>
              )}
            </div>
          </div>
      </div>
    </div>
  );
};

export default ResourcesView;
