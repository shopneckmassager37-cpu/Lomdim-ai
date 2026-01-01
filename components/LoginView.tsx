
import React, { useState } from 'react';
import { GraduationCap, User, ArrowLeft, ShieldCheck } from 'lucide-react';
import { User as UserType } from '../types';

interface LoginViewProps {
  onLogin: (user: UserType) => void;
  onPrivacyClick: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin, onPrivacyClick }) => {
  const [name, setName] = useState('');
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && agreed) {
      onLogin({
        id: 'user-' + Math.random().toString(36).substr(2, 9),
        name: name.trim(),
        photoUrl: '', 
        provider: 'guest',
        email: '' 
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-purple-50 font-sans">
      <div className="max-w-xl w-full bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-gray-100 relative overflow-hidden animate-fade-in">
        
        {/* Background Decorations */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-blue-100 rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-purple-100 rounded-full opacity-50 blur-3xl"></div>

        <div className="relative z-10 text-center">
          <div className="bg-primary w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-white shadow-lg rotate-3">
            <GraduationCap size={44} />
          </div>
          
          <h1 className="text-4xl font-black text-gray-900 mb-2">ברוכים הבאים!</h1>
          <p className="text-lg text-gray-500 mb-10">בואו נתחיל ללמוד. איך תרצו שנקרא לכם?</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div className="relative">
               <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="הקלידו את שמכם כאן..."
                className="w-full p-5 text-center text-xl font-bold bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-gray-300 placeholder:font-normal"
                required
                autoFocus
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none">
                <User size={24} />
              </div>
            </div>

            {/* Privacy Policy Checkbox */}
            <div className="flex items-center justify-center gap-3 p-2">
              <label className="relative flex items-center cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={agreed} 
                  onChange={(e) => setAgreed(e.target.checked)} 
                  className="peer sr-only"
                />
                <div className="w-6 h-6 bg-gray-100 border-2 border-gray-200 rounded-md peer-checked:bg-primary peer-checked:border-primary transition-all flex items-center justify-center">
                   <ShieldCheck size={16} className={`text-white transition-opacity ${agreed ? 'opacity-100' : 'opacity-0'}`} />
                </div>
                <div className="mr-3 text-sm text-gray-600 font-medium select-none">
                  אני מסכים/ה ומאשר/ת את 
                  <button type="button" onClick={onPrivacyClick} className="text-primary hover:underline mx-1 font-bold">מדיניות הפרטיות</button>
                </div>
              </label>
            </div>

            <button
              type="submit"
              disabled={!name.trim() || !agreed}
              className="w-full bg-gray-900 hover:bg-black disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-5 rounded-2xl transition-all flex items-center justify-center gap-3 text-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 mt-4"
            >
              <span>התחל ללמוד</span>
              <ArrowLeft size={24} />
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
