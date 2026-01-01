
import { Subject, Grade } from "../types";

export interface StaticResource {
  title: string;
  description: string;
  grades: Grade[];
}

export const STATIC_RESOURCES: Record<Subject, StaticResource[]> = {
  [Subject.MATH]: [
    // Grade 1
    { title: "חיבור וחיסור עד 20", description: "תרגול פעולות חשבון בסיסיות בתחום ה-20.", grades: [Grade.GRADE_1] },
    { title: "צורות גאומטריות בסיסיות", description: "הכרת המשולש, הריבוע, העיגול והמלבן.", grades: [Grade.GRADE_1] },
    { title: "שאלות מילוליות פשוטות", description: "הבנת סיטואציות חשבוניות מחיי היומיום.", grades: [Grade.GRADE_1] },
    { title: "השוואת מספרים", description: "הבנת המושגים גדול, קטן ושווה בתחום ה-20.", grades: [Grade.GRADE_1] },
    // Grade 2
    { title: "חיבור וחיסור עד 100", description: "חישובים במבנה עשרוני ללא ועם המרה.", grades: [Grade.GRADE_2] },
    { title: "לוח הכפל (2, 5 ו-10)", description: "הכרת הכפולות הראשונות ויסודות הכפל.", grades: [Grade.GRADE_2] },
    { title: "מדידת אורך וזמן", description: "קריאת שעון ושימוש בסרגל למדידה.", grades: [Grade.GRADE_2] },
    { title: "הכרת המאות הראשונות", description: "מבנה המספר בתחום ה-1000.", grades: [Grade.GRADE_2] },
    // Grade 3
    { title: "שליטה בלוח הכפל והחילוק", description: "שליטה אוטומטית בכל כפולות לוח הכפל.", grades: [Grade.GRADE_3] },
    { title: "פתרון תרגילים במאונך", description: "חיבור וחיסור מספרים רב-ספרתיים במאונך.", grades: [Grade.GRADE_3] },
    { title: "הכרת השברים הפשוטים", description: "חצי, רבע ושליש - מושגי יסוד בשברים.", grades: [Grade.GRADE_3] },
    { title: "היקף ושטח מלבן וריבוע", description: "חישובים גאומטריים בסיסיים של שטחים.", grades: [Grade.GRADE_3] },
    // Grade 4
    { title: "מספרים עד מיליון", description: "הבנת ערך המקום במספרים גדולים מאוד.", grades: [Grade.GRADE_4] },
    { title: "כפל וחילוק דו-ספרתי", description: "אלגוריתם הכפל והחילוק הארוך.", grades: [Grade.GRADE_4] },
    { title: "הרחבה וצמצום שברים", description: "מציאת שברים שווי ערך וצמצומם.", grades: [Grade.GRADE_4] },
    { title: "זוויות וסוגי משולשים", description: "מיון משולשים לפי זוויות וצלעות.", grades: [Grade.GRADE_4] },
    // Grade 5
    { title: "פעולות בשברים פשוטים", description: "חיבור וחיסור שברים עם מכנים שונים.", grades: [Grade.GRADE_5] },
    { title: "הכרת המספרים העשרוניים", description: "מעבר בין שברים למספרים עשרוניים.", grades: [Grade.GRADE_5] },
    { title: "חישוב נפח תיבה", description: "הבנת הממד השלישי וחישובי נפח.", grades: [Grade.GRADE_5] },
    { title: "בעיות תנועה ומחיר", description: "פתרון בעיות מילוליות מורכבות.", grades: [Grade.GRADE_5] },
    // Grade 6
    { title: "כפל וחילוק עשרוני", description: "ביצוע פעולות חשבון במספרים עם נקודה.", grades: [Grade.GRADE_6] },
    { title: "אחוזים והקשר לשברים", description: "חישובי אחוזים מחיי היומיום.", grades: [Grade.GRADE_6] },
    { title: "חקירת נתונים וממוצע", description: "איסוף נתונים וחישוב ממוצע חשבוני.", grades: [Grade.GRADE_6] },
    { title: "המעגל והעיגול", description: "הכרת הרדיוס, הקוטר והיקף המעגל.", grades: [Grade.GRADE_6] },
    // Grade 7
    { title: "מספרים מכוונים", description: "פעולות חשבון עם מספרים חיוביים ושליליים.", grades: [Grade.GRADE_7] },
    { title: "ביטויים אלגבריים", description: "יסודות האלגברה וכינוס איברים דומים.", grades: [Grade.GRADE_7] },
    { title: "משוואות בנעלם אחד", description: "פתרון משוואות ליניאריות בסיסיות.", grades: [Grade.GRADE_7] },
    { title: "זוויות בין מקבילים", description: "זוויות מתאימות, מתחלפות וקודקודיות.", grades: [Grade.GRADE_7] },
    // Grade 8
    { title: "הפונקציה הקווית", description: "ייצוג אלגברי, גרפי ושיפוע הישר.", grades: [Grade.GRADE_8] },
    { title: "חוקי חזקות", description: "כפל וחילוק של חזקות עם בסיסים זהים.", grades: [Grade.GRADE_8] },
    { title: "שתי משוואות בשני נעלמים", description: "פתרון מערכת משוואות בשיטות שונות.", grades: [Grade.GRADE_8] },
    { title: "משפט פיתגורס", description: "קשרים בין צלעות במשולש ישר זווית.", grades: [Grade.GRADE_8] },
    // Grade 9
    { title: "משוואה ריבועית ופרבולה", description: "פתרון משוואות ממעלה שנייה וחקירת פרבולה.", grades: [Grade.GRADE_9] },
    { title: "דמיון וחפיפת משולשים", description: "משפטי חפיפה ודמיון מתקדמים.", grades: [Grade.GRADE_9] },
    { title: "פירוק לגורמים", description: "הוצאת גורם משותף ושימוש בנוסחאות הכפל המקוצר.", grades: [Grade.GRADE_9] },
    { title: "הסתברות קלאסית", description: "חישוב סיכויים למאורעות פשוטים ומשולבים.", grades: [Grade.GRADE_9] },
    // Grade 10
    { title: "טריגונומטריה בסיסית", description: "סינוס, קוסינוס וטנגנס במשולש ישר זווית.", grades: [Grade.GRADE_10] },
    { title: "גאומטריה אנליטית", description: "מרחק בין נקודות, אמצע קטע ומשוואת ישר.", grades: [Grade.GRADE_10] },
    { title: "סדרות חשבוניות", description: "נוסחת האיבר הכללי וסכום סדרה חשבונית.", grades: [Grade.GRADE_10] },
    { title: "נגזרת של פולינום", description: "תחילת חשבון דיפרנציאלי ושיפוע משיק.", grades: [Grade.GRADE_10] },
    // Grade 11
    { title: "חקירת פונקציות רציונליות", description: "מציאת אסימפטוטות, נקודות קיצון ותחומי עלייה.", grades: [Grade.GRADE_11] },
    { title: "פונקציות טריגונומטריות", description: "חקירת פונקציות סינוס וקוסינוס.", grades: [Grade.GRADE_11] },
    { title: "בעיות קיצון", description: "פתרון בעיות אופטימיזציה באמצעות נגזרת.", grades: [Grade.GRADE_11] },
    { title: "גאומטריה של המישור", description: "תכונות המעגל ומרובעים חסומים.", grades: [Grade.GRADE_11] },
    // Grade 12
    { title: "חשבון אינטגרלי", description: "חישובי שטחים ונפחי סיבוב של פונקציות.", grades: [Grade.GRADE_12] },
    { title: "מספרים מרוכבים", description: "הצגה אלגברית וטריגונומטרית של מספרים.", grades: [Grade.GRADE_12] },
    { title: "פונקציות מעריכיות ולוגריתמיות", description: "חקירה מלאה של פונקציות e ו-ln.", grades: [Grade.GRADE_12] },
    { title: "וקטורים", description: "וקטור גאומטרי ואלגברי במרחב.", grades: [Grade.GRADE_12] },
  ],
  [Subject.HEBREW]: [
    // Grade 1
    { title: "הקניית קריאה וכתיבה", description: "יסודות הפענוח והכתיבה התקינה.", grades: [Grade.GRADE_1] },
    { title: "סימני פיסוק בסיסיים", description: "שימוש בנקודה וסימן שאלה.", grades: [Grade.GRADE_1] },
    { title: "העשרת אוצר מילים", description: "מילים חדשות ומשמעותן.", grades: [Grade.GRADE_1] },
    { title: "כתיבת משפטים פשוטים", description: "בניית משפט תקין וקצר.", grades: [Grade.GRADE_1] },
    // Grade 2
    { title: "חוקי כתיב (א' ו-ע')", description: "הבחנה בין אותיות הומופוניות.", grades: [Grade.GRADE_2] },
    { title: "זכר ונקבה", description: "התאמה במין בשמות עצם ופעלים.", grades: [Grade.GRADE_2] },
    { title: "יחיד ורבים", description: "הטיית מילים לפי מספר.", grades: [Grade.GRADE_2] },
    { title: "הבנת הנקרא בטקסטים קצרים", description: "מענה על שאלות מתוך טקסט.", grades: [Grade.GRADE_2] },
    // Grade 3
    { title: "חלקי הדיבור: שם עצם ופועל", description: "זיהוי ומיון מילים לפי תפקיד.", grades: [Grade.GRADE_3] },
    { title: "שימוש במילון וסדר א'-ב'", description: "מיומנות חיפוש מילים לפי אלף-בית.", grades: [Grade.GRADE_3] },
    { title: "סיומות שייכות", description: "הוספת קניינים לשמות עצם.", grades: [Grade.GRADE_3] },
    { title: "מבנה המשפט", description: "זיהוי חלקי המשפט הפשוט.", grades: [Grade.GRADE_3] },
    // Grade 4
    { title: "מילות קישור", description: "חיבור בין חלקי משפט ופסוקיות.", grades: [Grade.GRADE_4] },
    { title: "משפחות מילים ושורשים", description: "זיהוי הקשר הסמנטי בין מילים.", grades: [Grade.GRADE_4] },
    { title: "סימני פיסוק מתקדמים", description: "שימוש בפסיק, נקודתיים ומירכאות.", grades: [Grade.GRADE_4] },
    { title: "סוגי טקסטים", description: "הבחנה בין טקסט מידעי לסיפורי.", grades: [Grade.GRADE_4] },
    // Grade 5
    { title: "נטיית הפועל בזמנים", description: "עבר, הווה ועתיד בבניינים השונים.", grades: [Grade.GRADE_5] },
    { title: "שם המספר", description: "כתיבת מספרים נכונה בזכר ונקבה.", grades: [Grade.GRADE_5] },
    { title: "כתיבת סיכום", description: "תמצות טקסט לנקודות מרכזיות.", grades: [Grade.GRADE_5] },
    { title: "מילים רב-משמעיות", description: "הבנת הקשר ופירושי מילים.", grades: [Grade.GRADE_5] },
    // Grade 6
    { title: "מילים נרדפות וניגודים", description: "עושר לשוני והרחבת אוצר מילים.", grades: [Grade.GRADE_6] },
    { title: "כתיבת טיעון פשוטה", description: "הצגת דעה ונימוק בסיסי.", grades: [Grade.GRADE_6] },
    { title: "ניתוח שירים", description: "הבנת אמצעים אמנותיים בשירה.", grades: [Grade.GRADE_6] },
    { title: "שלבי תהליך הכתיבה", description: "מתכנון ועד עריכה סופית.", grades: [Grade.GRADE_6] },
    // Grade 7
    { title: "מערכת הצורות", description: "שורש ותבנית בשפה העברית.", grades: [Grade.GRADE_7] },
    { title: "שם הפעולה", description: "מעבר בין פעלים לשמות פעולה.", grades: [Grade.GRADE_7] },
    { title: "הסגרים ודיבור ישיר/עקיף", description: "דרכי מבע ודיווח בטקסט.", grades: [Grade.GRADE_7] },
    { title: "כתיבת מאמר עמדה", description: "ניסוח טענה וביסוסה.", grades: [Grade.GRADE_7] },
    // Grade 8
    { title: "תחביר בסיסי: נושא ונשוא", description: "ניתוח המשפט הפשוט.", grades: [Grade.GRADE_8] },
    { title: "משלימי שם ופועל", description: "זיהוי תיאורים ותוארי השם.", grades: [Grade.GRADE_8] },
    { title: "גזרת השלמים", description: "נטיית הפועל ללא שינויי שורש.", grades: [Grade.GRADE_8] },
    { title: "השוואה בין טקסטים", description: "מציאת נקודות דמיון ושוני.", grades: [Grade.GRADE_8] },
    // Grade 9
    { title: "משפטים מורכבים ומחוברים", description: "ניתוח קשרים לוגיים בין פסוקיות.", grades: [Grade.GRADE_9] },
    { title: "עיקר וטפל בטקסט", description: "זיהוי הרעיון המרכזי.", grades: [Grade.GRADE_9] },
    { title: "דיוקי הגייה", description: "הגייה תקינה של מילים ושמות.", grades: [Grade.GRADE_9] },
    { title: "כתיבה ממזגת", description: "כתיבת טקסט המבוסס על מספר מקורות.", grades: [Grade.GRADE_9] },
    // Grade 10
    { title: "מערכת הבניינים", description: "משמעויות ונטייה בשבעת הבניינים.", grades: [Grade.GRADE_10] },
    { title: "גזרות חפ\"נ וחפי\"צ", description: "שינויים בשורש בעקבות אותיות גרוניות ונחיות.", grades: [Grade.GRADE_10] },
    { title: "ניתוח טקסטים אקדמיים", description: "הבנת מבנה מאמר מדעי.", grades: [Grade.GRADE_10] },
    { title: "כתיבת טיעון מורכבת", description: "התמודדות עם טענות נגד.", grades: [Grade.GRADE_10] },
    // Grade 11
    { title: "גזרות הנחים (ע\"ו, ע\"י)", description: "נטייה בשורשים עם אותיות אהו\"י.", grades: [Grade.GRADE_11] },
    { title: "סמנטיקה ומטפורות", description: "הבנת משמעות גלויה וסמויה.", grades: [Grade.GRADE_11] },
    { title: "תקינות תחבירית", description: "תיקון שגיאות נפוצות בכתיבה.", grades: [Grade.GRADE_11] },
    { title: "הכנה לבגרות (חלק א')", description: "תרגול שאלות הבנה והבעה.", grades: [Grade.GRADE_11] },
    // Grade 12
    { title: "חזרה על כללי הפיסוק", description: "דיוק בכתיבה לקראת הבחינה.", grades: [Grade.GRADE_12] },
    { title: "הבעה והבנה ברמה גבוהה", description: "ניתוח טקסטים מורכבים במיוחד.", grades: [Grade.GRADE_12] },
    { title: "גזרות מורכבות", description: "שילוב של גזרות שונות בפועל אחד.", grades: [Grade.GRADE_12] },
    { title: "הכנה סופית לבגרות", description: "סימולציות של מבחני בגרות.", grades: [Grade.GRADE_12] },
  ],
  [Subject.ENGLISH]: [
    // Grade 3
    { title: "The ABC and Phonics", description: "Learning letters and their sounds.", grades: [Grade.GRADE_3] },
    { title: "Greetings and Manners", description: "Hello, goodbye, and polite phrases.", grades: [Grade.GRADE_3] },
    { title: "Colors and Numbers", description: "Counting and identifying primary colors.", grades: [Grade.GRADE_3] },
    { title: "Animals and Nature", description: "Basic vocabulary for common animals.", grades: [Grade.GRADE_3] },
    // Grade 4
    { title: "Reading Simple Words", description: "Blending sounds into words.", grades: [Grade.GRADE_4] },
    { title: "Pronouns (I, you, he, she)", description: "Identifying people in sentences.", grades: [Grade.GRADE_4] },
    { title: "Basic Verbs", description: "Action words like jump, run, eat.", grades: [Grade.GRADE_4] },
    { title: "Family Members", description: "Vocabulary for father, mother, sister, brother.", grades: [Grade.GRADE_4] },
    // Grade 5
    { title: "Present Progressive", description: "Talking about what is happening now.", grades: [Grade.GRADE_5] },
    { title: "Adjectives", description: "Describing things (big, small, happy).", grades: [Grade.GRADE_5] },
    { title: "Prepositions of Place", description: "In, on, under, behind.", grades: [Grade.GRADE_5] },
    { title: "Writing Short Paragraphs", description: "Organizing simple thoughts into text.", grades: [Grade.GRADE_5] },
    // Grade 6
    { title: "Past Simple", description: "Talking about things that happened before.", grades: [Grade.GRADE_6] },
    { title: "Comparative Adjectives", description: "Comparing two things (taller, bigger).", grades: [Grade.GRADE_6] },
    { title: "Telling the Time", description: "Learning how to read analog clocks in English.", grades: [Grade.GRADE_6] },
    { title: "Modal Verbs (can, must)", description: "Expressing ability and obligation.", grades: [Grade.GRADE_6] },
    // Grade 7
    { title: "Future Simple", description: "Talking about things that will happen.", grades: [Grade.GRADE_7] },
    { title: "Irregular Verbs", description: "Mastering verbs that don't end in -ed.", grades: [Grade.GRADE_7] },
    { title: "Reading Strategies", description: "How to approach a new text.", grades: [Grade.GRADE_7] },
    { title: "Introduction to Unseen", description: "First steps in comprehension tests.", grades: [Grade.GRADE_7] },
    // Grade 8
    { title: "Present Perfect", description: "Life experiences and recent actions.", grades: [Grade.GRADE_8] },
    { title: "Passive Voice", description: "Focusing on the action, not the doer.", grades: [Grade.GRADE_8] },
    { title: "Connectors and Conjunctions", description: "And, but, so, because, however.", grades: [Grade.GRADE_8] },
    { title: "Formal Letter Writing", description: "Structuring a professional message.", grades: [Grade.GRADE_8] },
    // Grade 9
    { title: "First Conditional", description: "Talking about real possibilities (If... will...).", grades: [Grade.GRADE_9] },
    { title: "Relative Clauses", description: "Using who, which, that to join sentences.", grades: [Grade.GRADE_9] },
    { title: "Academic Vocabulary", description: "Advanced words for formal contexts.", grades: [Grade.GRADE_9] },
    { title: "Presentation Skills", description: "Giving a speech or talk in English.", grades: [Grade.GRADE_9] },
    // Grade 10
    { title: "Literature Analysis", description: "Analyzing short stories and poems.", grades: [Grade.GRADE_10] },
    { title: "Advanced Tenses", description: "Past perfect and future continuous.", grades: [Grade.GRADE_10] },
    { title: "Module C Strategies", description: "Preparing for the Bagrut Module C.", grades: [Grade.GRADE_10] },
    { title: "Using Gerunds", description: "Verbs acting as nouns.", grades: [Grade.GRADE_10] },
    // Grade 11
    { title: "Reported Speech", description: "How to repeat what someone else said.", grades: [Grade.GRADE_11] },
    { title: "Play or Novel Analysis", description: "Deep dive into a major literary work.", grades: [Grade.GRADE_11] },
    { title: "Module E/F Preparation", description: "Bagrut strategies for reading and listening.", grades: [Grade.GRADE_11] },
    { title: "Opinion Essay Writing", description: "Expressing and defending a viewpoint.", grades: [Grade.GRADE_11] },
    // Grade 12
    { title: "Complex Essays", description: "Writing multi-paragraph academic arguments.", grades: [Grade.GRADE_12] },
    { title: "Debating Skills", description: "Constructing and refuting arguments orally.", grades: [Grade.GRADE_12] },
    { title: "Advanced Syntax", description: "Inversion and complex structures.", grades: [Grade.GRADE_12] },
    { title: "Final Bagrut Prep", description: "Mock exams for 4/5 units.", grades: [Grade.GRADE_12] },
  ],
  [Subject.SCIENCE]: [
    // Grade 1
    { title: "עונות השנה", description: "שינויי מזג האוויר והשפעתם.", grades: [Grade.GRADE_1] },
    { title: "חושי האדם", description: "זיהוי ושימוש בחמשת החושים.", grades: [Grade.GRADE_1] },
    { title: "עולם החי והצומח", description: "הכרת בעלי חיים וצמחים בסביבה.", grades: [Grade.GRADE_1] },
    { title: "חומרים בסביבה", description: "זיהוי חומרים שונים מסביבנו.", grades: [Grade.GRADE_1] },
    // Grade 2
    { title: "מחזור המים בטבע", description: "כיצד מים משנים מצבי צבירה.", grades: [Grade.GRADE_2] },
    { title: "תזונה נכונה", description: "חשיבות אבות המזון לבריאות.", grades: [Grade.GRADE_2] },
    { title: "התפתחות צמחים", description: "משלב הזרע ועד לצמח בוגר.", grades: [Grade.GRADE_2] },
    { title: "בטיחות בחשמל", description: "שימוש נכון וזהיר בחשמל בבית.", grades: [Grade.GRADE_2] },
    // Grade 3
    { title: "סלעים וקרקעות", description: "הכרת סוגי אדמה ושימושיהם.", grades: [Grade.GRADE_3] },
    { title: "גוף האדם ובריאותו", description: "תפקוד איברים מרכזיים.", grades: [Grade.GRADE_3] },
    { title: "תכונות של חומרים", description: "משקל, צבע, קשיות ומוליכות.", grades: [Grade.GRADE_3] },
    { title: "טכנולוגיה בשירות האדם", description: "המצאות ששיפרו את חיינו.", grades: [Grade.GRADE_3] },
    // Grade 4
    { title: "מערכת הנשימה", description: "איך אנחנו נושמים ומה תפקיד הריאות.", grades: [Grade.GRADE_4] },
    { title: "השלד והשרירים", description: "מבנה הגוף ויכולת התנועה.", grades: [Grade.GRADE_4] },
    { title: "התאמות בעלי חיים", description: "איך חיות שורדות בסביבות שונות.", grades: [Grade.GRADE_4] },
    { title: "שרשרת המזון", description: "יחסי טורף-נטרף בטבע.", grades: [Grade.GRADE_4] },
    // Grade 5
    { title: "סוגי אנרגיה", description: "אנרגיית אור, חום ותנועה.", grades: [Grade.GRADE_5] },
    { title: "מערכת העיכול", description: "מסלול המזון בגופנו.", grades: [Grade.GRADE_5] },
    { title: "מערכת השמש", description: "הכרת כוכבי הלכת והחלל.", grades: [Grade.GRADE_5] },
    { title: "שימור הסביבה", description: "חשיבות המיחזור והקיימות.", grades: [Grade.GRADE_5] },
    // Grade 6
    { title: "חשמל ומגנטיות", description: "מעגלים חשמליים ותכונות המגנט.", grades: [Grade.GRADE_6] },
    { title: "מבנה התא", description: "היחידה הבסיסית של החיים.", grades: [Grade.GRADE_6] },
    { title: "אקולוגיה ויחסי גומלין", description: "שיתוף פעולה ותחרות בטבע.", grades: [Grade.GRADE_6] },
    { title: "תערובות של חומרים", description: "דרכי הפרדה וריכוזים.", grades: [Grade.GRADE_6] },
    // Grade 7
    { title: "מסה ונפח", description: "מדידות פיזיקליות בסיסיות.", grades: [Grade.GRADE_7] },
    { title: "מבנה האטום", description: "הכרת הפרוטונים, הנייטרונים והאלקטרונים.", grades: [Grade.GRADE_7] },
    { title: "מערכת ההובלה באדם", description: "הלב וכלי הדם.", grades: [Grade.GRADE_7] },
    { title: "מיון יצורים חיים", description: "סיווג ממלכות החי והצומח.", grades: [Grade.GRADE_7] },
    // Grade 8
    { title: "כוחות ותנועה", description: "הבנת מושגי הכוח והמהירות.", grades: [Grade.GRADE_8] },
    { title: "רבייה בטבע", description: "תהליכי המשכיות המינים.", grades: [Grade.GRADE_8] },
    { title: "יסודות ותרכובות", description: "הטבלה המחזורית וקשרים בסיסיים.", grades: [Grade.GRADE_8] },
    { title: "אנרגיה חשמלית", description: "ייצור ושימוש בחשמל.", grades: [Grade.GRADE_8] },
    // Grade 9
    { title: "גנטיקה ותורשה", description: "איך תכונות עוברות מהורים לצאצאים.", grades: [Grade.GRADE_9] },
    { title: "מערכת העצבים", description: "המוח ותגובות הגוף לגירויים.", grades: [Grade.GRADE_9] },
    { title: "קשרים כימיים", description: "קשר יוני, שיתופי ומתכתי.", grades: [Grade.GRADE_9] },
    { title: "חוקי ניוטון", description: "שלושת חוקי התנועה המרכזיים.", grades: [Grade.GRADE_9] },
    // Grade 10
    { title: "אבולוציה", description: "תורת דרווין והתפתחות המינים.", grades: [Grade.GRADE_10] },
    { title: "קינמטיקה", description: "תיאור תנועה בקו ישר.", grades: [Grade.GRADE_10] },
    { title: "מבנה וקישור", description: "כימיה מולקולרית מתקדמת.", grades: [Grade.GRADE_10] },
    { title: "משבר האקלים", description: "ההיבטים המדעיים של התחממות כדור הארץ.", grades: [Grade.GRADE_10] },
    // Grade 11
    { title: "ביוכימיה", description: "תהליכים כימיים ביצורים חיים.", grades: [Grade.GRADE_11] },
    { title: "דינמיקה", description: "כוחות ומכניקה מתקדמת.", grades: [Grade.GRADE_11] },
    { title: "חומצות ובסיסים", description: "תגובות כימיות ו-pH.", grades: [Grade.GRADE_11] },
    { title: "הומיאוסטזיס", description: "שמירה על סביבה פנימית יציבה.", grades: [Grade.GRADE_11] },
    // Grade 12
    { title: "פיזיקה מודרנית", description: "תורת היחסות והקוונטים בקצרה.", grades: [Grade.GRADE_12] },
    { title: "ביוטכנולוגיה", description: "יישומים מדעיים ברפואה וחקלאות.", grades: [Grade.GRADE_12] },
    { title: "כימיה של חומרי טבע", description: "פולימרים וחומרים מורכבים.", grades: [Grade.GRADE_12] },
    { title: "מעבדות חקר", description: "שיטות עבודה וניסויים מתקדמים.", grades: [Grade.GRADE_12] },
  ],
  [Subject.HISTORY]: [
    // Grade 1-3
    { title: "שורשי המשפחה", description: "חקר העבר המשפחתי.", grades: [Grade.GRADE_1, Grade.GRADE_2, Grade.GRADE_3] },
    { title: "סיפורי ראשונים", description: "התיישבות ותחילת הדרך.", grades: [Grade.GRADE_1, Grade.GRADE_2, Grade.GRADE_3] },
    { title: "מורשת וסמלים", description: "הבנת סמלי המדינה.", grades: [Grade.GRADE_1, Grade.GRADE_2, Grade.GRADE_3] },
    { title: "חגים ומועדים בעבר", description: "איך חגגו פעם?", grades: [Grade.GRADE_1, Grade.GRADE_2, Grade.GRADE_3] },
    // Grade 4
    { title: "סיפורי היישוב", description: "הכרת העבר המקומי.", grades: [Grade.GRADE_4] },
    { title: "דמויות מופת בישראל", description: "אישים ששינו את פני המדינה.", grades: [Grade.GRADE_4] },
    { title: "ראשית המדינה", description: "ימי הקמת מדינת ישראל.", grades: [Grade.GRADE_4] },
    { title: "מורשת קרב", description: "סיפורי גבורה מתקופת תש\"ח.", grades: [Grade.GRADE_4] },
    // Grade 5
    { title: "העת העתיקה", description: "חיי היומיום בארץ ישראל הקדומה.", grades: [Grade.GRADE_5] },
    { title: "ממלכות יהודה וישראל", description: "תקופת הבית הראשון.", grades: [Grade.GRADE_5] },
    { title: "חיי היומיום בעבר", description: "חברה וכלכלה בתקופה המקראית.", grades: [Grade.GRADE_5] },
    { title: "בתי כנסת עתיקים", description: "אמנות ופולחן בעת העתיקה.", grades: [Grade.GRADE_5] },
    // Grade 6
    { title: "יוון ורומא", description: "השפעת התרבות הקלאסית.", grades: [Grade.GRADE_6] },
    { title: "המשנה והתלמוד", description: "חיי הרוח לאחר החורבן.", grades: [Grade.GRADE_6] },
    { title: "המהפכה החקלאית", description: "המעבר של האדם ליישוב קבע.", grades: [Grade.GRADE_6] },
    { title: "גילוי יבשות חדשות", description: "עידן התגליות הגדולות.", grades: [Grade.GRADE_6] },
    // Grade 7
    { title: "ימי הביניים", description: "נצרות ואסלאם במרחב.", grades: [Grade.GRADE_7] },
    { title: "פיאודליזם", description: "מבנה החברה באירופה.", grades: [Grade.GRADE_7] },
    { title: "מסעי הצלב", description: "מפגש בין תרבויות ודתות.", grades: [Grade.GRADE_7] },
    { title: "תור הזהב בספרד", description: "שיא התרבות היהודית בספרד.", grades: [Grade.GRADE_7] },
    // Grade 8
    { title: "הרנסנס וההומניזם", description: "הולדת האדם המודרני.", grades: [Grade.GRADE_8] },
    { title: "המהפכה הצרפתית", description: "חירות, שוויון ואחווה.", grades: [Grade.GRADE_8] },
    { title: "המהפכה התעשייתית", description: "שינויי טכנולוגיה וחברה.", grades: [Grade.GRADE_8] },
    { title: "תנועת ההשכלה", description: "התפתחות המדע והמחשבה.", grades: [Grade.GRADE_8] },
    // Grade 9
    { title: "הלאומיות באירופה", description: "צמיחת מדינות הלאום.", grades: [Grade.GRADE_9] },
    { title: "ראשית הציונות", description: "הרצל ותחילת התנועה.", grades: [Grade.GRADE_9] },
    { title: "מלחמת העולם הראשונה", description: "הגורמים והשלכותיה.", grades: [Grade.GRADE_9] },
    { title: "המנדט הבריטי", description: "שלטון בריטניה בארץ ישראל.", grades: [Grade.GRADE_9] },
    // Grade 10
    { title: "נאציזם", description: "עליית היטלר לשלטון.", grades: [Grade.GRADE_10] },
    { title: "מלחמת העולם השנייה", description: "החזיתות והמהלכים.", grades: [Grade.GRADE_10] },
    { title: "השואה והגבורה", description: "גורל העם היהודי באירופה.", grades: [Grade.GRADE_10] },
    { title: "היישוב בזמן המלחמה", description: "תרומת היישוב למאמץ המלחמתי.", grades: [Grade.GRADE_10] },
    // Grade 11
    { title: "הקמת המדינה", description: "מכ\"ט בנובמבר ועד הכרזת העצמאות.", grades: [Grade.GRADE_11] },
    { title: "מלחמת העצמאות", description: "שלבי המלחמה והניצחון.", grades: [Grade.GRADE_11] },
    { title: "המלחמה הקרה", description: "המאבק הבין-גושי בעולם.", grades: [Grade.GRADE_11] },
    { title: "מאבק המחתרות", description: "אצ\"ל, לח\"י וההגנה.", grades: [Grade.GRADE_11] },
    // Grade 12
    { title: "מלחמות ישראל", description: "מקדש ועד למלחמות האחרונות.", grades: [Grade.GRADE_12] },
    { title: "תהליכים בחברה", description: "שינויים דמוגרפיים ותרבותיים בישראל.", grades: [Grade.GRADE_12] },
    { title: "דמוקרטיה ודיקטטורה", description: "השוואה בין משטרים בעולם.", grades: [Grade.GRADE_12] },
    { title: "אירועים גלובליים", description: "העולם במאה ה-21.", grades: [Grade.GRADE_12] },
  ],
  [Subject.GEOGRAPHY]: [
    // Grade 1-3
    { title: "הכרת הסביבה", description: "חקר השכונה והעיר שלי.", grades: [Grade.GRADE_1, Grade.GRADE_2, Grade.GRADE_3] },
    { title: "כיווני שמיים", description: "מזרח, מערב, צפון ודרום.", grades: [Grade.GRADE_1, Grade.GRADE_2, Grade.GRADE_3] },
    { title: "סוגי יישובים", description: "קיבוץ, מושב ועיר.", grades: [Grade.GRADE_1, Grade.GRADE_2, Grade.GRADE_3] },
    { title: "הגלובוס והמפה", description: "איך נראה העולם מלמעלה?", grades: [Grade.GRADE_1, Grade.GRADE_2, Grade.GRADE_3] },
    // Grade 4
    { title: "הכרת המפה", description: "קריאת סימנים מוסכמים.", grades: [Grade.GRADE_4] },
    { title: "רוחות השמיים", description: "ניווט והתמצאות במרחב.", grades: [Grade.GRADE_4] },
    { title: "מפת ישראל", description: "זיהוי אזורים מרכזיים בארץ.", grades: [Grade.GRADE_4] },
    { title: "נופי הארץ", description: "הבחנה בין נוף טבעי לאנושי.", grades: [Grade.GRADE_4] },
    // Grade 5
    { title: "אזורי הארץ", description: "הנגב, הגליל ומישור החוף.", grades: [Grade.GRADE_5] },
    { title: "משאבי טבע", description: "מים, שמש ומחצבים בישראל.", grades: [Grade.GRADE_5] },
    { title: "אקלים ומזג אוויר", description: "סוגי אקלים במרחב הישראלי.", grades: [Grade.GRADE_5] },
    { title: "הגירה", description: "תנועת אוכלוסייה בעולם.", grades: [Grade.GRADE_5] },
    // Grade 6
    { title: "יבשות ואוקיינוסים", description: "פריסת היבשות על פני כדור הארץ.", grades: [Grade.GRADE_6] },
    { title: "גלובליזציה", description: "הכפר הגלובלי והשפעותיו.", grades: [Grade.GRADE_6] },
    { title: "צפיפות אוכלוסין", description: "איפה אנשים בוחרים לגור?", grades: [Grade.GRADE_6] },
    { title: "תיירות עולמית", description: "השפעת התיירות על המרחב.", grades: [Grade.GRADE_6] },
    // Grade 7
    { title: "טקטוניקה", description: "מבנה כדור הארץ והלוחות.", grades: [Grade.GRADE_7] },
    { title: "רעידות אדמה", description: "גורמים והיערכות לאסונות.", grades: [Grade.GRADE_7] },
    { title: "בעיית המים", description: "מחסור במים מתוקים בעולם.", grades: [Grade.GRADE_7] },
    { title: "עיור (אורבניזציה)", description: "צמיחת הערים הגדולות.", grades: [Grade.GRADE_7] },
    // Grade 8
    { title: "המזרח התיכון", description: "היבטים גאוגרפיים ופוליטיים.", grades: [Grade.GRADE_8] },
    { title: "משאבי אנרגיה", description: "נפט, גז ואנרגיה ירוקה.", grades: [Grade.GRADE_8] },
    { title: "קונפליקטים", description: "מאבקים על טריטוריה ומשאבים.", grades: [Grade.GRADE_8] },
    { title: "איכות הסביבה", description: "זיהום אוויר ומים בעולם.", grades: [Grade.GRADE_8] },
    // Grade 9
    { title: "מדינות מפותחות", description: "מאפייני העולם המפותח.", grades: [Grade.GRADE_9] },
    { title: "התחממות גלובלית", description: "שינויי אקלים והשלכותיהם.", grades: [Grade.GRADE_9] },
    { title: "אסונות טבע", description: "שיטפונות, הוריקנים ובצורת.", grades: [Grade.GRADE_9] },
    { title: "GIS", description: "מערכות מידע גאוגרפיות.", grades: [Grade.GRADE_9] },
    // Grade 10
    { title: "תצלומי אוויר", description: "פענוח וניתוח תצ\"אות.", grades: [Grade.GRADE_10] },
    { title: "גאוגרפיה עירונית", description: "מבנה העיר המודרנית.", grades: [Grade.GRADE_10] },
    { title: "כלכלה עולמית", description: "סחר בינלאומי וארגונים כלכליים.", grades: [Grade.GRADE_10] },
    { title: "תכנון מרחבי", description: "איך מתכננים עיר וסביבה?", grades: [Grade.GRADE_10] },
    // Grade 11
    { title: "חקר האקלים", description: "תופעות אקלימיות בישראל.", grades: [Grade.GRADE_11] },
    { title: "סוגיות חברה", description: "הפסיפס האנושי של ישראל.", grades: [Grade.GRADE_11] },
    { title: "אגן הים התיכון", description: "קשרים גאוגרפיים אזוריים.", grades: [Grade.GRADE_11] },
    { title: "הכנה לבגרות", description: "תרגול שאלות בגרות בגאוגרפיה.", grades: [Grade.GRADE_11] },
    // Grade 12
    { title: "פיתוח בר-קיימא", description: "איזון בין פיתוח לשימור.", grades: [Grade.GRADE_12] },
    { title: "גאופוליטיקה", description: "יחסים בינלאומיים במרחב.", grades: [Grade.GRADE_12] },
    { title: "שינויים דמוגרפיים", description: "הזדקנות אוכלוסייה וילודה.", grades: [Grade.GRADE_12] },
    { title: "ניהול סיכונים", description: "התמודדות עם משברים סביבתיים.", grades: [Grade.GRADE_12] },
  ],
  [Subject.BIBLE]: [
    // Grade 1-2
    { title: "סיפורי הבריאה", description: "ראשית העולם בראי המקרא.", grades: [Grade.GRADE_1, Grade.GRADE_2] },
    { title: "האבות והאימהות", description: "סיפורי אברהם, יצחק ויעקב.", grades: [Grade.GRADE_1, Grade.GRADE_2] },
    { title: "המבול ותיבת נח", description: "סיפור הצלת העולם מהמבול.", grades: [Grade.GRADE_1, Grade.GRADE_2] },
    { title: "מגדל בבל", description: "ראשית השפות והעמים.", grades: [Grade.GRADE_1, Grade.GRADE_2] },
    // Grade 3
    { title: "יציאת מצרים", description: "מעבדות לחירות ועשר המכות.", grades: [Grade.GRADE_3] },
    { title: "עשרת הדיברות", description: "הבסיס המוסרי של עם ישראל.", grades: [Grade.GRADE_3] },
    { title: "נדודי המדבר", description: "מסע בני ישראל לארץ כנען.", grades: [Grade.GRADE_3] },
    { title: "דמותו של משה", description: "חייו ומנהיגותו של משה רבנו.", grades: [Grade.GRADE_3] },
    // Grade 4
    { title: "ספר יהושע", description: "כיבוש הארץ וחלוקת הנחלות.", grades: [Grade.GRADE_4] },
    { title: "ספר שופטים", description: "תקופת המנהיגות המקומית.", grades: [Grade.GRADE_4] },
    { title: "דבורה ושמשון", description: "דמויות מופת בספר שופטים.", grades: [Grade.GRADE_4] },
    { title: "מנהיגות מקראית", description: "תכונות המנהיג בעבר.", grades: [Grade.GRADE_4] },
    // Grade 5
    { title: "ספר שמואל", description: "ראשית המלוכה בישראל.", grades: [Grade.GRADE_5] },
    { title: "המלך שאול", description: "עלייתו ונפילתו של המלך הראשון.", grades: [Grade.GRADE_5] },
    { title: "דוד וגוליית", description: "סיפור הגבורה והאמונה.", grades: [Grade.GRADE_5] },
    { title: "מלכות דוד", description: "קביעת ירושלים כבירת המדינה.", grades: [Grade.GRADE_5] },
    // Grade 6
    { title: "ספר מלכים", description: "תקופת הזוהר והפילוג.", grades: [Grade.GRADE_6] },
    { title: "שלמה המלך", description: "חכמתו ובניין בית המקדש.", grades: [Grade.GRADE_6] },
    { title: "פילוג המלוכה", description: "הפיצול לישראל ויהודה.", grades: [Grade.GRADE_6] },
    { title: "אליהו הנביא", description: "מאבק בנביאי הבעל.", grades: [Grade.GRADE_6] },
    // Grade 7
    { title: "גלות בבל", description: "חורבן הבית הראשון והיציאה לגלות.", grades: [Grade.GRADE_7] },
    { title: "שיבת ציון", description: "עליית עזרא ונחמיה לארץ.", grades: [Grade.GRADE_7] },
    { title: "מגילת אסתר", description: "סיפור הגאולה בפרס.", grades: [Grade.GRADE_7] },
    { title: "חורבן הבית הראשון", description: "הגורמים והקינות.", grades: [Grade.GRADE_7] },
    // Grade 8
    { title: "נביאי בית ראשון", description: "נבואות עמוס והושע.", grades: [Grade.GRADE_8] },
    { title: "נבואות נחמה", description: "חזון הגאולה של הנביאים.", grades: [Grade.GRADE_8] },
    { title: "ספר יונה", description: "הבריחה מהשליחות והתשובה.", grades: [Grade.GRADE_8] },
    { title: "צדק חברתי", description: "מסר חברתי בראי המקרא.", grades: [Grade.GRADE_8] },
    // Grade 9
    { title: "ספרות החכמה", description: "משלי וקהלת - פניני חכמה.", grades: [Grade.GRADE_9] },
    { title: "ספר איוב", description: "התמודדות עם סבל הצדיק.", grades: [Grade.GRADE_9] },
    { title: "תהילים", description: "מזמורי תפילה ושבח.", grades: [Grade.GRADE_9] },
    { title: "שאלת הגמול", description: "שכר ועונש במקרא.", grades: [Grade.GRADE_9] },
    // Grade 10
    { title: "חוקי התורה", description: "בין אדם לחברו ובין אדם למקום.", grades: [Grade.GRADE_10] },
    { title: "סיפורי ראשית", description: "ניתוח ספרותי מעמיק.", grades: [Grade.GRADE_10] },
    { title: "עבודה זרה", description: "המאבק באלילות המזרח הקדום.", grades: [Grade.GRADE_10] },
    { title: "פרשנות חז\"ל", description: "איך חכמים פירשו את הפשט?", grades: [Grade.GRADE_10] },
    // Grade 11
    { title: "נביאי אמת ושקר", description: "זיהוי הנביא והמסר.", grades: [Grade.GRADE_11] },
    { title: "ירמיהו וחורבן", description: "נבואות הלב השבור.", grades: [Grade.GRADE_11] },
    { title: "חטאי דוד", description: "דמות המנהיג האנושי.", grades: [Grade.GRADE_11] },
    { title: "הכנה לבגרות", description: "נושאי חובה בבחינה.", grades: [Grade.GRADE_11] },
    // Grade 12
    { title: "חמש מגילות", description: "שיר השירים ורות - אהבה וחסד.", grades: [Grade.GRADE_12] },
    { title: "חזון אחרית הימים", description: "העתיד בראי הנבואה.", grades: [Grade.GRADE_12] },
    { title: "המזרח הקדום", description: "השוואה בין המקרא לתרבויות שכנות.", grades: [Grade.GRADE_12] },
    { title: "פרשנות מודרנית", description: "גישות חדשות לטקסט המקראי.", grades: [Grade.GRADE_12] },
  ],
  [Subject.CIVICS]: [
    // Grade 1-8 (Simulated curriculum based on user preference)
    { title: "חברות ועזרה", description: "ערכים חברתיים בסיסיים.", grades: [Grade.GRADE_1, Grade.GRADE_2, Grade.GRADE_3, Grade.GRADE_4, Grade.GRADE_5, Grade.GRADE_6, Grade.GRADE_7, Grade.GRADE_8] },
    { title: "סמלי המדינה", description: "הדגל, הסמל וההמנון.", grades: [Grade.GRADE_1, Grade.GRADE_2, Grade.GRADE_3, Grade.GRADE_4, Grade.GRADE_5, Grade.GRADE_6, Grade.GRADE_7, Grade.GRADE_8] },
    { title: "חוקים בבית הספר", description: "חשיבות הכללים בקהילה.", grades: [Grade.GRADE_1, Grade.GRADE_2, Grade.GRADE_3, Grade.GRADE_4, Grade.GRADE_5, Grade.GRADE_6, Grade.GRADE_7, Grade.GRADE_8] },
    { title: "זכויות הילד", description: "הכרת הזכויות הבסיסיות.", grades: [Grade.GRADE_1, Grade.GRADE_2, Grade.GRADE_3, Grade.GRADE_4, Grade.GRADE_5, Grade.GRADE_6, Grade.GRADE_7, Grade.GRADE_8] },
    // Grade 9
    { title: "זכויות האדם", description: "הכרת הזכויות הטבעיות והחברתיות.", grades: [Grade.GRADE_9] },
    { title: "שלטון החוק", description: "החובה לציית לחוק במדינה דמוקרטית.", grades: [Grade.GRADE_9] },
    { title: "הפרדת הרשויות", description: "איזונים ובלמים בין רשויות השלטון.", grades: [Grade.GRADE_9] },
    { title: "סמלי המדינה", description: "היבטים חוקיים וערכיים.", grades: [Grade.GRADE_9] },
    // Grade 10
    { title: "הכרזת העצמאות", description: "ניתוח המסמך המכונן של ישראל.", grades: [Grade.GRADE_10] },
    { title: "יהודית ודמוקרטית", description: "הגדרת זהות המדינה.", grades: [Grade.GRADE_10] },
    { title: "הכנסת", description: "תפקיד הרשות המחוקקת.", grades: [Grade.GRADE_10] },
    { title: "מפלגות ובחירות", description: "איך עובדת שיטת הבחירות בישראל?", grades: [Grade.GRADE_10] },
    // Grade 11
    { title: "הממשלה", description: "תפקיד הרשות המבצעת.", grades: [Grade.GRADE_11] },
    { title: "הרשות השופטת", description: "עצמאות בית המשפט ושלטון החוק.", grades: [Grade.GRADE_11] },
    { title: "תקשורת ודמוקרטיה", description: "חופש הביטוי והעיתונות.", grades: [Grade.GRADE_11] },
    { title: "קבוצות בחברה", description: "מיעוטים ורב-תרבותיות בישראל.", grades: [Grade.GRADE_11] },
    // Grade 12
    { title: "פיקוח וביקורת", description: "מבקר המדינה ונציב תלונות הציבור.", grades: [Grade.GRADE_12] },
    { title: "דת ומדינה", description: "השסע הדתי-חילוני וסוגיות הסטטוס קוו.", grades: [Grade.GRADE_12] },
    { title: "המערכת המקומית", description: "תפקיד הרשויות המקומיות.", grades: [Grade.GRADE_12] },
    { title: "הכנה לבגרות", description: "מרתון פתרון בחינות בגרות.", grades: [Grade.GRADE_12] },
  ]
};
