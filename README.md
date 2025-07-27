# Flashcard CLI

A Terminal User Interface (TUI) flashcard application for studying directly in your terminal. This application uses JSON files for deck management and incorporates a simple spaced repetition algorithm to optimize your study sessions.

## Features

- 📚 **Deck Management**: Load and save flashcard decks as JSON files
- 🧠 **Spaced Repetition**: Built-in algorithm to optimize review intervals
- 🎯 **Interactive TUI**: Full keyboard navigation with Ink (React for CLIs)
- ✅ **Study Sessions**: Review cards with difficulty-based scheduling
- ➕ **Card Management**: Add, edit, and delete flashcards
- 💾 **Auto-save**: Automatic deck saving after each modification

## Installation

```bash
npm install
npm run build
```

## Usage

### Development Mode
```bash
# Using npm script (recommended)
npm run start example-deck.json

# Alternative with tsx directly  
npx tsx src/index.ts example-deck.json
```

### Production Mode
```bash
npm run build
node dist/index.js example-deck.json
```

### Testing Core Functionality
```bash
# Run all tests
npm test

# Test core modules (works in any environment)
node test-app.js
```

### Command Line
```bash
flashcard-cli <deck.json>
```

## Deck File Format

Decks are stored as JSON files with the following structure:

```json
{
  "name": "My Deck",
  "description": "Description of the deck",
  "cards": [
    {
      "id": "unique-id",
      "front": "Question",
      "back": "Answer", 
      "interval": 0,
      "lastReviewed": null,
      "nextReview": null
    }
  ],
  "created": "2024-01-15T00:00:00.000Z",
  "modified": "2024-01-15T00:00:00.000Z"
}
```

## Spaced Repetition Algorithm

The application uses a variant of the SM-2 algorithm:

- **Easy** (3): Interval × 2.5
- **Medium** (2): Interval × 1.5  
- **Hard** (1): Reset to 1 day
- **New cards**: Start with interval 0

## Controls

### Main Menu
- Arrow keys: Navigate menu
- Enter: Select option
- q: Quit

### Study Session
- Space: Reveal answer
- 1: Mark as Hard (reset interval)
- 2: Mark as Medium (1.5x interval)
- 3: Mark as Easy (2.5x interval)
- ESC: Exit to menu

### Card Management
- Arrow keys: Navigate cards
- Enter: Edit selected card
- Delete: Delete selected card
- Tab: Switch between form fields
- ESC: Cancel/Go back

## Development

### Running Tests
```bash
npm test
npm run test:watch
npm run test:coverage
```

### Type Checking
```bash
npm run typecheck
```

### Linting
```bash
npm run lint
```

## Project Structure

```
src/
├── index.ts              # CLI entry point
├── types/
│   └── index.ts         # TypeScript interfaces
├── components/          # Ink UI components
│   ├── App.tsx         # Root component with state
│   ├── MainMenu.tsx    # Navigation menu
│   ├── StudySession.tsx # Card review interface
│   ├── CardForm.tsx    # Add/edit card form
│   └── EditCardList.tsx # Card list manager
└── utils/              # Business logic
    ├── deckManager.ts  # File I/O operations
    ├── repetition.ts   # Spaced repetition algorithm
    └── scheduler.ts    # Card scheduling logic
```

## Technologies Used

- **TypeScript**: Strongly typed JavaScript
- **React + Ink**: UI framework for terminal applications
- **Jest**: Testing framework
- **date-fns**: Date manipulation
- **uuid**: Unique ID generation

## License

MIT

## Example

Try the application with the included example deck:

```bash
# Full TUI experience (requires proper terminal)
npm run start example-deck.json

# Test core functionality (works anywhere)
node test-app.js
```

## Environment Notes

The TUI interface requires a terminal with raw mode support. In some environments (like web-based terminals), you may see a "Raw mode is not supported" error. The core functionality still works perfectly - use `node test-app.js` to verify all business logic is working correctly.