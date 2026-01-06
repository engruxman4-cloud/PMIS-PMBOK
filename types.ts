
export enum EngagementLevel {
  Unaware = 'Unaware',
  Resistant = 'Resistant',
  Neutral = 'Neutral',
  Supportive = 'Supportive',
  Leading = 'Leading'
}

export interface Stakeholder {
  id: string;
  name: string;
  role: string;
  currentEngagement: EngagementLevel;
  desiredEngagement: EngagementLevel;
  power: 'High' | 'Low';
  interest: 'High' | 'Low';
}

export interface CommRequirement {
  id: string;
  stakeholderId: string;
  stakeholderName: string;
  infoNeeded: string;
  format: string;
  frequency: string;
  channel: string;
  owner: string;
}

export interface CommIssue {
  id: string;
  date: string;
  stakeholder: string;
  description: string;
  impact: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'Resolved' | 'Monitor';
}

export interface CommFeedback {
  id: string;
  date: string;
  stakeholder: string;
  item: string;
  rating: number; // 1-5
  comment: string;
}

export interface AIAnalysisResult {
  summary: string;
  recommendations: string[];
  riskScore: number;
}

export interface ProjectSettings {
  name: string;
  manager: string;
  userTitle: string;
  userEmail: string;
  userPicture?: string;
  phase: string;
  methodology: string;
}
