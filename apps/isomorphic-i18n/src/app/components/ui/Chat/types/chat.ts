export interface BaseMessage {
  id: number;
  sender: 'me' | 'other';
  time: string;
  read: boolean;
}

export interface TextMessage extends BaseMessage {
  type?: undefined;
  text: string;
}

export interface FileMessage extends BaseMessage {
  type: 'file';
  filename: string;
  filesize: string;
  filetype: string;
  fileUrl?: string;
  fileBlob?: File;
}

export interface AudioMessage extends BaseMessage {
  type: 'audio';
  duration: string;
  endTime: string;
  audioUrl?: string;
}

export interface VideoMessage extends BaseMessage {
  type: 'video';
  thumbnail: string;
}

export type Message = TextMessage | FileMessage | AudioMessage | VideoMessage;

export interface DateGroup {
  id: number;
  date: string;
  messages: Message[];
}

export interface Contact {
  id: string;
  name: string;
  lastMessage: string;
  avatar: string;
  time: string;
  online: boolean;
  unreadCount?: number;
}

export interface ChatTranslations {
  message: string;
  messages: string;
  viewProfile: string;
  addNewChat: string;
  search: string;
  noContacts: string;
  send: string;
  online: string;
  sent: string;
  today: string;
  recording: string;
}