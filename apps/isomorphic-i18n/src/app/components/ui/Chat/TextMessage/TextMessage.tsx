'use client';
import React, { useState } from 'react';
import { TextMessage as TextMessageType } from '../types/chat';
import { CheckmarkIcon } from '../icons/icons';
import ImageViewerModal from '../ImageViewerModal/ImageViewerModal';

interface TextMessageProps {
  message: TextMessageType;
}

const TextMessageComponent: React.FC<TextMessageProps> = ({ message }) => {
  const isMe = message.sender === 'me';
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState({ url: '', alt: '' });
  
  // Check if the message contains an image
  const containsImage = message.text.includes('<img');
  
  // Function to extract image URL and alt from HTML
  const extractImageInfo = (html: string) => {
    const srcMatch = html.match(/src="([^"]+)"/);
    const altMatch = html.match(/alt="([^"]+)"/);
    
    const url = srcMatch ? srcMatch[1] : '';
    const alt = altMatch ? altMatch[1] : 'Image';
    
    return { url, alt };
  };
  
  // Function to handle image click
  const handleImageClick = () => {
    if (containsImage) {
      const imageInfo = extractImageInfo(message.text);
      setSelectedImage(imageInfo);
      setImageModalOpen(true);
    }
  };
  
  return (
    <>
      <div className={`max-w-md ${isMe ? 'bg-indigo-600 text-white' : 'bg-white text-gray-800'} rounded-lg shadow-sm p-4`}>
        {containsImage ? (
          // If the message contains an image, render with image wrapper and click handler
          <div 
            className="image-container cursor-pointer transition-transform hover:scale-[1.02]"
            onClick={handleImageClick}
          >
            <div dangerouslySetInnerHTML={{ __html: message.text }} />
          </div>
        ) : (
          // Regular text message
          <p>{message.text}</p>
        )}
        
        <div className="flex justify-end items-center mt-2">
          <span className={`text-xs ${isMe ? 'text-indigo-200' : 'text-gray-500'}`}>
            {message.time}
          </span>
          {isMe && message.read && (
            <div className="ms-1 text-indigo-200">
              <CheckmarkIcon />
            </div>
          )}
        </div>
      </div>
      
      {/* Image viewer modal */}
      <ImageViewerModal
        isOpen={imageModalOpen}
        imageUrl={selectedImage.url}
        alt={selectedImage.alt}
        onClose={() => setImageModalOpen(false)}
      />
    </>
  );
};

export default TextMessageComponent;