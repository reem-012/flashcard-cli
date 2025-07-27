# CLAUDE.md - AI Assistant Context for Flashcard CLI

## Project Overview
You are working on a TypeScript-based Terminal User Interface (TUI) flashcard application. This app helps users study using spaced repetition algorithms through an interactive command-line interface built with Ink (React for CLIs).

## Key Project Files
- `README.md` - Project overview and user documentation
- `docs/ARCHITECTURE.md` - Technical architecture and module design
- `docs/DATA_STRUCTURE.md` - JSON deck file format specification
- `IMPLEMENTATION_PLAN.md` - Detailed implementation roadmap

## Current Project State
- Documentation phase complete
- Ready for implementation
- Following Test-Driven Development (TDD) approach

## Technology Stack
- **Language**: TypeScript
- **Runtime**: Node.js
- **UI Framework**: Ink (React for CLIs)
- **Testing**: Jest
- **Key Libraries**: uuid (for card IDs), date-fns (for date handling)

## Architecture Summary
The project follows a three-layer architecture:
1. **Entry Point** (`src/index.ts`) - CLI argument parsing and app initialization
2. **UI Layer** (`src/components/`) - Ink/React components for terminal UI
3. **Logic Layer** (`src/utils/`) - Pure business logic, testable in isolation

## Core Features to Implement
1. **Deck Management** - Load/save JSON deck files
2. **Study Sessions** - Quiz users on due cards using spaced repetition
3. **Card Operations** - Add, edit, delete flashcards
4. **Spaced Repetition** - Algorithm to optimize review intervals
5. **Interactive TUI** - Full keyboard navigation with Ink

## Implementation Guidelines

### Code Style
- Use TypeScript strict mode
- Prefer functional components with hooks
- Keep logic and UI separated
- Write tests before implementation (TDD)

### Spaced Repetition Algorithm
- **Easy**: interval × 2.5
- **Medium**: interval × 1.5  
- **Hard**: reset to 1 day
- New cards start with interval 0

### File Structure
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

### Testing Requirements
- Unit test all logic modules
- Mock file system operations
- Test component state transitions
- Aim for >80% code coverage

### Key Commands to Run
```bash
npm install          # Install dependencies
npm run build       # Compile TypeScript
npm test            # Run Jest tests
npm run dev         # Development mode
node dist/index.js <deck.json>  # Run the app
```

## Common Tasks

### Adding a New Feature
1. Update types in `src/types/index.ts` if needed
2. Write tests for the logic
3. Implement logic in `src/utils/`
4. Create/update UI components
5. Integrate with App component
6. Test the full flow

### Debugging Tips
- Check JSON file format matches spec in DATA_STRUCTURE.md
- Verify file paths are absolute, not relative
- Use console.error for error messages (Ink renders to stdout)
- Test logic modules in isolation first

## Important Considerations
- **Auto-save**: Save deck after each modification
- **Error Handling**: Graceful fallbacks for file errors
- **User Experience**: Clear navigation, helpful error messages
- **Performance**: Efficient for decks with 1000+ cards

## Next Steps When Starting Implementation
1. Run `npm init` and set up package.json
2. Install dependencies
3. Create tsconfig.json
4. Set up Jest configuration
5. Create directory structure
6. Start with types and logic layer (TDD)

## Questions Already Addressed
- Use SM-2 variant for spaced repetition
- Prioritize overdue cards, then new cards
- Auto-save after each interaction
- Show answer on spacebar press
- Use number keys (1-3) for difficulty rating