import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiFile, FiX, FiLoader } from 'react-icons/fi';
import { Resume } from '@/models/Resume';
import { uploadResumeFile } from '@/lib/supabase';
import resumeParser from '@/services/resumeParser';

interface UploadComponentProps {
  onUploadSuccess: (resume: Resume) => void;
}

export function UploadComponent({ onUploadSuccess }: UploadComponentProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      handleFile(file);
    }
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    multiple: false
  });
  
  const handleFile = async (file: File) => {
    try {
      setIsUploading(true);
      setUploadError(null);
      
      // 1. Upload file to Supabase storage
      const { filePath } = await uploadResumeFile(file);
      
      // 2. Convert file to buffer for parsing
      const buffer = await file.arrayBuffer().then(ab => Buffer.from(ab));
      
      // 3. Parse resume using ResumeParser service
      const resumeData = await resumeParser.parseResume(buffer);
      
      // 4. Add file path to resume data
      const completeResume: Resume = {
        ...resumeData,
        file_path: filePath
      };
      
      // 5. Call the success callback
      onUploadSuccess(completeResume);
      
    } catch (error) {
      console.error('Resume upload error:', error);
      setUploadError(error instanceof Error ? error.message : 'Failed to upload resume');
    } finally {
      setIsUploading(false);
    }
  };
  
  const removeFile = () => {
    setUploadedFile(null);
    setUploadError(null);
  };
  
  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Upload Your Resume</h2>
        <p className="text-gray-600">
          Upload your resume to find matching job opportunities tailored to your skills and experience.
        </p>
      </div>
      
      {!uploadedFile ? (
        <div 
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'}
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center">
            <FiUpload className="text-4xl text-primary mb-4" />
            <p className="text-lg font-medium">
              {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume here'}
            </p>
            <p className="text-gray-500 mt-2">or click to browse files</p>
            <p className="text-xs text-gray-400 mt-4">
              Accepted file types: PDF, DOC, DOCX
            </p>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-primary/10 p-3 rounded-full">
                <FiFile className="text-xl text-primary" />
              </div>
              <div className="ml-4">
                <p className="font-medium">{uploadedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            
            <button
              onClick={removeFile}
              className="text-gray-500 hover:text-red-500 transition-colors"
              disabled={isUploading}
            >
              <FiX className="text-xl" />
            </button>
          </div>
          
          {isUploading && (
            <div className="mt-4 flex items-center text-primary">
              <FiLoader className="animate-spin mr-2" />
              <span>Processing resume...</span>
            </div>
          )}
          
          {uploadError && (
            <div className="mt-4 text-red-500 text-sm">
              {uploadError}
            </div>
          )}
        </div>
      )}
      
      <div className="mt-6 text-sm text-gray-500">
        <p>
          Your resume will be analyzed to identify your skills, experience, 
          and qualifications to match you with relevant job opportunities.
        </p>
      </div>
    </div>
  );
}