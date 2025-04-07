import { Anthropic } from '@anthropic-ai/sdk';
import { MCPClient } from './mcp';
import fs from 'fs';
import path from 'path';
import { PdfReader } from 'pdfreader';

// TODO clean types up:
// There is a literal client/src/types/index.ts - which does not even match the schema
// does the schema make sense?
// and client/src/models/Resume.ts
// currently each service has its types
interface Experience {
  title: string;
  company: string;
  startDate: string;
  endDate?: string;
  description: string;
}

interface Resume {
  name: string;
  email: string;
  phone: string;
  skills: string[];
  experiences: Experience[];
  latestRole?: {
    title: string;
    company: string;
    startDate: string;
  };
}

/**
 * Parse resumes using MCP and Claude
 */
export async function parseResume(fileBuffer: Buffer, fileName: string): Promise<Resume> {
  try {
    console.log("[PARSE] Starting resume parsing");

    // 1. Create a temporary file
    const tempDir = path.join(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const tempFilePath = path.join(tempDir, fileName);
    fs.writeFileSync(tempFilePath, fileBuffer);
    console.log(`[PARSE] Saved temp file: ${tempFilePath}`);

    // 2. Extract text from PDF using pdfreader
    const textContent = await extractTextFromPdf(fileBuffer);
    console.log(`[PARSE] PDF text extracted successfully (${textContent.length} characters)`);

    // 3. Use Claude to parse the resume
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || ''
    });
    // TODO: Optimise the prompt
    const message = await anthropic.messages.create({
      model: "claude-3-7-sonnet-latest",
      max_tokens: 4000,
      system: `Parse the resume text into structured JSON format with name, email, phone, skills, and experiences.`,
      messages: [
        {
          role: 'user',
          content: `Parse this resume text into JSON:
${textContent.substring(0, 12000)}

Return only JSON with this structure:
{
  "name": "Full Name",
  "email": "email@example.com",
  "phone": "phone number",
  "skills": ["skill1", "skill2"],
  "experiences": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM or present",
      "description": "Job description"
    }
  ]
}`
        }
      ],
      temperature: 0,
    });

    // 4. Process Claude's response
    let responseText = '';
    if (message.content && message.content.length > 0) {
      const content = message.content[0];
      if (content.type === 'text') {
        responseText = content.text;
      }
    }

    // Clean up response and parse JSON
    responseText = responseText.replace(/```json\s+|\s+```|```/g, '');
    const resumeData = JSON.parse(responseText);

    // 5. Clean up temp file
    fs.unlinkSync(tempFilePath);

    // 6. Process and return resume data
    const experiences = resumeData.experiences || [];
    const latestRole = experiences.length > 0 ? {
      title: experiences[0].title,
      company: experiences[0].company,
      startDate: experiences[0].startDate
    } : undefined;

    return {
      name: resumeData.name || 'Unknown',
      email: resumeData.email || '',
      phone: resumeData.phone || '',
      skills: resumeData.skills || [],
      experiences: experiences,
      latestRole
    };
  } catch (error: unknown) {
    console.error('[PARSE] Error parsing resume:', error);
    if (error instanceof Error) {
      throw new Error(`Resume parsing failed: ${error.message}`);
    }
    throw new Error('Resume parsing failed: Unknown error');
  }
}

// New helper function to extract text from PDF using pdfreader
function extractTextFromPdf(pdfBuffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const textItems: string[] = [];

    new PdfReader().parseBuffer(pdfBuffer, (err, item) => {
      if (err) {
        reject(new Error(String(err)));
      } else if (!item) {
        // End of file, resolve with all collected text
        resolve(textItems.join(' '));
      } else if (item.text) {
        textItems.push(item.text);
      }
    });
  });
}
