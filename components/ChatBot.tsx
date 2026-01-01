
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Paperclip, X, Image as ImageIcon } from 'lucide-react';
import { ChatMessage, Subject, Grade } from '../types.ts';
import { getChatResponseStream } from '../services/geminiService.ts';
import { GenerateContentResponse } from "@google/genai";
import LatexRenderer from './LatexRenderer.tsx';

interface ChatBotProps {
  subject: Subject;
  grade: Grade;
  userName?: string | null;
  initialMessage?: string | null;
}

const CHAT_LOADING_MESSAGES = [
    "מקליד...",
    "חושב על תשובה...",
    "בודק בספרים...",
    "מנסח את המשפט...",
    "רגע אחד..."
];

const ChatBot: React.FC<ChatBotProps> = ({ subject, grade, userName, initialMessage }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'intro',
      role: 'model',
      text: `שלום ${userName || ''}! אני המורה הפרטי שלך ל${subject}. איך אני יכול לעזור לך היום בחומר של ${grade}?`,
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const [attachment, setAttachment] = useState<{file: File, preview: string} | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    let interval: any;
    if (isLoading) {
       interval = setInterval(() => {
          setLoadingMsgIndex((prev) => (prev + 1) % CHAT_LOADING_MESSAGES.length);
       }, 2000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  useEffect(() => {
    if (initialMessage) {
      setInput(initialMessage);
    }
  }, [initialMessage]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachment({
          file: file,
          preview: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAttachment = () => {
    setAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSend = async () => {
    if ((!input.trim() && !attachment) || isLoading) return;

    let attachmentData = undefined;
    if (attachment) {
      const base64Data = attachment.preview.split(',')[1];
      attachmentData = {
        mimeType: attachment.file.type,
        data: base64Data
      };
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now(),
      attachment: attachmentData
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setAttachment(null);
    setIsLoading(true);

    try {
      const history = messages
        .filter(m => !m.attachment)
        .map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }));

      const stream = await getChatResponseStream(history, userMessage.text, subject, grade, attachmentData);
      
      let fullResponse = '';
      const botMessageId = (Date.now() + 1).toString();
      
      setMessages(prev => [...prev, {
        id: botMessageId,
        role: 'model',
        text: '',
        timestamp: Date.now()
      }]);

      for await (const chunk of stream) {
        const c = chunk as GenerateContentResponse;
        if (c.text) {
          fullResponse += c.text;
          setMessages(prev => prev.map(msg => 
            msg.id === botMessageId ? { ...msg, text: fullResponse } : msg
          ));
        }
      }

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: 'סליחה, הייתה בעיה בתקשורת. נסה שוב מאוחר יותר.',
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-accent to-purple-600 p-4 text-white flex items-center gap-3">
        <div className="bg-white/20 p-2 rounded-full"><Bot size={24} /></div>
        <div><h3 className="font-bold">המורה הפרטי שלך</h3><p className="text-xs opacity-90">{subject} - {grade}</p></div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-accent text-white'}`}>{msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}</div>
            <div className={`max-w-[80%] flex flex-col gap-2`}>
              {msg.attachment && <div className="rounded-lg overflow-hidden border border-gray-200 mb-1 max-w-[200px]"><img src={`data:${msg.attachment.mimeType};base64,${msg.attachment.data}`} alt="attachment" className="w-full h-auto" /></div>}
              {msg.text && (
                <div className={`p-3 rounded-2xl text-sm shadow-sm border border-gray-100 ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none'}`}>
                  <LatexRenderer text={msg.text} />
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && <div className="flex items-center gap-2 text-gray-400 text-sm mr-12 animate-pulse"><Loader2 className="animate-spin" size={16} /><span>{CHAT_LOADING_MESSAGES[loadingMsgIndex]}</span></div>}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-white border-t border-gray-100">
        {attachment && <div className="flex items-center gap-2 mb-2 p-2 bg-gray-50 rounded-lg w-fit border border-gray-200"><div className="w-10 h-10 bg-gray-200 rounded overflow-hidden"><img src={attachment.preview} alt="preview" className="w-full h-full object-cover" /></div><button onClick={removeAttachment} className="text-gray-400 hover:text-red-500"><X size={16} /></button></div>}
        <div className="flex gap-2 items-end"><button onClick={() => fileInputRef.current?.click()} className="p-3 text-gray-400 hover:text-primary rounded-xl transition-all"><Paperclip size={20} /></button><input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" /><div className="flex-1 bg-white border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-accent/50 transition-all flex items-center"><textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} placeholder="שאל שאלה..." className="flex-1 p-3 bg-transparent border-none focus:outline-none resize-none max-h-32 min-h-[44px]" rows={1} disabled={isLoading} /></div><button onClick={handleSend} disabled={(!input.trim() && !attachment) || isLoading} className="bg-accent hover:bg-accent/90 disabled:bg-gray-300 text-white p-3 rounded-xl transition-colors mb-px"><Send size={20} className={isLoading ? 'opacity-0' : ''} /></button></div>
      </div>
    </div>
  );
};

export default ChatBot;
