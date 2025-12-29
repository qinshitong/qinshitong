export enum AppMode {
  GRID = 'GRID',
  LEARN = 'LEARN',
  QUIZ = 'QUIZ',
  TUTOR = 'TUTOR'
}

export interface MultiplicationFact {
  a: number;
  b: number;
  result: number;
  chineseText: string; // e.g., "三七二十一"
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
