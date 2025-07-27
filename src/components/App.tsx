import React, { useState, useEffect } from 'react';
import { Box, Text, useApp } from 'ink';
import { AppState, Card, Difficulty } from '../types';
import { MainMenu } from './MainMenu';
import { StudySession } from './StudySession';
import { CardForm } from './CardForm';
import { EditCardList } from './EditCardList';
import { 
  loadDeck, 
  saveDeck, 
  addCardToDeck, 
  updateCardInDeck, 
  deleteCardFromDeck 
} from '../utils/deckManager';
import { getCardsDueForReview } from '../utils/repetition';
import { updateCardAfterReview } from '../utils/scheduler';

interface AppProps {
  deckPath: string;
}

export const App: React.FC<AppProps> = ({ deckPath }) => {
  const { exit } = useApp();
  const [state, setState] = useState<AppState>({
    deck: null,
    currentView: 'menu',
    studySession: null,
    error: null,
  });

  // Load deck on mount
  useEffect(() => {
    loadDeck(deckPath)
      .then(deck => setState(prev => ({ ...prev, deck })))
      .catch(err => setState(prev => ({ 
        ...prev, 
        error: `Failed to load deck: ${err.message}` 
      })));
  }, [deckPath]);

  // Auto-save deck whenever it changes
  useEffect(() => {
    if (state.deck) {
      saveDeck(deckPath, state.deck).catch(err => 
        console.error('Failed to save deck:', err)
      );
    }
  }, [state.deck, deckPath]);

  const handleMenuSelect = (action: 'study' | 'add' | 'edit' | 'quit') => {
    switch (action) {
      case 'study':
        if (state.deck) {
          const dueCards = getCardsDueForReview(state.deck.cards);
          setState(prev => ({
            ...prev,
            currentView: 'study',
            studySession: {
              currentCardIndex: 0,
              cardsToReview: dueCards,
              cardsReviewed: 0,
              startTime: new Date(),
            },
          }));
        }
        break;
      case 'add':
        setState(prev => ({ ...prev, currentView: 'add' }));
        break;
      case 'edit':
        setState(prev => ({ ...prev, currentView: 'edit' }));
        break;
      case 'quit':
        exit();
        break;
    }
  };

  const handleCardReviewed = (card: Card, difficulty: Difficulty) => {
    if (!state.deck) return;

    const updatedCard = updateCardAfterReview(card, difficulty);
    const updatedDeck = updateCardInDeck(state.deck, updatedCard);
    
    setState((prev: any) => ({ ...prev, deck: updatedDeck }));
  };

  const handleAddCard = (front: string, back: string) => {
    if (!state.deck) return;

    const updatedDeck = addCardToDeck(state.deck, front, back);
    setState(prev => ({ 
      ...prev, 
      deck: updatedDeck,
      currentView: 'menu' 
    }));
  };

  const handleEditCard = (card: Card) => {
    if (!state.deck) return;

    const updatedDeck = updateCardInDeck(state.deck, card);
    setState((prev: any) => ({ ...prev, deck: updatedDeck }));
  };

  const handleDeleteCard = (cardId: string) => {
    if (!state.deck) return;

    const updatedDeck = deleteCardFromDeck(state.deck, cardId);
    setState((prev: any) => ({ ...prev, deck: updatedDeck }));
  };

  const returnToMenu = () => {
    setState(prev => ({ 
      ...prev, 
      currentView: 'menu',
      studySession: null 
    }));
  };

  if (state.error) {
    return (
      <Box>
        <Text color="red">Error: {state.error}</Text>
      </Box>
    );
  }

  if (!state.deck) {
    return (
      <Box>
        <Text>Loading deck...</Text>
      </Box>
    );
  }

  switch (state.currentView) {
    case 'menu':
      return <MainMenu deck={state.deck} onSelect={handleMenuSelect} />;
    
    case 'study':
      return state.studySession ? (
        <StudySession
          cards={state.studySession.cardsToReview}
          onCardReviewed={handleCardReviewed}
          onComplete={returnToMenu}
        />
      ) : null;
    
    case 'add':
      return (
        <CardForm
          onSubmit={handleAddCard}
          onCancel={returnToMenu}
        />
      );
    
    case 'edit':
      return (
        <EditCardList
          cards={state.deck.cards}
          onEdit={handleEditCard}
          onDelete={handleDeleteCard}
          onBack={returnToMenu}
        />
      );
    
    default:
      return null;
  }
};