import { useState, useRef, useCallback } from 'react'
import { Upload, File, X, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Resume } from '@/types'
import { uploadFile } from '@/utils/helpers'

interface UploadComponentProps {
  onUploadSuccess: (resume: Resume) => void;
}

export function UploadComponent({ onUploadSuccess }: UploadComponentProps) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [])
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }, [])
  
  const handleFile = (file: File) => {
    // Check file type (simple validation)
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    
    if (!validTypes.includes(file.type)) {
      setError('Please upload a PDF or Word document')
      return
    }
    
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit')
      return
    }
    
    setSelectedFile(file)
    setError(null)
  }
  
  const handleUpload = async () => {
    if (!selectedFile) return
    
    setUploading(true)
    setError(null)
    
    try {
      // Upload file to server
      const resumeData = await uploadFile(selectedFile)
      
      // Notify parent component of successful upload
      onUploadSuccess(resumeData)
    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err.message || 'An error occurred during upload')
      setUploading(false)
    }
  }
  
  const onButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click()
    }
  }
  
  const clearFile = () => {
    setSelectedFile(null)
    setError(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold gradient-text">Find Your Dream Job</h2>
        <p className="text-muted-foreground mt-2">
          Upload your resume to start the job matching process
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Upload Your Resume</CardTitle>
          <CardDescription>
            We'll analyze your resume to find the most relevant job opportunities
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div 
            className={`
              border-2 border-dashed rounded-lg p-10
              ${dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/20'}
              ${error ? 'border-red-500/50 bg-red-50' : ''}
              transition-colors duration-200
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={handleChange}
            />
            
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              {selectedFile ? (
                <>
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <File className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={clearFile}
                  >
                    <X className="mr-1 h-4 w-4" /> Remove file
                  </Button>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  </div>
                  {error ? (
                    <div className="text-red-500">
                      <p className="font-medium">Error</p>
                      <p className="text-sm">{error}</p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-medium">
                        Drag & drop your resume here, or {' '}
                        <button
                          type="button"
                          className="text-primary hover:underline focus:outline-none"
                          onClick={onButtonClick}
                        >
                          browse
                        </button>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Supports PDF, DOC, DOCX (up to 5MB)
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between border-t pt-4">
          <p className="text-sm text-muted-foreground">
            Your resume will be stored securely and only used for job matching
          </p>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              'Continue'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}