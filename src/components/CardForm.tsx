import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';

interface CardFormProps {
  initialFront?: string;
  initialBack?: string;
  onSubmit: (front: string, back: string) => void;
  onCancel: () => void;
}

export const CardForm: React.FC<CardFormProps> = ({ 
  initialFront = '', 
  initialBack = '', 
  onSubmit, 
  onCancel 
}) => {
  const [front, setFront] = useState(initialFront);
  const [back, setBack] = useState(initialBack);
  const [focusedField, setFocusedField] = useState<'front' | 'back'>('front');

  useInput((_input: string, key: any) => {
    if (key.tab) {
      setFocusedField(focusedField === 'front' ? 'back' : 'front');
    } else if (key.escape) {
      onCancel();
    } else if (key.return && focusedField === 'back' && front.trim() && back.trim()) {
      onSubmit(front.trim(), back.trim());
    }
  });

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text bold>Add New Card</Text>
      </Box>

      <Box marginBottom={1}>
        <Box marginRight={1}>
          <Text>Front: </Text>
        </Box>
        <TextInput
          value={front}
          onChange={setFront}
          focus={focusedField === 'front'}
          placeholder="Enter question..."
        />
      </Box>

      <Box marginBottom={1}>
        <Box marginRight={1}>
          <Text>Back: </Text>
        </Box>
        <TextInput
          value={back}
          onChange={setBack}
          focus={focusedField === 'back'}
          placeholder="Enter answer..."
        />
      </Box>

      <Box flexDirection="column">
        <Text dimColor>TAB to switch fields</Text>
        <Text dimColor>ENTER (when on back field) to save</Text>
        <Text dimColor>ESC to cancel</Text>
      </Box>
    </Box>
  );
};