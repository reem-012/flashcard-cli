import { loadDeck, saveDeck, createNewDeck, addCardToDeck, updateCardInDeck, deleteCardFromDeck } from './deckManager';
import { Deck, Card } from '../types';
import * as fs from 'fs/promises';

// Mock fs/promises
jest.mock('fs/promises');
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid'),
}));

const mockFs = fs as jest.Mocked<typeof fs>;

describe('deckManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-15T12:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('loadDeck', () => {
    it('should load a valid deck from file', async () => {
      const mockDeck: Deck = {
        name: 'Test Deck',
        description: 'A test deck',
        cards: [
          {
            id: '1',
            front: 'Question 1',
            back: 'Answer 1',
            interval: 1,
            lastReviewed: null,
            nextReview: null,
          },
        ],
        created: '2024-01-01T00:00:00.000Z',
        modified: '2024-01-10T00:00:00.000Z',
      };

      mockFs.readFile.mockResolvedValue(JSON.stringify(mockDeck));

      const deck = await loadDeck('/path/to/deck.json');
      
      expect(mockFs.readFile).toHaveBeenCalledWith('/path/to/deck.json', 'utf-8');
      expect(deck).toEqual(mockDeck);
    });

    it('should throw an error if file cannot be read', async () => {
      mockFs.readFile.mockRejectedValue(new Error('File not found'));

      await expect(loadDeck('/invalid/path.json')).rejects.toThrow('Failed to load deck: File not found');
    });

    it('should throw an error if JSON is invalid', async () => {
      mockFs.readFile.mockResolvedValue('invalid json');

      await expect(loadDeck('/path/to/deck.json')).rejects.toThrow('Failed to load deck: Invalid JSON format');
    });
  });

  describe('saveDeck', () => {
    it('should save deck to file', async () => {
      const deck: Deck = {
        name: 'Test Deck',
        description: 'A test deck',
        cards: [],
        created: '2024-01-01T00:00:00.000Z',
        modified: '2024-01-10T00:00:00.000Z',
      };

      mockFs.writeFile.mockResolvedValue(undefined);

      await saveDeck('/path/to/deck.json', deck);
      
      const expectedDeck = {
        ...deck,
        modified: '2024-01-15T12:00:00.000Z',
      };
      
      expect(mockFs.writeFile).toHaveBeenCalledWith(
        '/path/to/deck.json',
        JSON.stringify(expectedDeck, null, 2),
        'utf-8'
      );
    });

    it('should update modified timestamp when saving', async () => {
      const deck: Deck = {
        name: 'Test Deck',
        description: 'A test deck',
        cards: [],
        created: '2024-01-01T00:00:00.000Z',
        modified: '2024-01-10T00:00:00.000Z',
      };

      mockFs.writeFile.mockResolvedValue(undefined);

      await saveDeck('/path/to/deck.json', deck);
      
      const savedData = JSON.parse(mockFs.writeFile.mock.calls[0][1] as string);
      expect(savedData.modified).toBe('2024-01-15T12:00:00.000Z');
    });

    it('should throw an error if save fails', async () => {
      const deck: Deck = {
        name: 'Test Deck',
        description: 'A test deck',
        cards: [],
        created: '2024-01-01T00:00:00.000Z',
        modified: '2024-01-10T00:00:00.000Z',
      };

      mockFs.writeFile.mockRejectedValue(new Error('Permission denied'));

      await expect(saveDeck('/path/to/deck.json', deck)).rejects.toThrow('Failed to save deck: Permission denied');
    });
  });

  describe('createNewDeck', () => {
    it('should create a new deck with default values', () => {
      const deck = createNewDeck('My Deck', 'My deck description');
      
      expect(deck.name).toBe('My Deck');
      expect(deck.description).toBe('My deck description');
      expect(deck.cards).toEqual([]);
      expect(deck.created).toBe('2024-01-15T12:00:00.000Z');
      expect(deck.modified).toBe('2024-01-15T12:00:00.000Z');
    });
  });

  describe('addCardToDeck', () => {
    it('should add a new card to the deck', () => {
      const deck: Deck = {
        name: 'Test Deck',
        description: 'A test deck',
        cards: [],
        created: '2024-01-01T00:00:00.000Z',
        modified: '2024-01-10T00:00:00.000Z',
      };

      const updatedDeck = addCardToDeck(deck, 'Question', 'Answer');
      
      expect(updatedDeck.cards).toHaveLength(1);
      expect(updatedDeck.cards[0]).toEqual({
        id: 'test-uuid',
        front: 'Question',
        back: 'Answer',
        interval: 0,
        lastReviewed: null,
        nextReview: null,
      });
      expect(updatedDeck.modified).toBe('2024-01-15T12:00:00.000Z');
    });

    it('should not modify the original deck', () => {
      const deck: Deck = {
        name: 'Test Deck',
        description: 'A test deck',
        cards: [],
        created: '2024-01-01T00:00:00.000Z',
        modified: '2024-01-10T00:00:00.000Z',
      };

      const originalCards = [...deck.cards];
      addCardToDeck(deck, 'Question', 'Answer');
      
      expect(deck.cards).toEqual(originalCards);
    });
  });

  describe('updateCardInDeck', () => {
    it('should update an existing card in the deck', () => {
      const deck: Deck = {
        name: 'Test Deck',
        description: 'A test deck',
        cards: [
          {
            id: '1',
            front: 'Old Question',
            back: 'Old Answer',
            interval: 1,
            lastReviewed: null,
            nextReview: null,
          },
          {
            id: '2',
            front: 'Question 2',
            back: 'Answer 2',
            interval: 0,
            lastReviewed: null,
            nextReview: null,
          },
        ],
        created: '2024-01-01T00:00:00.000Z',
        modified: '2024-01-10T00:00:00.000Z',
      };

      const updatedCard: Card = {
        id: '1',
        front: 'New Question',
        back: 'New Answer',
        interval: 3,
        lastReviewed: '2024-01-15T00:00:00.000Z',
        nextReview: '2024-01-18T00:00:00.000Z',
      };

      const updatedDeck = updateCardInDeck(deck, updatedCard);
      
      expect(updatedDeck.cards[0]).toEqual(updatedCard);
      expect(updatedDeck.cards[1]).toEqual(deck.cards[1]);
      expect(updatedDeck.modified).toBe('2024-01-15T12:00:00.000Z');
    });

    it('should not update if card id not found', () => {
      const deck: Deck = {
        name: 'Test Deck',
        description: 'A test deck',
        cards: [
          {
            id: '1',
            front: 'Question',
            back: 'Answer',
            interval: 0,
            lastReviewed: null,
            nextReview: null,
          },
        ],
        created: '2024-01-01T00:00:00.000Z',
        modified: '2024-01-10T00:00:00.000Z',
      };

      const nonExistentCard: Card = {
        id: 'non-existent',
        front: 'New Question',
        back: 'New Answer',
        interval: 0,
        lastReviewed: null,
        nextReview: null,
      };

      const updatedDeck = updateCardInDeck(deck, nonExistentCard);
      
      expect(updatedDeck.cards).toEqual(deck.cards);
      expect(updatedDeck.modified).toBe(deck.modified);
    });
  });

  describe('deleteCardFromDeck', () => {
    it('should delete a card from the deck', () => {
      const deck: Deck = {
        name: 'Test Deck',
        description: 'A test deck',
        cards: [
          {
            id: '1',
            front: 'Question 1',
            back: 'Answer 1',
            interval: 0,
            lastReviewed: null,
            nextReview: null,
          },
          {
            id: '2',
            front: 'Question 2',
            back: 'Answer 2',
            interval: 0,
            lastReviewed: null,
            nextReview: null,
          },
        ],
        created: '2024-01-01T00:00:00.000Z',
        modified: '2024-01-10T00:00:00.000Z',
      };

      const updatedDeck = deleteCardFromDeck(deck, '1');
      
      expect(updatedDeck.cards).toHaveLength(1);
      expect(updatedDeck.cards[0].id).toBe('2');
      expect(updatedDeck.modified).toBe('2024-01-15T12:00:00.000Z');
    });

    it('should not modify deck if card id not found', () => {
      const deck: Deck = {
        name: 'Test Deck',
        description: 'A test deck',
        cards: [
          {
            id: '1',
            front: 'Question',
            back: 'Answer',
            interval: 0,
            lastReviewed: null,
            nextReview: null,
          },
        ],
        created: '2024-01-01T00:00:00.000Z',
        modified: '2024-01-10T00:00:00.000Z',
      };

      const updatedDeck = deleteCardFromDeck(deck, 'non-existent');
      
      expect(updatedDeck.cards).toEqual(deck.cards);
      expect(updatedDeck.modified).toBe(deck.modified);
    });
  });
});