
export enum Subject {
  MATH = 'מתמטיקה',
  HEBREW = 'עברית (לשון)',
  ENGLISH = 'אנגלית',
  SCIENCE = 'מדעים',
  HISTORY = 'היסטוריה',
  GEOGRAPHY = 'גיאוגרפיה',
  BIBLE = 'תנ״ך',
  CIVICS = 'אזרחות'
}

export enum Grade {
  GRADE_1 = 'כיתה א׳',
  GRADE_2 = 'כיתה ב׳',
  GRADE_3 = 'כיתה ג׳',
  GRADE_4 = 'כיתה ד׳',
  GRADE_5 = 'כיתה ה׳',
  GRADE_6 = 'כיתה ו׳',
  GRADE_7 = 'כיתה ז׳',
  GRADE_8 = 'כיתה ח׳',
  GRADE_9 = 'כיתה ט׳',
  GRADE_10 = 'כיתה י׳',
  GRADE_11 = 'כיתה י״א',
  GRADE_12 = 'כיתה י״ב'
}

export interface User {
  id: string;
  email?: string;
  name?: string;
  photoUrl?: string;
  provider: 'google' | 'email' | 'guest';
}

export interface Question {
  id: string;
  text: string;
  type?: 'MCQ' | 'OPEN';
  options: string[];
  correctIndex: number;
  modelAnswer?: string; // For open questions
  explanation: string;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  attachment?: {
    mimeType: string;
    data: string; // base64
  };
}

export interface UserStats {
  subject: Subject;
  correct: number;
  total: number;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  subject: Subject;
  grade: Grade;
  type: 'PRACTICE' | 'SUMMARY';
  title: string;
  isCorrect?: boolean; // Only for PRACTICE
  content?: string;    // Only for SUMMARY
}

export interface StudyTopic {
  title: string;
  description: string;
  type: 'SUMMARY' | 'TEST' | 'TEST_PREP';
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface ConceptLink {
  from: string;
  to: string;
  relation: string;
}

export interface TestPrepDay {
  dayNumber: number;
  title: string;
  summary: string;
  videoSearchTerm: string;
  quiz: Question[];
  flashcards: Flashcard[];
  conceptMap: ConceptLink[];
}

export interface TestPrepPlan {
  id: string;
  subject: Subject;
  targetTopic: string;
  totalDays: number;
  days: TestPrepDay[];
  createdAt: number;
  completedDays: number[];
}

export interface HistoryAnalysis {
  insight: string;
  recommendations: string[];
  strength: string;
  weakness: string;
}

export interface PracticeConfig {
  count: number;
  mode: 'PRACTICE' | 'TEST';
  difficulty: 'MEDIUM' | 'HARD';
  topic?: string | null;
}

export type MaterialType = 'SUMMARY' | 'TEST' | 'ASSIGNMENT' | 'UPCOMING_TEST';

export interface ClassroomSubmission {
  studentId: string;
  studentName: string;
  timestamp: number;
  attachment: {
    name: string;
    mimeType: string;
    data: string;
  };
  quizResults?: Record<string, any>;
}

export interface ClassroomMaterial {
  id: string;
  title: string;
  type: MaterialType;
  content: string; 
  questions?: Question[];
  flashcards?: Flashcard[];
  conceptMap?: ConceptLink[];
  testDate?: string; // ISO String for test date
  dueDate?: string;  // ISO String for final submission date
  timestamp: number;
  isPublished: boolean;
  teacherAttachments?: Array<{
    name: string;
    mimeType: string;
    data: string;
  }>;
  submissions?: ClassroomSubmission[];
}

export interface Classroom {
  id: string;
  name: string;
  subject: Subject;
  grade: Grade;
  teacherName: string;
  teacherId: string;
  materials: ClassroomMaterial[];
  studentsCount: number;
}

export type ViewMode = 'DASHBOARD' | 'PRACTICE' | 'CHAT' | 'HISTORY' | 'PRIVACY' | 'CLASSROOM';

export interface EnrolledCourse {
  id: string;
  title: string;
  description: string;
  subject: Subject;
  totalDays: number;
  completedDays: number[];
  currentDay: number;
  lastAccessed: number;
}

export interface DailyLesson {
  title: string;
  content: string;
  videoSearchTerm: string;
  funFact: string;
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
  };
}
