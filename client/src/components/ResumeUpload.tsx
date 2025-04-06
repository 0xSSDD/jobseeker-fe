import React, { useState, useRef } from 'react';
import { Upload } from 'lucide-react';

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
    <div className="w-full max-w-2xl mx-auto bg-background rounded-lg">
      <h3 className="font-semibold text-xl mb-2">Upload Your Resume</h3>
      <div className="mb-2">
        <p className="text-sm text-muted-foreground">Resume (PDF)</p>
      </div>
      <div 
        className={`
          relative border-2 border-border rounded-md p-8 text-center
          ${dragActive ? 'border-primary bg-secondary/20' : 'bg-background hover:bg-secondary/10'} 
          transition-colors cursor-pointer
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          onChange={handleChange}
          className="hidden"
        />
        
        <div className="flex flex-col items-center justify-center h-48 space-y-2">
          <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
          <p className="text-xs text-muted-foreground">PDF (MAX. 10MB)</p>
        </div>
      </div>

      <button
        onClick={onButtonClick}
        disabled={isUploading}
        className="w-full mt-4 py-3 bg-secondary hover:bg-secondary/90 text-center rounded-md transition-colors text-sm font-medium"
      >
        {isUploading ? "Processing..." : "Find Matching Jobs"}
      </button>
    </div>
  );
};

export default ResumeUpload;