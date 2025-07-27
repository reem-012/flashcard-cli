#!/usr/bin/env node
import { render } from 'ink';
import React from 'react';
import { App } from './components/App.js';
import * as path from 'path';
import * as fs from 'fs';
import { createNewDeck, saveDeck } from './utils/deckManager.js';

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('Usage:');
  console.error('  flashcard-cli <deck.json>           Load and study an existing deck');
  console.error('  flashcard-cli -n <new_deck.json>    Create a new deck and start adding cards');
  console.error('');
  console.error('Examples:');
  console.error('  flashcard-cli my-deck.json');
  console.error('  flashcard-cli -n spanish-vocab.json');
  process.exit(1);
}

async function main() {
  let deckPath: string;

  // Check if user wants to create a new deck
  if (args[0] === '-n') {
    if (args.length < 2) {
      console.error('Error: Please specify a filename for the new deck');
      console.error('Example: flashcard-cli -n my-new-deck.json');
      process.exit(1);
    }

    deckPath = path.resolve(args[1]);

    // Check if file path has .json extension
    if (!deckPath.endsWith('.json')) {
      console.error('Error: Deck file must have .json extension');
      process.exit(1);
    }

    // Check if file already exists
    if (fs.existsSync(deckPath)) {
      console.error(`Error: File '${deckPath}' already exists`);
      console.error('Please choose a different filename or delete the existing file');
      process.exit(1);
    }

    // Create and save new deck
    try {
      const newDeck = createNewDeck('New Flashcard Deck', '');
      await saveDeck(deckPath, newDeck);
      console.log(`Created new deck: ${deckPath}`);
    } catch (error) {
      console.error(`Error creating new deck: ${(error as Error).message}`);
      process.exit(1);
    }
  } else {
    // Normal mode - load existing deck
    deckPath = path.resolve(args[0]);

    // Check if file path has .json extension
    if (!deckPath.endsWith('.json')) {
      console.error('Error: Deck file must have .json extension');
      process.exit(1);
    }
  }

  // Render the app
  render(React.createElement(App, { deckPath }));
}

main();