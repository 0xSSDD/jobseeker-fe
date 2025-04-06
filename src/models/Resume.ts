export interface Experience {
  title: string;
  company: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export interface Education {
  institution: string;
  degree: string;
  field?: string;
  startDate?: string;
  endDate?: string;
}

export interface Resume {
  id?: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  experiences: Experience[];
  education?: Education[];
  summary?: string;
  latestRole: Experience;
  file_path?: string;
}