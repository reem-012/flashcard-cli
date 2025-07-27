#!/usr/bin/env node
import { render } from 'ink';
import React from 'react';
import { App } from './components/App';
import * as path from 'path';

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('Usage: flashcard-cli <deck.json>');
  console.error('');
  console.error('Example:');
  console.error('  flashcard-cli my-deck.json');
  process.exit(1);
}

const deckPath = path.resolve(args[0]);

// Check if file path has .json extension
if (!deckPath.endsWith('.json')) {
  console.error('Error: Deck file must have .json extension');
  process.exit(1);
}

// Render the app
render(React.createElement(App, { deckPath }));