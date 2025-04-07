import { MCPClient } from "./mcp";

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
 * Find relevant job info using Brave Search
 */
export async function findJobInfo(resume: Resume): Promise<any> {
  try {
    const skills = resume.skills.slice(0, 5).join(", ");
    const role = resume.latestRole?.title || "professional";

    const searchQuery = `job requirements for ${role} with skills in ${skills}`;

    const searchResults = await MCPClient.executeToolCall(
      'brave-search',
      'brave_web_search',
      { query: searchQuery }
    );
    console.log('[SEARCH] Search results:', searchResults);

    return searchResults;
  } catch (error) {
    console.error('[SEARCH] Error finding job info:', error);
    return null;
  }
}