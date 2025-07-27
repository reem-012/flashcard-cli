import { Card, Difficulty } from '../types';

export function calculateNextInterval(currentInterval: number, difficulty: Difficulty): number {
  if (currentInterval === 0) {
    return 1;
  }

  switch (difficulty) {
    case 'easy':
      return currentInterval * 2.5;
    case 'medium':
      return currentInterval * 1.5;
    case 'hard':
      return 1;
    default:
      return currentInterval;
  }
}

export function getCardsDueForReview(cards: Card[]): Card[] {
  const now = new Date();
  
  const dueCards = cards.filter(card => {
    if (card.interval === 0) {
      return true;
    }
    
    if (!card.nextReview) {
      return true;
    }
    
    const nextReviewDate = new Date(card.nextReview);
    return nextReviewDate <= now;
  });

  // Sort: overdue cards first (by how overdue they are), then new cards
  return dueCards.sort((a, b) => {
    // Both are new cards
    if (a.interval === 0 && b.interval === 0) {
      return 0;
    }
    
    // One is new, one is not - prioritize the non-new card
    if (a.interval === 0) return 1;
    if (b.interval === 0) return -1;
    
    // Both are overdue - sort by how overdue they are
    const aNextReview = a.nextReview ? new Date(a.nextReview).getTime() : 0;
    const bNextReview = b.nextReview ? new Date(b.nextReview).getTime() : 0;
    return aNextReview - bNextReview;
  });
}