'use client';

import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import user from '@public/assets/user.png';
import test1 from '@public/promo-card-bg.jpg';
import test2 from '@public/newsletter-7.jpg';

// Import types
import {
  DateGroup,
  Message,
  TextMessage,
  AudioMessage,
  Contact,
  ChatTranslations,
  FileMessage
} from './types/chat';

// Import components
import TextMessageComponent from './TextMessage/TextMessage';
import FileMessageComponent from './FileMessage/FileMessage';
import AudioMessageComponent from './AudioMessage/AudioMessage';
import VideoMessageComponent from './VideoMessage/VideoMessage';
import FileUploadMenu from './FileUploadMenu/FileUploadMenu';
// Import icons
import {
  CheckmarkIcon,
  CallIcon,
  PenIcon,
  SearchIcon,
  MoreIcon,
  EmojiIcon,
  MicrophoneIcon,
  StopRecordingIcon,
  PaperclipIcon,
  SendIcon
} from './icons/icons';
import { formatTime, useAudioRecorder } from './useAudioRecorder/useAudioRecorder';

// Import custom hooks
// import { useAudioRecorder, formatTime } from '../hooks/useAudioRecorder';

type ChatProps = {
  lang: string;
};

export default function Chat({ lang }: ChatProps) {
  const isRTL = lang === 'ar';
  const text: ChatTranslations = {
    message: isRTL ? 'رسالة' : 'Message',
    messages: isRTL ? 'الرسائل' : 'Messages',
    viewProfile: isRTL ? 'الملف الشخصي' : 'View Profile',
    addNewChat: isRTL ? 'إضافة دردشة جديدة' : 'Add New Chat',
    search: isRTL ? 'بحث' : 'Search...',
    noContacts: isRTL ? 'لم يتم العثور على جهات اتصال مطابقة ل' : 'No contacts found matching',
    send: isRTL ? 'إرسال' : 'Send a message...',
    online: isRTL ? 'متصل' : 'Online',
    sent: isRTL ? 'تم الإرسال' : 'Sent',
    today: isRTL ? 'اليوم' : 'Today',
    recording: isRTL ? 'تسجيل...' : 'Recording...',
  };

  // Mock data for the chat contacts
  const chatContacts: Contact[] = [
    {
      id: 'xae',
      name: 'X-AE-A-13b',
      lastMessage: 'Enter your message description here...',
      avatar: user.src,
      time: '12:25',
      online: true,
    },
    {
      id: 'jerome',
      name: 'Jerome White',
      lastMessage: 'Enter your message description here...',
      avatar: user.src,
      time: '12:25',
      online: true,
    },
    {
      id: 'madagascar',
      name: 'Madagascar Silver',
      lastMessage: 'Enter your message description here...',
      avatar: user.src,
      time: '12:25',
      online: false,
      unreadCount: 999,
    },
    {
      id: 'pippins',
      name: 'Pippins McGray',
      lastMessage: 'Enter your message description here...',
      avatar: user.src,
      time: '12:25',
      online: true,
    },
    {
      id: 'mckinsey',
      name: 'McKinsey Vermillion',
      lastMessage: 'Enter your message description here...',
      avatar: user.src,
      time: '12:25',
      online: true,
      unreadCount: 8,
    },
    {
      id: 'dorian',
      name: 'Dorian F. Gray',
      lastMessage: 'Enter your message description here...',
      avatar: user.src,
      time: '12:25',
      online: false,
      unreadCount: 2,
    },
    {
      id: 'benedict',
      name: 'Benedict Combersmacks',
      lastMessage: 'Enter your message description here...',
      avatar: user.src,
      time: '12:25',
      online: false,
    },
    {
      id: 'kaori',
      name: 'Kaori D. Miyazono',
      lastMessage: 'Enter your message description here...',
      avatar: user.src,
      time: '12:25',
      online: false,
    },
    {
      id: 'saylor',
      name: 'Saylor Twift',
      lastMessage: 'Enter your message description here...',
      avatar: user.src,
      time: '12:25',
      online: true,
    },
    {
      id: 'miranda',
      name: 'Miranda Blue',
      lastMessage: 'Enter your message description here...',
      avatar: user.src,
      time: '12:25',
      online: false,
    },
    {
      id: 'esmeralda',
      name: 'Esmeralda Gray',
      lastMessage: 'Enter your message description here...',
      avatar: user.src,
      time: '12:25',
      online: false,
    },
    {
      id: 'qarack',
      name: 'Qarack Babama',
      lastMessage: 'Enter your message description here...',
      avatar: user.src,
      time: '12:25',
      online: true,
      unreadCount: 7,
    },
  ];

  // State
  const [activeChat, setActiveChat] = useState('azunyan');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [audioPlayingId, setAudioPlayingId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [fileUploadMenuOpen, setFileUploadMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const filteredContacts = chatContacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  // Audio elements for playback
  const audioElements = useRef<{[key: number]: HTMLAudioElement}>({});
  
  // Initial chat messages
  const [chatMessages, setChatMessages] = useState<DateGroup[]>([
    {
      id: 1,
      date: '19 August',
      messages: [
        {
          id: 101,
          sender: 'other',
          text: 'Hello my dear sir, I\'m here do deliver the design requirement document for our next projects.',
          time: '10:25',
          read: true,
        },
        {
          id: 102,
          sender: 'other',
          type: 'file',
          filename: 'Design_project_2025.docx',
          filesize: '2.5gb',
          filetype: 'docx',
          time: '10:26',
          read: true,
        },
        {
          id: 103,
          sender: 'me',
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco labori',
          time: '11:25',
          read: true,
        }
      ]
    },
    {
      id: 2,
      date: 'Today',
      messages: [
        {
          id: 201,
          sender: 'other',
          text: 'Do androids truly dream of electric sheeps?',
          time: '12:25',
          read: true,
        },
        {
          id: 202,
          sender: 'me',
          type: 'audio',
          duration: '02:12',
          endTime: '01:25',
          time: '12:35',
          read: true,
        },
        // {
        //   id: 203,
        //   sender: 'other',
        //   type: 'video',
        //   thumbnail: user.src,
        //   time: '02:25',
        //   read: true,
        // },
        {
          id: 206,
          sender: 'other',
          text: `<img src="${test1.src}" alt="user image" style="max-width: 100%; border-radius: 8px;" />`,
          time: '02:37 PM',
          read: true
        },
        {
          id: 207,
          sender: 'other',
          text: `What do you think of the picture?`,
          time: '02:37 PM',
          read: true
        },
        {
          id: 208,
          sender: 'me',
          text: `<img src="${test2.src}" alt="user image" style="max-width: 100%; border-radius: 8px;" />`,
          time: '02:37 PM',
          read: true
        },
        {
          id: 209,
          sender: 'me',
          text: `this is peter😜`,
          time: '02:37 PM',
          read: true
        },
      ]
    }
  ]);
  console.log('chatMessages: ',chatMessages);
  
  
  // Function to toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Function to format current time
  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  // Function to get next message ID
  const getNextMessageId = () => {
    let maxId = 0;
    chatMessages.forEach(group => {
      group.messages.forEach((message:any) => {
        if (message.id > maxId) {
          maxId = message.id;
        }
      });
    });
    return maxId + 1;
  };

  // Handle audio recording completion
  const handleRecordingComplete = (duration: string, audioUrl: string) => {
    console.log(`Recording completed: ${duration}, URL: ${audioUrl}`);
    sendAudioMessage(duration, audioUrl);
  };

  // Use our custom audio recorder hook
  const { 
    isRecording, 
    recordingTime, 
    startRecording, 
    stopRecording 
  } = useAudioRecorder({
    onRecordingComplete: handleRecordingComplete
  });

  // Send text message function
  const sendMessage = () => {
    if (!messageInput.trim()) return;

    const newMessage: TextMessage = {
      id: getNextMessageId(),
      sender: 'me',
      text: messageInput,
      time: getCurrentTime(),
      read: true
    };

    addMessageToChat(newMessage);
    setMessageInput('');
  };
  
  // Send audio message function
  const sendAudioMessage = (duration: string, audioUrl?: string) => {
    console.log(`Sending audio message with duration: ${duration}`);
    
    const messageId = getNextMessageId();
    
    const newMessage: AudioMessage = {
      id: messageId,
      sender: 'me',
      type: 'audio',
      duration: duration,
      endTime: '00:00',
      time: getCurrentTime(),
      read: true,
      audioUrl: audioUrl
    };
  
    addMessageToChat(newMessage);
    return messageId;
  };
  
  // Helper function to add message to chat
  const addMessageToChat = (newMessage: Message) => {
    const todayIndex = chatMessages.findIndex(group => group.date === 'Today');
    
    if (todayIndex !== -1) {
      // Add to existing Today group
      const updatedMessages = [...chatMessages];
      updatedMessages[todayIndex] = {
        ...updatedMessages[todayIndex],
        messages: [...updatedMessages[todayIndex].messages, newMessage]
      };
      setChatMessages(updatedMessages);
    } else {
      // Create a new Today group
      const newGroup: DateGroup = {
        id: chatMessages.length + 1,
        date: 'Today',
        messages: [newMessage]
      };
      setChatMessages([...chatMessages, newGroup]);
    }
    
    // Scroll to bottom
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  
  // Play/pause audio
  const toggleAudioPlayback = (messageId: number) => {
    // Find the message
    let audioMessage: AudioMessage | undefined;
    
    for (const group of chatMessages) {
      const message = group.messages.find((m:any) => m.id === messageId);
      if (message && message.type === 'audio') {
        audioMessage = message as AudioMessage;
        break;
      }
    }
    
    if (!audioMessage || !audioMessage.audioUrl) {
      console.log("No audio URL found for message", messageId);
      
      // For demo purposes, toggle even without a real audio element
      if (audioPlayingId === messageId) {
        setAudioPlayingId(null);
      } else {
        setAudioPlayingId(messageId);
        
        // Simulate audio ending after 5 seconds
        setTimeout(() => {
          if (audioPlayingId === messageId) {
            setAudioPlayingId(null);
          }
        }, 5000);
      }
      
      return;
    }
    
    // Get or create audio element
    if (!audioElements.current[messageId]) {
      const audio = new Audio(audioMessage.audioUrl);
      audio.addEventListener('ended', () => {
        setAudioPlayingId(null);
      });
      audioElements.current[messageId] = audio;
    }
    
    const audioElement = audioElements.current[messageId];
    
    if (audioPlayingId === messageId) {
      // Pause current
      audioElement.pause();
      setAudioPlayingId(null);
    } else {
      // Pause any currently playing audio
      if (audioPlayingId && audioElements.current[audioPlayingId]) {
        audioElements.current[audioPlayingId].pause();
      }
      
      // Play the selected audio
      audioElement.play().catch(error => {
        console.error("Error playing audio:", error);
      });
      setAudioPlayingId(messageId);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  // Clean up on unmount
  useEffect(() => {
    const elements = audioElements.current;
    return () => {
      // Clear all audio elements
      Object.values(elements).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
      
      // Clean up object URLs
      chatMessages.forEach(group => {
        group.messages.forEach((message:any) => {
          if (message.type === 'audio' && (message as AudioMessage).audioUrl) {
            URL.revokeObjectURL((message as AudioMessage).audioUrl!);
          }
          // Add cleanup for file URLs as well
          if (message.type === 'file' && (message as FileMessage).fileUrl) {
            URL.revokeObjectURL((message as FileMessage).fileUrl!);
          }
        });
      });
    };
  }, [chatMessages]);

  const handleFileUpload = (file: File) => {
    console.log("File selected:", file.name, file.size);
    
    // Create a blob URL for the file
    const fileUrl = URL.createObjectURL(file);
    
    // Get file size in readable format
    const fileSize = formatFileSize(file.size);
    
    // Get file extension
    const fileExtension = file.name.split('.').pop() || 'unknown';
    
    // Create a new file message with explicit type casting
    const newMessage: FileMessage = {
      id: getNextMessageId(),
      sender: 'me', // Use the literal 'me' instead of a generic string
      type: 'file' as const, // Use a const assertion to specify the exact literal type
      filename: file.name,
      filesize: fileSize,
      filetype: fileExtension,
      time: getCurrentTime(),
      read: true,
      fileUrl: fileUrl, // Store the URL for download
      fileBlob: file // Store the actual file blob
    };
    
    // Add the message to chat
    addMessageToChat(newMessage);
  };
  
  // Update the handleImageUpload function similarly:
  const handleImageUpload = (file: File) => {
    console.log("Image selected:", file.name, file.size);
    
    // For images, we'll create an image URL
    const imageUrl = URL.createObjectURL(file);
    
    // Get file size in readable format
    const fileSize = formatFileSize(file.size);
    
    // Since we don't have a dedicated image message type,
    // we'll use a regular text message with the image URL
    const newMessage: TextMessage = {
      id: getNextMessageId(),
      sender: 'me' as const, // Use const assertion here too
      text: `<img src="${imageUrl}" alt="${file.name}" style="max-width: 100%; border-radius: 8px;" />`,
      time: getCurrentTime(),
      read: true
    };
    
    // Add the message to chat
    addMessageToChat(newMessage);
  };
  
  const renderMessage = (message: Message) => {
    if (message.type === 'file') {
      return <FileMessageComponent message={message} />;
    } else if (message.type === 'audio') {
      return (
        <AudioMessageComponent 
          message={message as AudioMessage} 
          isPlaying={audioPlayingId === message.id}
          onPlayToggle={toggleAudioPlayback}
        />
      );
    } else if (message.type === 'video') {
      return <VideoMessageComponent message={message} />;
    } else {
      // Use the enhanced TextMessageComponent which now handles images
      return <TextMessageComponent message={message as TextMessage} />;
    }
  };
  // Helper function to format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  

  return (
    <div className={`flex h-[calc(100vh-68px)] sm:h-[calc(100vh-72px)] bg-gray-50 relative`}>
      {/* Sidebar with contacts */}
      <div 
        className={`w-full max-w-xs border-e border-gray-200 bg-white md:relative md:block
                    fixed bottom-0 left-0 h-[calc(100vh-68px)] sm:h-[calc(100vh-72px)] z-20
                    transition-transform duration-300 ease-in-out
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-800">{text.messages}</h1>
            <span className="ms-2 text-xs bg-gray-100 text-gray-500 rounded-full px-2 py-0.5">29</span>
          </div>
          <button className="text-indigo-600 p-2 rounded-full hover:bg-indigo-50">
            <PenIcon />
          </button>
        </div>
        
        <div className="px-4 py-2">
          <div className="relative">
            <input
              type="text"
              placeholder={text.search}
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <SearchIcon />
            </div>
          </div>
        </div>
        
        <div className="overflow-y-auto h-[calc(100vh-160px-115px)] sm:h-[calc(100vh-160px-119px)]">
          {filteredContacts.length > 0 ? (
            filteredContacts.map((contact: Contact) => (
              <div 
                key={contact.id}
                className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 border-s-4 ${
                  contact.id === activeChat ? 'border-indigo-500' : 'border-transparent'
                }`}
                onClick={() => {
                  setActiveChat(contact.id);
                  if (window.innerWidth < 768) {
                    setSidebarOpen(false);
                  }
                }}
              >
                <div className="relative">
                  <Image 
                    src={contact.avatar} 
                    alt={contact.name} 
                    width={40} 
                    height={40} 
                    className="rounded-full object-cover w-10 h-10"
                  />
                  {contact.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="ms-3 flex-1 overflow-hidden">
                  <div className="flex justify-between items-baseline">
                    <h2 className="font-medium text-base text-gray-900 truncate">{contact.name}</h2>
                    <span className="text-xs text-gray-500">{contact.time}</span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{contact.lastMessage}</p>
                </div>
                {contact.unreadCount && (
                  <div className={`ms-2 ${
                    contact.unreadCount > 99 ? 'bg-rose-500' : 'bg-indigo-500'
                  } text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium`}>
                    {contact.unreadCount > 99 ? '99+' : contact.unreadCount}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              {text.noContacts} &quot;{searchQuery}&quot;
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-200">
          <button className="w-full py-2.5 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 flex items-center justify-center gap-2">
            <span>{text.addNewChat}</span>
            <span className="font-bold">+</span>
          </button>
        </div>
      </div>
      
      {/* Overlay for mobile when sidebar is open */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden transition-opacity duration-300 ease-in-out ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>
      
      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {/* Chat header */}
        <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="relative">
              <Image 
                src={user.src} 
                alt="Azunyan U. Wu" 
                width={40} 
                height={40} 
                className="rounded-full object-cover w-10 h-10"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="ms-3">
              <h2 className="font-medium text-xl text-gray-900">Azunyan U. Wu</h2>
              <div className="flex items-center text-xs text-green-600">
                <span className="me-1 h-1.5 w-1.5 rounded-full bg-green-500"></span>
                <span>{text.online}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            {/* <button className="text-gray-500 hover:text-gray-700 p-2">
              <CallIcon />
            </button> */}
            <Link href={`/${lang}/delivery`} className="ms-2 py-1.5 px-4 bg-indigo-600 text-white rounded-full text-sm font-medium hover:bg-indigo-700">
              {text.viewProfile}
            </Link>
            {/* This is the More button that now toggles the sidebar on mobile */}
            <button 
              className="ms-2 text-gray-500 hover:text-gray-700 p-2"
              onClick={toggleSidebar}
            >
              <MoreIcon />
            </button>
          </div>
        </div>
        
        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50">
          {chatMessages.map((dateGroup) => (
            <div key={dateGroup.id} className="space-y-4">
              <div className="text-center">
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                  {dateGroup.date}
                </span>
              </div>
              
              {dateGroup.messages.map((message: any) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.sender === 'me' ? '' : 'justify-end'}`}
                >
                  {renderMessage(message)}
                </div>
              ))}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat input */}
        <div className="bg-white border-t border-gray-200 p-4">
          {isRecording ? (
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
              <div className="flex-1 flex items-center">
                <span className="animate-pulse mr-2 text-red-600 text-xl">●</span>
                <span className="text-red-600 font-medium">{text.recording}</span>
                <span id="recording-timer" className="ml-2 text-lg font-bold text-red-600">
                  {formatTime(recordingTime)}
                </span>
              </div>
              <button 
                className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                onClick={() => {
                  console.log("Stop recording button clicked");
                  stopRecording();
                }}
              >
                <StopRecordingIcon />
              </button>
            </div>
          ) : (
            <div className="relative flex items-center bg-gray-100 rounded-full px-4 py-1">
              {fileUploadMenuOpen && (
                <FileUploadMenu 
                  isOpen={fileUploadMenuOpen}
                  onClose={() => setFileUploadMenuOpen(false)}
                  onFileUpload={handleFileUpload}
                  onImageUpload={handleImageUpload}
                  lang={lang}
                />
              )}
              <button 
                className="text-gray-500 me-2"
                onClick={() => setFileUploadMenuOpen(true)}
              >
                <PaperclipIcon />
              </button>
              <input 
                type="text" 
                placeholder={text.send}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 bg-transparent py-2 outline-none text-gray-800 border-0 shadow-none focus:shadow-none focus:ring-0 focus:ring-transparent"
              />
              <button className="text-gray-500 mx-2">
                <EmojiIcon />
              </button>
              <button 
                className="text-gray-500 me-2"
                onClick={() => {
                  console.log("Start recording button clicked");
                  startRecording().catch(err => console.error("Error starting recording:", err));
                }}
              >
                <MicrophoneIcon />
              </button>
              <button 
                className="bg-indigo-600 text-white rounded-full p-2 hover:bg-indigo-700 cursor-pointer"
                onClick={sendMessage}
                disabled={!messageInput.trim()}
              >
                <SendIcon />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}