import React, { useState, useRef } from 'react';
import { UploadIcon } from 'lucide-react';
import { Resume } from '../models/Resume';

interface ResumeUploadProps {
  onUploadSuccess: (resume: Resume) => void;
  isUploading?: boolean;
}

export default function ResumeUpload({ onUploadSuccess, isUploading = false }: ResumeUploadProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
        handleFileUpload(droppedFile);
      } else {
        alert('Please upload a PDF file');
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        handleFileUpload(selectedFile);
      } else {
        alert('Please upload a PDF file');
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await fetch('/api/resume/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Resume upload failed');
      }

      const data = await response.json();
      onUploadSuccess(data.resume);
    } catch (error) {
      console.error('Error uploading resume:', error);
      setFile(null);
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-4">Upload Your Resume</h2>
      
      <div className="mb-3">
        <label className="block text-sm font-medium mb-2">Resume (PDF)</label>
        
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleButtonClick}
        >
          <div className="flex flex-col items-center justify-center py-6">
            <UploadIcon className="h-12 w-12 mb-3 text-gray-400" />
            <p className="mb-2">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">PDF (MAX. 10MB)</p>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleFileInputChange}
          />
        </div>
      </div>

      <button
        className={`w-full py-2.5 px-4 rounded-lg font-medium text-white 
          ${isUploading || !file 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800'}`}
        disabled={isUploading || !file}
      >
        {isUploading ? 'Uploading...' : 'Find Matching Jobs'}
      </button>
    </div>
  );
}