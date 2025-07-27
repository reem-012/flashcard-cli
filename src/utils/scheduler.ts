import { Card, Difficulty } from '../types';
import { addDays } from 'date-fns';
import { calculateNextInterval } from './repetition';

export function scheduleCard(card: Card, interval: number): Card {
  const now = new Date();
  const nextReviewDate = addDays(now, interval);
  
  return {
    ...card,
    interval,
    lastReviewed: now.toISOString(),
    nextReview: nextReviewDate.toISOString(),
  };
}

export function updateCardAfterReview(card: Card, difficulty: Difficulty): Card {
  const newInterval = calculateNextInterval(card.interval, difficulty);
  return scheduleCard(card, newInterval);
}