import { useState, useRef } from "react";
import { UploadedFile, DropzoneState } from "@/types";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Check, Upload, X } from "lucide-react";

interface UploadStepProps {
  resume: UploadedFile | null;
  onUpload: (resume: UploadedFile) => void;
  onRemove: () => void;
  onContinue: () => void;
}

export function UploadStep({ resume, onUpload, onRemove }: UploadStepProps) {
  const [dragState, setDragState] = useState<DropzoneState>({
    dragActive: false,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleBrowseFiles = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragState({ dragActive: true });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!dragState.dragActive) {
      setDragState({ dragActive: true });
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragState({ dragActive: false });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragState({ dragActive: false });

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    // Check file type
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'text/plain'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, DOCX, DOC, or TXT file",
        variant: "destructive",
      });
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "File size should be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await fetch("/api/resume/upload", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload resume');
      }
      
      const data = await response.json();
      onUpload(data.resume);
      
      toast({
        title: "Success",
        description: "Resume uploaded successfully",
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-3">Upload your resume</h2>
      <p className="text-gray-600 mb-4">
        We'll analyze your resume to personalize cover letters for each job listing.
      </p>

      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer hover:bg-indigo-50 ${
          dragState.dragActive ? "border-indigo-500 bg-indigo-50" : "border-gray-300"
        }`}
        onClick={handleBrowseFiles}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="space-y-3">
          <div className="mx-auto flex justify-center">
            <Upload className="h-12 w-12 text-indigo-500" />
          </div>
          <p className="text-gray-700">
            <span className="font-medium">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">PDF, DOCX, DOC, or TXT (max. 5MB)</p>
        </div>
        <input
          type="file"
          id="fileInput"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileSelect}
          accept=".pdf,.docx,.doc,.txt"
        />
      </div>

      {resume && (
        <div className="mt-4 bg-green-50 rounded-md p-4 flex items-center">
          <div className="flex-shrink-0">
            <Check className="text-green-500 h-5 w-5" />
          </div>
          <div className="ml-3 flex-grow">
            <p className="text-sm font-medium text-green-800">{resume.originalname}</p>
            <p className="mt-1 text-xs text-green-700">Ready to generate cover letters</p>
          </div>
          <button
            className="text-green-500 hover:text-green-700 rounded-md p-1"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            <span className="sr-only">Remove</span>
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
