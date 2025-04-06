export interface Experience {
  id?: string;
  title: string;
  company: string;
  startDate: string | Date;
  endDate?: string | Date;
  description?: string;
  resumeId?: string;
}

export interface Education {
  institution: string;
  degree: string;
  field?: string;
  startDate?: string | Date;
  endDate?: string | Date;
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
  filePath?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}