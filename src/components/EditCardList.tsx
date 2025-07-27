import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import SelectInput from 'ink-select-input';
import { Card } from '../types';
import { CardForm } from './CardForm';

interface EditCardListProps {
  cards: Card[];
  onEdit: (card: Card) => void;
  onDelete: (cardId: string) => void;
  onBack: () => void;
}

export const EditCardList: React.FC<EditCardListProps> = ({ 
  cards, 
  onEdit, 
  onDelete, 
  onBack 
}) => {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [mode, setMode] = useState<'list' | 'edit' | 'confirm-delete'>('list');

  useInput((input: string, key: any) => {
    if (key.escape) {
      if (mode === 'list') {
        onBack();
      } else {
        setMode('list');
        setSelectedCard(null);
      }
    } else if (mode === 'list' && key.delete && selectedCard) {
      setMode('confirm-delete');
    } else if (mode === 'confirm-delete' && selectedCard) {
      if (input.toLowerCase() === 'y') {
        onDelete(selectedCard.id);
        setMode('list');
        setSelectedCard(null);
      } else if (input.toLowerCase() === 'n') {
        setMode('list');
        setSelectedCard(null);
      }
    }
  });

  if (mode === 'edit' && selectedCard) {
    return (
      <CardForm
        initialFront={selectedCard.front}
        initialBack={selectedCard.back}
        onSubmit={(front: any, back: any) => {
          onEdit({ ...selectedCard, front, back });
          setMode('list');
          setSelectedCard(null);
        }}
        onCancel={() => {
          setMode('list');
          setSelectedCard(null);
        }}
      />
    );
  }

  if (mode === 'confirm-delete' && selectedCard) {
    return (
      <Box flexDirection="column">
        <Text>Are you sure you want to delete this card?</Text>
        <Box marginTop={1}>
          <Text bold>{selectedCard.front}</Text>
        </Box>
        <Box marginTop={1}>
          <Text dimColor>Press Y to confirm, N to cancel</Text>
        </Box>
      </Box>
    );
  }

  const items = cards.map(card => ({
    label: `${card.front} → ${card.back}`,
    value: card.id,
  }));

  const handleSelect = (item: { value: string }) => {
    const card = cards.find(c => c.id === item.value);
    if (card) {
      setSelectedCard(card);
    }
  };

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text bold>Edit/Delete Cards</Text>
      </Box>

      {cards.length === 0 ? (
        <Box>
          <Text>No cards in deck</Text>
        </Box>
      ) : (
        <>
          <Box marginBottom={1}>
            <SelectInput 
              items={items} 
              onSelect={handleSelect}
              onHighlight={(item: any) => {
                const card = cards.find(c => c.id === item.value);
                if (card) setSelectedCard(card);
              }}
            />
          </Box>

          {selectedCard && (
            <Box flexDirection="column">
              <Text dimColor>ENTER to edit</Text>
              <Text dimColor>DELETE to delete</Text>
              <Text dimColor>ESC to go back</Text>
            </Box>
          )}
        </>
      )}

      <Box marginTop={1}>
        <Text dimColor>ESC to return to menu</Text>
      </Box>
    </Box>
  );
};