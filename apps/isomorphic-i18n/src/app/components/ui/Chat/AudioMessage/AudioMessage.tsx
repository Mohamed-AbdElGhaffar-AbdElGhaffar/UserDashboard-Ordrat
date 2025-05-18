import React, { useEffect, useRef } from 'react';
import { AudioMessage as AudioMessageType } from '../types/chat';
import { CheckmarkIcon, PlayIcon, PauseIcon, WaveformIcon } from '../icons/icons';

interface AudioMessageProps {
  message: AudioMessageType;
  isPlaying: boolean;
  onPlayToggle: (id: number) => void;
}

const AudioMessageComponent: React.FC<AudioMessageProps> = ({ message, isPlaying, onPlayToggle }) => {
  const isMe = message.sender === 'me';
  const audioRef = useRef<HTMLAudioElement>(null);

  // Handle audio playback
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error("Error playing audio:", error);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  return (
    <div className={`max-w-md ${isMe ? 'bg-indigo-600 text-white' : 'bg-white text-gray-800'} rounded-lg shadow-sm p-4`}>
      <div className="flex items-center gap-2">
        <button 
          className={`${isMe ? 'text-white' : 'text-indigo-600'}`}
          onClick={() => onPlayToggle(message.id)}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
        <div className={`flex-1 ${isMe ? 'text-white' : 'text-indigo-600'}`}>
          <WaveformIcon />
        </div>
        <span className={`text-xs ${isMe ? 'text-indigo-200' : 'text-gray-500'}`}>
          {message.duration}
        </span>
      </div>
      <div className="flex justify-end items-center mt-2">
        <span className={`text-xs ${isMe ? 'text-indigo-200' : 'text-gray-500'}`}>
          {message.endTime}
        </span>
        {message.read && isMe && (
          <span className="ms-1 text-indigo-200">
            <CheckmarkIcon />
          </span>
        )}
      </div>
      
      {/* Hidden audio element for playback */}
      {message.audioUrl && (
        <audio 
          ref={audioRef}
          src={message.audioUrl}
          className="hidden"
          id={`audio-${message.id}`}
          onEnded={() => onPlayToggle(message.id)}
        />
      )}
    </div>
  );
};

export default AudioMessageComponent;