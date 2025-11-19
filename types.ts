
export enum ViewState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  LEARNING = 'LEARNING',
  DASHBOARD = 'DASHBOARD',
}

export interface AnalysisResult {
  concept: string;
  explanationMarkdown: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface Message {
  role: 'user' | 'ai';
  content: string;
}

export type TooltipProps = {
  children: React.ReactNode;
  text: string;
};

export interface Feedback {
  rating: number;
  comment: string;
  timestamp: number;
}

export interface HistoryItem {
  id: string;
  question: string;
  analysis: AnalysisResult;
  tags: string[];
  timestamp: number;
  feedback?: Feedback;
}

export interface User {
  name: string;
  email: string;
}
