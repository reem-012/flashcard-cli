import { Deck, Card } from '../types';
import * as fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

export async function loadDeck(filePath: string): Promise<Deck> {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    try {
      return JSON.parse(data) as Deck;
    } catch (parseError) {
      throw new Error('Failed to load deck: Invalid JSON format');
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('Invalid JSON')) {
      throw error;
    }
    throw new Error(`Failed to load deck: ${(error as Error).message}`);
  }
}

export async function saveDeck(filePath: string, deck: Deck): Promise<void> {
  try {
    const updatedDeck = {
      ...deck,
      modified: new Date().toISOString(),
    };
    await fs.writeFile(filePath, JSON.stringify(updatedDeck, null, 2), 'utf-8');
  } catch (error) {
    throw new Error(`Failed to save deck: ${(error as Error).message}`);
  }
}

export function createNewDeck(name: string, description: string): Deck {
  const now = new Date().toISOString();
  return {
    name,
    description,
    cards: [],
    created: now,
    modified: now,
  };
}

export function addCardToDeck(deck: Deck, front: string, back: string): Deck {
  const newCard: Card = {
    id: uuidv4(),
    front,
    back,
    interval: 0,
    lastReviewed: null,
    nextReview: null,
  };

  return {
    ...deck,
    cards: [...deck.cards, newCard],
    modified: new Date().toISOString(),
  };
}

export function updateCardInDeck(deck: Deck, updatedCard: Card): Deck {
  const cardIndex = deck.cards.findIndex((card: any) => card.id === updatedCard.id);
  
  if (cardIndex === -1) {
    return deck;
  }

  const newCards = [...deck.cards];
  newCards[cardIndex] = updatedCard;

  return {
    ...deck,
    cards: newCards,
    modified: new Date().toISOString(),
  };
}

export function deleteCardFromDeck(deck: Deck, cardId: string): Deck {
  const newCards = deck.cards.filter((card: any) => card.id !== cardId);
  
  if (newCards.length === deck.cards.length) {
    return deck;
  }

  return {
    ...deck,
    cards: newCards,
    modified: new Date().toISOString(),
  };
}