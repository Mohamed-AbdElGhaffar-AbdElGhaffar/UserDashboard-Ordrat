import React from 'react';
import Image from 'next/image';
import { VideoMessage as VideoMessageType } from '../types/chat';
import { CheckmarkIcon } from '../icons/icons';

interface VideoMessageProps {
  message: VideoMessageType;
}

const VideoMessageComponent: React.FC<VideoMessageProps> = ({ message }) => {
  const isMe = message.sender === 'me';
  
  return (
    <div className="max-w-md rounded-lg shadow-sm overflow-hidden">
      <div className="relative">
        <Image 
          src={message.thumbnail} 
          alt="Video thumbnail" 
          width={400} 
          height={225}
          className="w-full h-auto object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <button className="w-12 h-12 rounded-full bg-black bg-opacity-50 flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>
        <div className="absolute bottom-2 right-2 flex items-center">
          <span className="text-xs text-white bg-black bg-opacity-50 px-2 py-0.5 rounded">
            {message.time}
          </span>
          {message.read && isMe && (
            <span className="ms-1 text-white">
              <CheckmarkIcon />
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoMessageComponent;