import { Resume } from '../models/Resume';

interface CoverLetter {
  id: string;
  resumeId: string;
  jobId: string;
  content: string;
  filePath: string;
  createdAt: string;
  updatedAt: string;
}

interface JobWithContact {
  id: string;
  title: string;
  company: string;
  hiringManagerEmail?: string;
  hiringManagerName?: string;
}

/**
 * Service for generating Gmail mailto links for job applications
 */
class EmailService {
  /**
   * Generate a Gmail mailto link for the job application
   */
  generateGmailLink(
    resume: Resume,
    job: JobWithContact,
    coverLetterContent: string
  ): string {
    // Define the recipient email - use hiring manager email if available, otherwise create a fallback
    const recipientEmail = job.hiringManagerEmail || `jobs@${job.company.toLowerCase().replace(/\s+/g, '')}.com`;
    
    // Define the subject line
    const subject = `Application for ${job.title} position at ${job.company}`;
    
    // Create a greeting - use hiring manager name if available
    const greeting = job.hiringManagerName 
      ? `Dear ${job.hiringManagerName},` 
      : 'Dear Hiring Manager,';
    
    // Create the email body
    const body = `${greeting}

${coverLetterContent}

Thank you for considering my application. I have attached my resume for your review.

Best regards,
${resume.name}
${resume.phone}
${resume.email}`;

    // Create the mailto URL with encoded parameters
    const mailtoUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipientEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    return mailtoUrl;
  }
  
  /**
   * Generate a general mailto link for the job application (non-Gmail specific)
   */
  generateMailtoLink(
    resume: Resume,
    job: JobWithContact,
    coverLetterContent: string
  ): string {
    // Define the recipient email - use hiring manager email if available, otherwise create a fallback
    const recipientEmail = job.hiringManagerEmail || `jobs@${job.company.toLowerCase().replace(/\s+/g, '')}.com`;
    
    // Define the subject line
    const subject = `Application for ${job.title} position at ${job.company}`;
    
    // Create a greeting - use hiring manager name if available
    const greeting = job.hiringManagerName 
      ? `Dear ${job.hiringManagerName},` 
      : 'Dear Hiring Manager,';
    
    // Create a shortened email body (since mailto links have size limitations)
    const body = `${greeting}

I am writing to apply for the ${job.title} position at ${job.company}.

Please see my attached resume and cover letter.

Best regards,
${resume.name}`;

    // Create the mailto URL with encoded parameters
    const mailtoUrl = `mailto:${encodeURIComponent(recipientEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    return mailtoUrl;
  }
}

export const emailService = new EmailService();
export default emailService;