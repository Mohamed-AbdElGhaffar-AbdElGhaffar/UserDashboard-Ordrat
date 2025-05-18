'use client';

import React, { useRef } from 'react';
import { ChatTranslations } from '../types/chat';

interface FileUploadMenuProps {
  lang: string;
  isOpen: boolean;
  onClose: () => void;
  onFileUpload: (file: File) => void;
  onImageUpload: (file: File) => void;
}

const FileUploadMenu: React.FC<FileUploadMenuProps> = ({ 
  isOpen, 
  lang, 
  onClose, 
  onFileUpload, 
  onImageUpload 
}) => {
  const isRTL = lang === 'ar';
  const text = {
    cancel: isRTL ? 'إلغاء' : 'Cancel',
    document: isRTL ? 'ملف' : 'Document',
    photo: isRTL ? 'صورة' : 'Photo',
    share: isRTL ? 'مشاركة' : 'Share',
  };
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleClickOutside = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileUpload(e.target.files[0]);
      onClose();
      // Reset the input value so the same file can be selected again
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onImageUpload(e.target.files[0]);
      onClose();
      // Reset the input value so the same image can be selected again
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="w-fit absolute top-0 start-0 inset-0 flex items-end justify-center z-50"
      onClick={handleClickOutside}
    >
      <div 
        className="bg-white rounded-t-xl shadow-lg w-full max-w-md p-4 mb-16 animate-slide-up"
        onClick={handleMenuClick}
      >
        <h3 className="text-lg font-medium text-gray-900 mb-4">{text.share}</h3>
        
        <div className="grid grid-cols-4 gap-4 mb-6">
          {/* Document button */}
          <div 
            className="flex flex-col items-center cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <line x1="10" y1="9" x2="8" y2="9" />
              </svg>
            </div>
            <span className="text-xs text-gray-700">{text.document}</span>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.csv,.zip,.rar"
              onChange={handleFileInputChange}
            />
          </div>
          
          {/* Photo button */}
          <div 
            className="flex flex-col items-center cursor-pointer"
            onClick={() => imageInputRef.current?.click()}
          >
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <span className="text-xs text-gray-700">{text.photo}</span>
            <input
              ref={imageInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageInputChange}
            />
          </div>
        </div>
        
        <button 
          className="w-full py-2 rounded-md font-medium text-gray-700 hover:bg-gray-100"
          onClick={onClose}
        >
          {text.cancel}
        </button>
      </div>
    </div>
  );
};

export default FileUploadMenu;