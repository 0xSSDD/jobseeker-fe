import React, { useState, useRef } from 'react';
import { Upload, FileText, Search } from 'lucide-react';

enum ProcessState {
  INITIAL = 'initial',         // Initial state, show "Upload CV"
  UPLOADING = 'uploading',     // File is being uploaded to Supabase
  UPLOADED = 'uploaded',       // File uploaded, ready to process, show "Process CV"
  PROCESSING = 'processing',   // CV is being processed by AI
  PROCESSED = 'processed'      // CV processed, show "Find Matching Jobs"
}

interface ResumeUploadProps {
  onUploadSuccess: (resume: any) => void;
  isUploading?: boolean;
  hasResume?: boolean;
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({
  onUploadSuccess,
}) => {
  const [processState, setProcessState] = useState<ProcessState>(ProcessState.INITIAL);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFileId, setUploadedFileId] = useState<string | null>(null);
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
    setProcessState(ProcessState.UPLOADING);

    // Check file type
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'text/plain'];
    if (!validTypes.includes(file.type)) {
      setError("Invalid file type. Please upload a PDF, DOCX, DOC, or TXT file");
      setProcessState(ProcessState.INITIAL);
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File too large. File size should be less than 5MB");
      setProcessState(ProcessState.INITIAL);
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      console.log("Uploading file:", file.name);

      // Step 1: Upload to Supabase
      const response = await fetch("/api/resume/upload-only", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Resume upload successful:", data);

      // Store the ID of the uploaded file for processing
      setUploadedFileId(data.fileId);
      setProcessState(ProcessState.UPLOADED);

    } catch (error) {
      console.error("Error uploading resume:", error);
      setError("Failed to upload resume. Please try again.");
      setProcessState(ProcessState.INITIAL);
    }
  };

  const processResume = async () => {
    if (!uploadedFileId) {
      setError("No uploaded file to process");
      return;
    }

    setProcessState(ProcessState.PROCESSING);

    try {
      // Step 2: Process the uploaded CV
      const response = await fetch("/api/resume/process", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fileId: uploadedFileId })
      });

      if (!response.ok) {
        throw new Error(`Processing failed: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Resume processing successful:", data);

      // Now call the success handler with the processed data
      onUploadSuccess(data.resume);
      setProcessState(ProcessState.PROCESSED);

    } catch (error) {
      console.error("Error processing resume:", error);
      setError("Failed to process resume. Please try again.");
      setProcessState(ProcessState.UPLOADED); // Go back to uploaded state
    }
  };

  const onButtonClick = () => {
    switch (processState) {
      case ProcessState.INITIAL:
        // Open file dialog
        if (inputRef.current) {
          inputRef.current.click();
        }
        break;
      case ProcessState.UPLOADED:
        // Process the uploaded resume
        processResume();
        break;
      case ProcessState.PROCESSED:
        // This would trigger job search
        // For now we'll just leave it as a button
        break;
      default:
        // Do nothing during uploading/processing states
        break;
    }
  };

  // Get button text based on state
  const getButtonText = () => {
    switch (processState) {
      case ProcessState.UPLOADING:
        return "Uploading...";
      case ProcessState.UPLOADED:
        return "Process CV";
      case ProcessState.PROCESSING:
        return "Processing...";
      case ProcessState.PROCESSED:
        return "Find Matching Jobs";
      default:
        return "Upload CV";
    }
  };

  // Get button icon based on state
  const getButtonIcon = () => {
    switch (processState) {
      case ProcessState.UPLOADED:
        return <FileText className="h-4 w-4 mr-2" />;
      case ProcessState.PROCESSED:
        return <Search className="h-4 w-4 mr-2" />;
      default:
        return <Upload className="h-4 w-4 mr-2" />;
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

      {/* Upload area - only show in initial or uploading states */}
      {(processState === ProcessState.INITIAL || processState === ProcessState.UPLOADING) && (
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
          onClick={processState === ProcessState.INITIAL ? onButtonClick : undefined}
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
      )}

      {/* Status messages */}
      {processState === ProcessState.UPLOADED && (
        <div className="mb-4 p-4 bg-green-50 rounded-md">
          <h4 className="font-medium text-green-800">Resume Ready</h4>
          <p className="text-sm text-green-700">Your resume has been uploaded and is ready to be processed.</p>
        </div>
      )}

      {processState === ProcessState.PROCESSED && (
        <div className="mb-4 p-4 bg-green-50 rounded-md">
          <h4 className="font-medium text-green-800">Resume Ready</h4>
          <p className="text-sm text-green-700">Your resume has been processed and is ready to find matching jobs.</p>
        </div>
      )}

      <button
        onClick={onButtonClick}
        disabled={processState === ProcessState.UPLOADING || processState === ProcessState.PROCESSING}
        className="w-full mt-4 py-3 flex justify-center items-center bg-secondary hover:bg-secondary/90 text-center rounded-md transition-colors text-sm font-medium"
      >
        {getButtonIcon()}
        {getButtonText()}
      </button>
    </div>
  );
};

export default ResumeUpload;