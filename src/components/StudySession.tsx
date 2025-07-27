import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { Card, Difficulty } from '../types';

interface StudySessionProps {
  cards: Card[];
  onCardReviewed: (card: Card, difficulty: Difficulty) => void;
  onComplete: () => void;
}

export const StudySession: React.FC<StudySessionProps> = ({ 
  cards, 
  onCardReviewed, 
  onComplete 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionStats, setSessionStats] = useState({ correct: 0, total: 0 });

  const currentCard = cards[currentIndex];

  useInput((input: string, key: any) => {
    if (!currentCard) return;

    if (!showAnswer && input === ' ') {
      setShowAnswer(true);
    } else if (showAnswer && ['1', '2', '3'].includes(input)) {
      const difficulty: Difficulty = 
        input === '1' ? 'hard' : 
        input === '2' ? 'medium' : 
        'easy';
      
      onCardReviewed(currentCard, difficulty);
      
      setSessionStats(prev => ({
        ...prev,
        total: prev.total + 1,
        correct: prev.correct + (difficulty !== 'hard' ? 1 : 0)
      }));

      if (currentIndex < cards.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setShowAnswer(false);
      } else {
        onComplete();
      }
    } else if (key.escape) {
      onComplete();
    }
  });

  if (!currentCard) {
    return (
      <Box flexDirection="column">
        <Text color="green">No cards due for review!</Text>
        <Text dimColor>Press ESC to return to menu</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text bold>
          Card {currentIndex + 1} of {cards.length}
        </Text>
      </Box>
      
      <Box borderStyle="round" padding={1} marginBottom={1}>
        <Text>{currentCard.front}</Text>
      </Box>

      {showAnswer && (
        <>
          <Box borderStyle="round" borderColor="green" padding={1} marginBottom={1}>
            <Text>{currentCard.back}</Text>
          </Box>
          
          <Box flexDirection="column">
            <Text>Rate difficulty:</Text>
            <Text dimColor>1 - Hard (Reset interval)</Text>
            <Text dimColor>2 - Medium (1.5x interval)</Text>
            <Text dimColor>3 - Easy (2.5x interval)</Text>
          </Box>
        </>
      )}

      {!showAnswer && (
        <Text dimColor>Press SPACE to reveal answer</Text>
      )}

      <Box marginTop={1}>
        <Text dimColor>
          Session: {sessionStats.correct}/{sessionStats.total} correct | ESC to exit
        </Text>
      </Box>
    </Box>
  );
};