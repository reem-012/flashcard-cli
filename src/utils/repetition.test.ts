import { calculateNextInterval, getCardsDueForReview } from './repetition';
import { Card } from '../types';

describe('calculateNextInterval', () => {
  it('should multiply interval by 2.5 for easy difficulty', () => {
    expect(calculateNextInterval(4, 'easy')).toBe(10);
    expect(calculateNextInterval(1, 'easy')).toBe(2.5);
  });

  it('should multiply interval by 1.5 for medium difficulty', () => {
    expect(calculateNextInterval(4, 'medium')).toBe(6);
    expect(calculateNextInterval(2, 'medium')).toBe(3);
  });

  it('should reset to 1 for hard difficulty', () => {
    expect(calculateNextInterval(10, 'hard')).toBe(1);
    expect(calculateNextInterval(5, 'hard')).toBe(1);
  });

  it('should handle new cards (interval 0) correctly', () => {
    expect(calculateNextInterval(0, 'easy')).toBe(1);
    expect(calculateNextInterval(0, 'medium')).toBe(1);
    expect(calculateNextInterval(0, 'hard')).toBe(1);
  });
});

describe('getCardsDueForReview', () => {
  const mockCards: Card[] = [
    {
      id: '1',
      front: 'Question 1',
      back: 'Answer 1',
      interval: 1,
      lastReviewed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      nextReview: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago (overdue)
    },
    {
      id: '2',
      front: 'Question 2',
      back: 'Answer 2',
      interval: 3,
      lastReviewed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      nextReview: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now (not due)
    },
    {
      id: '3',
      front: 'Question 3',
      back: 'Answer 3',
      interval: 0,
      lastReviewed: null, // New card
      nextReview: null,
    },
    {
      id: '4',
      front: 'Question 4',
      back: 'Answer 4',
      interval: 1,
      lastReviewed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      nextReview: new Date().toISOString(), // Due today
    },
  ];

  it('should return cards that are due for review', () => {
    const dueCards = getCardsDueForReview(mockCards);
    expect(dueCards).toHaveLength(3);
    expect(dueCards.map(card => card.id)).toEqual(['1', '4', '3']);
  });

  it('should prioritize overdue cards before new cards', () => {
    const dueCards = getCardsDueForReview(mockCards);
    const overdueCards = dueCards.filter(card => card.interval > 0);
    const newCards = dueCards.filter(card => card.interval === 0);
    
    // Overdue cards should come before new cards
    expect(dueCards.indexOf(overdueCards[0])).toBeLessThan(dueCards.indexOf(newCards[0]));
  });

  it('should return empty array when no cards are due', () => {
    const notDueCards: Card[] = [
      {
        id: '1',
        front: 'Question 1',
        back: 'Answer 1',
        interval: 3,
        lastReviewed: new Date().toISOString(),
        nextReview: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
    expect(getCardsDueForReview(notDueCards)).toHaveLength(0);
  });

  it('should handle empty card array', () => {
    expect(getCardsDueForReview([])).toHaveLength(0);
  });
});