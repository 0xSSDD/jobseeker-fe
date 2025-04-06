import { MailService } from '@sendgrid/mail';
import { CoverLetter } from './coverLetterService';
import { Resume } from '../models/Resume';

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text: string;
  html?: string;
  attachments?: {
    content: string;
    filename: string;
    type: string;
    disposition: string;
  }[];
}

interface SendJobApplicationParams {
  resume: Resume;
  job: {
    id: string;
    title: string;
    company: string;
    hiringManagerEmail?: string;
    hiringManagerName?: string;
  };
  coverLetter: CoverLetter;
  recipientEmail: string;
  senderName: string;
}

/**
 * Service for sending emails
 */
class EmailService {
  private mailService: MailService;
  private initialized: boolean = false;

  constructor() {
    this.mailService = new MailService();
    // We'll initialize the API key when we need to send an email
  }

  /**
   * Initialize the SendGrid API key
   */
  private initialize(): boolean {
    if (this.initialized) return true;
    
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      console.error('SendGrid API key not found');
      return false;
    }
    
    this.mailService.setApiKey(apiKey);
    this.initialized = true;
    return true;
  }

  /**
   * Send a job application email with cover letter
   */
  async sendJobApplication({
    resume,
    job,
    coverLetter,
    recipientEmail,
    senderName
  }: SendJobApplicationParams): Promise<boolean> {
    if (!this.initialize()) {
      return false;
    }

    try {
      const hiringManagerName = job.hiringManagerName || 'Hiring Manager';
      const subject = `Job Application: ${job.title} position at ${job.company}`;
      
      // Format the email body
      const text = `Dear ${hiringManagerName},

${coverLetter.content}

Thank you for your consideration. I look forward to the opportunity to discuss how my background and skills would benefit ${job.company}.

Sincerely,
${senderName}`;
      
      // Create the HTML version
      const html = text.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>');
      const htmlContent = `<html><body><p>${html}</p></body></html>`;

      // Prepare the email parameters
      const emailParams: EmailParams = {
        to: recipientEmail,
        from: resume.email,
        subject,
        text,
        html: htmlContent
      };
      
      // If we had the actual file content, we could add it as an attachment
      // For now, we're just sending the text of the cover letter
      
      // Send the email
      await this.mailService.send(emailParams);
      return true;
    } catch (error) {
      console.error('Error sending job application email:', error);
      return false;
    }
  }

  /**
   * Generate a Gmail mailto link for the job application
   */
  generateGmailLink(
    recipientEmail: string, 
    subject: string, 
    body: string
  ): string {
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${recipientEmail}&su=${encodedSubject}&body=${encodedBody}`;
  }
}

// Export a singleton instance
export default new EmailService();