
import React from 'react';
import { Subject, Grade } from '../types.ts';
import { Calculator, Book, Globe, FlaskConical, ScrollText, Map, Library, Scale, School, ChevronLeft } from 'lucide-react';

interface SubjectSelectorProps {
  mode: 'GRADE_SELECTION' | 'SUBJECT_SELECTION';
  selectedSubject: Subject | null;
  selectedGrade: Grade | null;
  userName?: string | null;
  onSelectSubject: (s: Subject) => void;
  onSelectGrade: (g: Grade) => void;
  isPro?: boolean;
  onProClick?: () => void;
}

const subjectIcons: Record<Subject, React.ReactNode> = {
  [Subject.MATH]: <Calculator className="w-8 h-8 md:w-10 md:h-10" />,
  [Subject.HEBREW]: <Book className="w-8 h-8 md:w-10 md:h-10" />,
  [Subject.ENGLISH]: <Globe className="w-8 h-8 md:w-10 md:h-10" />,
  [Subject.SCIENCE]: <FlaskConical className="w-8 h-8 md:w-10 md:h-10" />,
  [Subject.HISTORY]: <ScrollText className="w-8 h-8 md:w-10 md:h-10" />,
  [Subject.GEOGRAPHY]: <Map className="w-8 h-8 md:w-10 md:h-10" />,
  [Subject.BIBLE]: <Library className="w-8 h-8 md:w-10 md:h-10" />,
  [Subject.CIVICS]: <Scale className="w-8 h-8 md:w-10 md:h-10" />,
};

const SubjectSelector: React.FC<SubjectSelectorProps> = ({
  mode,
  selectedSubject,
  selectedGrade,
  userName,
  onSelectSubject,
  onSelectGrade,
  isPro,
  onProClick
}) => {
  
  if (mode === 'GRADE_SELECTION') {
    return (
      <div className="max-w-5xl mx-auto p-4 md:p-8 animate-fade-in text-center">
        <div className="mb-10">
           <div className="bg-gradient-to-br from-blue-50 to-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <School className="text-primary w-10 h-10" />
           </div>
           <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">שלום {userName || 'תלמיד/ה'}!</h2>
           <p className="text-xl md:text-2xl text-gray-500 font-light">בחר כיתה כדי להתחיל</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 max-w-5xl mx-auto">
          {Object.values(Grade).map((grade) => (
            <button
              key={grade}
              onClick={() => onSelectGrade(grade)}
              className="group p-6 md:p-8 bg-white border-2 border-gray-100 rounded-[2rem] hover:border-primary hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center gap-3 focus:outline-none focus:ring-4 focus:ring-primary/10"
            >
              <span className="text-lg md:text-xl font-bold text-gray-800 group-hover:text-primary transition-colors">{grade}</span>
              <div className="w-8 h-1 bg-gray-100 rounded-full group-hover:bg-primary transition-all group-hover:w-12" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">
          {userName ? `היי ${userName} 👋` : `שלום כיתה ${selectedGrade}! 👋`}
        </h2>
        <p className="text-xl text-gray-500 font-light">איזה מקצוע נלמד עכשיו?</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10 lg:gap-12">
        {Object.values(Subject).map((subject) => (
          <button
            key={subject}
            onClick={() => onSelectSubject(subject)}
            className="group relative bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col items-center justify-center gap-6 text-center overflow-hidden aspect-square"
          >
            {/* Background Accent Decor */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-50/60 to-transparent rounded-bl-[4rem] group-hover:scale-125 transition-transform" />
            
            <div className={`relative z-10 p-5 md:p-7 rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm shrink-0`}>
              {subjectIcons[subject]}
            </div>
            
            <div className="relative z-10">
              <h3 className="text-xl md:text-2xl font-black text-gray-800 group-hover:text-primary transition-colors line-clamp-1">{subject}</h3>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SubjectSelector;
