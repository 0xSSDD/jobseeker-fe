import Anthropic from '@anthropic-ai/sdk';
import { Resume } from '../models/Resume';

export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  location?: string;
  requirements?: string[];
}

export interface CoverLetter {
  id: string;
  resumeId: string;
  jobId: string;
  content: string;
  filePath: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Service for generating cover letters
 */
class CoverLetterService {
  private anthropic: Anthropic;

  constructor() {
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || '',
    });
  }

  /**
   * Generate a cover letter for a specific job using the user's resume
   */
  async generateCoverLetter(resume: Resume, job: Job): Promise<string> {
    try {
      // the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
      const message = await this.anthropic.messages.create({
        model: 'claude-3-7-sonnet-20250219',
        max_tokens: 4000,
        system: `You are an expert at writing custom cover letters that match a candidate's resume with a specific job description. Your cover letters should:
        1. Be personalized and address the specific company and role
        2. Highlight the most relevant skills and experiences that match the job requirements
        3. Demonstrate knowledge of the company and enthusiasm for the role
        4. Be professional, concise (no more than 350 words), and well-structured`,
        messages: [
          {
            role: 'user',
            content: `Generate a cover letter for this job:
            
            Job Title: ${job.title}
            Company: ${job.company}
            Location: ${job.location || 'Not specified'}
            Description: ${job.description}
            Requirements: ${job.requirements?.join(', ') || 'Not specified'}
            
            Candidate Resume:
            Name: ${resume.name}
            Email: ${resume.email}
            Phone: ${resume.phone}
            Latest Role: ${resume.latestRole.title} at ${resume.latestRole.company}
            Skills: ${resume.skills.join(', ')}
            
            Experience:
            ${resume.experiences.map(exp => 
              `- ${exp.title} at ${exp.company} (${exp.startDate} - ${exp.endDate || 'Present'})
               ${exp.description || ''}`
            ).join('\n')}
            
            Write a personalized, professional cover letter that highlights how the candidate's skills and experience make them a good fit for this role. Format the letter professionally with a header, greeting, body paragraphs, and signature. Do not include the resume or job details at the top of the letter.`
          }
        ],
        temperature: 0.7,
      });

      // Extract the content
      let content = message.content[0];
      let responseText = '';

      if (typeof content === 'object' && 'text' in content) {
        responseText = content.text;
      } else if (typeof content === 'string') {
        responseText = content;
      } else {
        responseText = JSON.stringify(content);
      }

      return responseText;
    } catch (error) {
      console.error('Error generating cover letter:', error);
      return this.generateFallbackCoverLetter(resume, job);
    }
  }

  /**
   * Generate a fallback cover letter if Claude AI fails
   */
  private generateFallbackCoverLetter(resume: Resume, job: Job): string {
    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return `${resume.name}
${resume.email}
${resume.phone}

${today}

Hiring Manager
${job.company}
${job.location || ''}

Dear Hiring Manager,

I am writing to express my interest in the ${job.title} position at ${job.company}. With my background as a ${resume.latestRole.title} at ${resume.latestRole.company} and my skills in ${resume.skills.slice(0, 3).join(', ')}, I believe I am well-qualified for this role.

Throughout my career, I have developed strong expertise in ${resume.skills.slice(0, 3).join(', ')}, which directly align with the requirements for this position. In my current role as ${resume.latestRole.title}, I have successfully [accomplished key achievements related to the role].

I am particularly drawn to ${job.company} because of its reputation for [company strength] and its commitment to [company value or mission]. I am excited about the prospect of contributing my skills and experience to your team.

Thank you for considering my application. I look forward to the opportunity to discuss how my background and skills would be beneficial to ${job.company}.

Sincerely,

${resume.name}
`;
  }
}

// Export a singleton instance
export default new CoverLetterService();