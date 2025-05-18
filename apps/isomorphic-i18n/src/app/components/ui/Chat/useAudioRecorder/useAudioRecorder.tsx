'use client';
import { useState, useRef, useEffect } from 'react';

// Format seconds to MM:SS
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

interface UseAudioRecorderProps {
  onRecordingComplete: (duration: string, audioUrl: string) => void;
}

interface UseAudioRecorderReturn {
  isRecording: boolean;
  recordingTime: number;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
}

export const useAudioRecorder = ({ onRecordingComplete }: UseAudioRecorderProps): UseAudioRecorderReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const recordingTimeRef = useRef(0);
  
  const startRecording = async () => {
    try {
      console.log("Starting voice recording...");
      
      // Reset counters
      recordingTimeRef.current = 0;
      setRecordingTime(0);
      
      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Reset audio chunks
      audioChunksRef.current = [];
      
      // Create media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      // Set up data event handler
      mediaRecorder.ondataavailable = (event) => {
        console.log("Data available from recorder", event.data.size);
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      // Set up stop event handler
      mediaRecorder.onstop = () => {
        console.log("Recording stopped, chunks:", audioChunksRef.current.length);
        
        // Create audio blob
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Get the final time from the ref
        const finalTime = recordingTimeRef.current;
        console.log(`Final recording time: ${finalTime}s (${formatTime(finalTime)})`);
        
        // Call the callback with recording data
        onRecordingComplete(formatTime(finalTime), audioUrl);
        
        // Close the stream tracks
        stream.getTracks().forEach(track => track.stop());
        
        // Reset recording state
        setIsRecording(false);
        
        // Clear timer
        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current);
          recordingTimerRef.current = null;
        }
      };
      
      // Start recording - let's request data more frequently to ensure we catch everything
      mediaRecorder.start(500);
      console.log("MediaRecorder started", mediaRecorder.state);
      
      // Set recording state
      setIsRecording(true);
      
      // Clear any existing timer
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      
      // Start a new timer using both ref and state
      recordingTimerRef.current = setInterval(() => {
        // Increment the ref counter
        recordingTimeRef.current += 1;
        const newTime = recordingTimeRef.current;
        console.log(`Timer tick: ${newTime}s`);
        
        // Update the state for React rendering
        setRecordingTime(newTime);
        
        // Directly update DOM for more reliability
        const timerDisplay = document.getElementById('recording-timer');
        if (timerDisplay) {
          timerDisplay.textContent = formatTime(newTime);
        }
      }, 1000);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please check your browser permissions.');
    }
  };
  
  const stopRecording = () => {
    console.log("Stopping recording...");
    
    // Capture final recording time before stopping
    const finalTime = recordingTimeRef.current;
    console.log(`Final time at stop: ${finalTime}s`);
    
    // Stop the MediaRecorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      console.log("MediaRecorder state before stop:", mediaRecorderRef.current.state);
      mediaRecorderRef.current.stop();
      console.log("MediaRecorder stopped");
    } else {
      console.warn("MediaRecorder is not in recording state:", 
                  mediaRecorderRef.current ? mediaRecorderRef.current.state : "no recorder");
    }
    
    // Always clean up the timer
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
      console.log("Timer cleared");
    }
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [isRecording]);
  
  return {
    isRecording,
    recordingTime,
    startRecording,
    stopRecording
  };
};
