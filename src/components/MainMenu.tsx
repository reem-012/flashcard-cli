import React from 'react';
import { Box, Text } from 'ink';
import SelectInput from 'ink-select-input';
import { Deck } from '../types';

interface MainMenuProps {
  deck: Deck;
  onSelect: (action: 'study' | 'add' | 'edit' | 'quit') => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ deck, onSelect }) => {
  const items = [
    { label: 'Study Cards', value: 'study' },
    { label: 'Add New Card', value: 'add' },
    { label: 'Edit/Delete Cards', value: 'edit' },
    { label: 'Quit', value: 'quit' },
  ];

  const handleSelect = (item: { value: string }) => {
    onSelect(item.value as 'study' | 'add' | 'edit' | 'quit');
  };

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text bold color="cyan">
          {deck.name}
        </Text>
      </Box>
      <Box marginBottom={1}>
        <Text dimColor>{deck.description}</Text>
      </Box>
      <Box marginBottom={1}>
        <Text>Total cards: {deck.cards.length}</Text>
      </Box>
      <Box>
        <SelectInput items={items} onSelect={handleSelect} />
      </Box>
    </Box>
  );
};