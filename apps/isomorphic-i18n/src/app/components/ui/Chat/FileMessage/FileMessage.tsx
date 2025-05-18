import React from 'react';
import { FileMessage as FileMessageType } from '../types/chat';
import { FileIcon, CheckmarkIcon, DownloadIcon } from '../icons/icons';

interface FileMessageProps {
  message: FileMessageType;
}

const FileMessageComponent: React.FC<FileMessageProps> = ({ message }) => {
  // Function to handle file download
  const handleDownload = () => {
    // Check if the file has a URL (for files received from others)
    if (message.fileUrl) {
      // Create an anchor element and trigger download
      const link = document.createElement('a');
      link.href = message.fileUrl;
      link.download = message.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (message.fileBlob) {
      // For files that have a Blob (for files we sent)
      const url = URL.createObjectURL(message.fileBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = message.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // Clean up the Blob URL
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } else {
      // If no file URL or Blob is available
      console.error('No file data available for download');
      // Optional: Show a notification to the user
      alert('This file is not available for download');
    }
  };

  return (
    <div className="max-w-md bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center">
        <div className="me-3 text-indigo-600">
          <FileIcon />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{message.filename}</h3>
          <p className="text-xs text-gray-500">{message.filesize} • {message.filetype}</p>
        </div>
        {/* Add download button */}
        <button 
          onClick={handleDownload}
          className="ms-2 text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-50"
          title="Download file"
        >
          <DownloadIcon />
        </button>
      </div>
      <div className="flex justify-end items-center mt-2">
        <span className="text-xs text-gray-500">{message.time}</span>
        {message.read && (
          <span className="ms-1 text-gray-400">
            <CheckmarkIcon />
          </span>
        )}
      </div>
    </div>
  );
};

export default FileMessageComponent;