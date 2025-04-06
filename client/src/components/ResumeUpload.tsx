import React, { useState, useRef } from 'react';
import { Upload } from 'lucide-react';

interface ResumeUploadProps {
  onUploadSuccess: (resume: any) => void;
  isUploading?: boolean;
  hasResume?: boolean;
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({
  onUploadSuccess,
  isUploading = false,
  hasResume = false
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    // Reset error state
    setError(null);
    setUploading(true);

    // Check file type
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'text/plain'];
    if (!validTypes.includes(file.type)) {
      setError("Invalid file type. Please upload a PDF, DOCX, DOC, or TXT file");
      setUploading(false);
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File too large. File size should be less than 5MB");
      setUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      console.log("Uploading file:", file.name);

      const response = await fetch("/api/resume/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Resume upload successful:", data);

      // Pass the response data to the parent component
      onUploadSuccess(data.resume);
    } catch (error) {
      console.error("Error uploading resume:", error);
      setError("Failed to upload resume. Please try again.");
    } finally {
      setUploading(false);
    }
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

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

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
          accept=".pdf,.docx,.doc,.txt"
          onChange={handleChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center h-48 space-y-2">
          <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
          <p className="text-xs text-muted-foreground">PDF, DOCX, DOC, or TXT (MAX. 5MB)</p>
        </div>
      </div>

      <button
        onClick={onButtonClick}
        disabled={isUploading || uploading}
        className="w-full mt-4 py-3 bg-secondary hover:bg-secondary/90 text-center rounded-md transition-colors text-sm font-medium"
      >
        {isUploading || uploading
          ? "Processing..."
          : hasResume
            ? "Find Matching Jobs"
            : "Upload CV"
        }
      </button>
    </div>
  );
};

export default ResumeUpload;