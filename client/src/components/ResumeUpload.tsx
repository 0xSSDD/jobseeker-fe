import React, { useState, useRef } from 'react';
import { Upload, FileText, Info } from 'lucide-react';

interface ResumeUploadProps {
  onUploadSuccess: (resume: any) => void;
  isUploading?: boolean;
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({
  onUploadSuccess,
  isUploading = false
}) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };
  
  const handleFile = async (file: File) => {
    // In a real implementation, this would upload the file to a server
    // and get back parsed resume data
    
    // Simulate a server response with a timeout
    setTimeout(() => {
      const mockResumeData = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '(555) 123-4567',
        skills: ['JavaScript', 'React', 'Node.js', 'TypeScript'],
        experiences: [
          {
            title: 'Frontend Developer',
            company: 'Tech Company',
            startDate: '2020-01',
            endDate: '2022-12',
            description: 'Developed and maintained web applications using React and TypeScript.'
          }
        ],
        education: [
          {
            institution: 'University of Technology',
            degree: 'Bachelor of Science',
            field: 'Computer Science',
            startDate: '2015-09',
            endDate: '2019-06'
          }
        ],
        summary: 'Experienced web developer with a focus on frontend technologies.',
        latestRole: {
          title: 'Frontend Developer',
          company: 'Tech Company',
          startDate: '2020-01',
          endDate: '2022-12',
          description: 'Developed and maintained web applications using React and TypeScript.'
        }
      };
      
      onUploadSuccess(mockResumeData);
    }, 1500);
  };
  
  const onButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };
  
  return (
    <div className="mb-8">
      <div 
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center 
          ${dragActive ? 'border-primary bg-primary/5' : 'border-gray-700 hover:border-primary/70'} 
          transition-colors
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleChange}
          className="hidden"
        />
        
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-white">Upload Your Resume</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              Drag and drop your resume file or click to browse. We support PDF, DOC, DOCX, and TXT formats.
            </p>
          </div>
          
          <button
            onClick={onButtonClick}
            disabled={isUploading}
            className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-md flex items-center space-x-2 transition-colors"
          >
            {isUploading ? (
              <>
                <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                <span>Select Resume</span>
              </>
            )}
          </button>
          
          <div className="flex items-center text-gray-400 text-sm">
            <Info className="w-4 h-4 mr-1" />
            <span>Your resume will be analyzed by our AI to find the best job matches</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;