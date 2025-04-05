import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UploadedFile, DropzoneState } from "@/types";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface UploadStepProps {
  resume: UploadedFile | null;
  onUpload: (resume: UploadedFile) => void;
  onRemove: () => void;
  onContinue: () => void;
}

export function UploadStep({ resume, onUpload, onRemove, onContinue }: UploadStepProps) {
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
      const response = await apiRequest("POST", "/api/resume/upload", formData, true);
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
    <Card className="bg-white rounded-lg shadow-md">
      <CardContent className="p-6 md:p-8">
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-[#0077B5] flex items-center justify-center text-white">
              1
            </div>
            <h2 className="ml-3 text-xl font-semibold text-[#333333]">Upload your resume</h2>
          </div>
          <p className="text-[#86888A] ml-11">
            Start by uploading your resume to help us find the best matches for you.
          </p>
        </div>

        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer hover:bg-[#F3F2EF] hover:border-[#0077B5] ${
            dragState.dragActive ? "border-[#0077B5] bg-blue-50" : "border-gray-300"
          }`}
          onClick={handleBrowseFiles}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="space-y-3">
            <div className="mx-auto flex justify-center">
              <FileUploadIcon className="text-[#0077B5]" />
            </div>
            <p className="text-[#333333]">
              <span className="font-medium">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-[#86888A]">PDF, DOCX, or TXT (max. 5MB)</p>
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
          <div className="mt-6 bg-green-50 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="text-green-500 h-5 w-5" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">{resume.originalname}</p>
                <p className="mt-1 text-xs text-green-700">Resume uploaded successfully</p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    className="text-green-500 hover:text-green-700 rounded-md focus:ring-2 focus:ring-green-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove();
                    }}
                  >
                    <span className="sr-only">Dismiss</span>
                    <XIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <Button
            className={resume ? "bg-[#0077B5] hover:bg-blue-700" : "bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300"}
            onClick={onContinue}
            disabled={!resume}
          >
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function FileUploadIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className={`h-12 w-12 ${className}`} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
      />
    </svg>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className={className} 
      viewBox="0 0 20 20" 
      fill="currentColor"
    >
      <path 
        fillRule="evenodd" 
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
        clipRule="evenodd" 
      />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className={className} 
      viewBox="0 0 20 20" 
      fill="currentColor"
    >
      <path 
        fillRule="evenodd" 
        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
        clipRule="evenodd" 
      />
    </svg>
  );
}
