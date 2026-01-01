import React, { useState } from 'react';
import { X, User, Save } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userPhoto: string;
  onUpdate: (name: string, photoUrl: string) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, userName, userPhoto, onUpdate }) => {
  const [name, setName] = useState(userName);

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdate(name, userPhoto);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl relative z-10 overflow-hidden animate-fade-in">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-900">עריכת פרופיל</h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                <X size={20} />
            </button>
        </div>

        <div className="p-8">
            <div className="flex flex-col items-center mb-8">
                <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-bold border-4 border-blue-50 shadow-sm">
                    {name ? name[0] : <User size={32} />}
                </div>
            </div>

            <div className="mb-8">
                <label className="block text-sm font-bold text-gray-700 mb-2 text-right">שם מלא</label>
                <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary outline-none transition-all text-right font-bold"
                    placeholder="הקלד שם..."
                />
            </div>

            <button 
                onClick={handleSave}
                className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
            >
                <Save size={20} />
                <span>שמור שינויים</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;