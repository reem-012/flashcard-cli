import { scheduleCard, updateCardAfterReview } from './scheduler';
import { Card } from '../types';

// Mock uuid
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid'),
}));

describe('scheduleCard', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-15T12:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should calculate next review date based on interval', () => {
    const card: Card = {
      id: '1',
      front: 'Question',
      back: 'Answer',
      interval: 3,
      lastReviewed: null,
      nextReview: null,
    };

    const scheduledCard = scheduleCard(card, 3);
    
    expect(scheduledCard.lastReviewed).toBe('2024-01-15T12:00:00.000Z');
    expect(scheduledCard.nextReview).toBe('2024-01-18T12:00:00.000Z');
    expect(scheduledCard.interval).toBe(3);
  });

  it('should handle interval of 0', () => {
    const card: Card = {
      id: '1',
      front: 'Question',
      back: 'Answer',
      interval: 0,
      lastReviewed: null,
      nextReview: null,
    };

    const scheduledCard = scheduleCard(card, 1);
    
    expect(scheduledCard.interval).toBe(1);
    expect(scheduledCard.nextReview).toBe('2024-01-16T12:00:00.000Z');
  });
});

describe('updateCardAfterReview', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-15T12:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should update card with easy difficulty', () => {
    const card: Card = {
      id: '1',
      front: 'Question',
      back: 'Answer',
      interval: 2,
      lastReviewed: '2024-01-13T12:00:00.000Z',
      nextReview: '2024-01-15T12:00:00.000Z',
    };

    const updatedCard = updateCardAfterReview(card, 'easy');
    
    expect(updatedCard.interval).toBe(5); // 2 * 2.5
    expect(updatedCard.lastReviewed).toBe('2024-01-15T12:00:00.000Z');
    expect(updatedCard.nextReview).toBe('2024-01-20T12:00:00.000Z');
  });

  it('should update card with medium difficulty', () => {
    const card: Card = {
      id: '1',
      front: 'Question',
      back: 'Answer',
      interval: 4,
      lastReviewed: '2024-01-11T12:00:00.000Z',
      nextReview: '2024-01-15T12:00:00.000Z',
    };

    const updatedCard = updateCardAfterReview(card, 'medium');
    
    expect(updatedCard.interval).toBe(6); // 4 * 1.5
    expect(updatedCard.lastReviewed).toBe('2024-01-15T12:00:00.000Z');
    expect(updatedCard.nextReview).toBe('2024-01-21T12:00:00.000Z');
  });

  it('should update card with hard difficulty', () => {
    const card: Card = {
      id: '1',
      front: 'Question',
      back: 'Answer',
      interval: 10,
      lastReviewed: '2024-01-05T12:00:00.000Z',
      nextReview: '2024-01-15T12:00:00.000Z',
    };

    const updatedCard = updateCardAfterReview(card, 'hard');
    
    expect(updatedCard.interval).toBe(1); // Reset to 1
    expect(updatedCard.lastReviewed).toBe('2024-01-15T12:00:00.000Z');
    expect(updatedCard.nextReview).toBe('2024-01-16T12:00:00.000Z');
  });

  it('should handle new card (interval 0)', () => {
    const card: Card = {
      id: '1',
      front: 'Question',
      back: 'Answer',
      interval: 0,
      lastReviewed: null,
      nextReview: null,
    };

    const updatedCard = updateCardAfterReview(card, 'medium');
    
    expect(updatedCard.interval).toBe(1);
    expect(updatedCard.lastReviewed).toBe('2024-01-15T12:00:00.000Z');
    expect(updatedCard.nextReview).toBe('2024-01-16T12:00:00.000Z');
  });
});