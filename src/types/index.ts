export interface Card {
  id: string;
  front: string;
  back: string;
  interval: number;
  lastReviewed: string | null;
  nextReview: string | null;
}

export interface Deck {
  name: string;
  description: string;
  cards: Card[];
  created: string;
  modified: string;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface StudySession {
  currentCardIndex: number;
  cardsToReview: Card[];
  cardsReviewed: number;
  startTime: Date;
}

export interface AppState {
  deck: Deck | null;
  currentView: 'menu' | 'study' | 'add' | 'edit' | 'list';
  studySession: StudySession | null;
  error: string | null;
}