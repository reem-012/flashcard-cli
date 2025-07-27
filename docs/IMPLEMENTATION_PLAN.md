# Flashcard CLI Implementation Plan

## Project Overview
A terminal-based flashcard application using TypeScript, Node.js, and Ink (React for CLIs) with spaced repetition algorithm for optimized studying.

## Implementation Phases

### Phase 1: Project Setup & Core Infrastructure
1. **Initialize TypeScript Project**
   - Set up package.json with dependencies (typescript, ink, react, uuid, date-fns)
   - Configure tsconfig.json for Node.js target
   - Set up Jest for testing
   - Create directory structure as per architecture:
     ```
     src/
     ├── index.ts
     ├── components/
     │   ├── App.tsx
     │   ├── MainMenu.tsx
     │   ├── StudySession.tsx
     │   ├── EditCardList.tsx
     │   └── CardForm.tsx
     ├── utils/
     │   ├── deckManager.ts
     │   ├── repetition.ts
     │   └── scheduler.ts
     └── types/
         └── index.ts
     ```

2. **Create Type Definitions** (`src/types/index.ts`)
   ```typescript
   interface Card {
     id: string;
     question: string;
     answer: string;
     lastReviewed: string | null;
     nextReview: string | null;
     repetitionInterval: number;
   }
   
   interface Meta {
     deckName: string;
     studySessionSize: number;
   }
   
   interface Deck {
     meta: Meta;
     cards: Card[];
   }
   
   type DifficultyRating = 'easy' | 'medium' | 'hard';
   ```

### Phase 2: Logic Layer Implementation

1. **Deck Manager Module** (`src/utils/deckManager.ts`)
   ```typescript
   // Core functions:
   loadDeck(filePath: string): Promise<Deck>
   saveDeck(filePath: string, deck: Deck): Promise<void>
   validateDeck(data: any): data is Deck
   ```
   - Implement robust error handling for file operations
   - Validate JSON structure against expected schema
   - Handle missing or corrupted files gracefully

2. **Spaced Repetition Module** (`src/utils/repetition.ts`)
   ```typescript
   // Core algorithm implementation
   calculateNextReview(card: Card, difficulty: DifficultyRating): Card
   ```
   - **Algorithm Details**:
     - Easy: `interval = previousInterval * 2.5`
     - Medium: `interval = previousInterval * 1.5`
     - Hard: `interval = 1` (reset to 1 day)
     - New cards start with interval = 0
   - Update `lastReviewed` to current timestamp
   - Calculate `nextReview` based on new interval

3. **Scheduler Module** (`src/utils/scheduler.ts`)
   ```typescript
   getCardsForSession(deck: Deck, sessionSize: number): Card[]
   isCardDue(card: Card): boolean
   ```
   - **Priority System**:
     1. Overdue cards (sorted by how overdue they are)
     2. New cards (never reviewed)
     3. Future cards if needed to fill session
   - Never exceed `sessionSize` limit

### Phase 3: UI Components Implementation

1. **App Component** (`src/components/App.tsx`)
   - **State Management**:
     ```typescript
     const [deck, setDeck] = useState<Deck | null>(null);
     const [currentView, setCurrentView] = useState<'menu' | 'study' | 'add' | 'edit'>('menu');
     const [error, setError] = useState<string | null>(null);
     ```
   - Load deck on mount using `useEffect`
   - Auto-save deck after any modification
   - Handle navigation between views

2. **Main Menu Component** (`src/components/MainMenu.tsx`)
   - Use Ink's `SelectInput` for navigation
   - Options:
     - Study (show count of due cards)
     - Add Card
     - Edit Cards
     - Settings
     - Quit (Ctrl+C)

3. **Study Session Component** (`src/components/StudySession.tsx`)
   - **Features**:
     - Display question first
     - Press SPACE to reveal answer
     - Show difficulty options (1=Hard, 2=Medium, 3=Easy)
     - Progress indicator (e.g., "Card 3/10")
     - Session summary at end

4. **Card Management Components**
   - **CardForm.tsx**:
     - Text inputs for question and answer
     - Validation (non-empty fields)
     - Cancel option
   - **EditCardList.tsx**:
     - Scrollable list of all cards
     - Search/filter functionality
     - Options: Edit, Delete, Back
     - Confirmation for delete

### Phase 4: Entry Point & CLI

1. **CLI Entry** (`src/index.ts`)
   ```typescript
   #!/usr/bin/env node
   
   // Parse command line arguments
   // Validate deck file exists
   // Initialize Ink app with file path
   ```
   - Show usage if no file provided
   - Handle file not found gracefully
   - Support relative and absolute paths

### Phase 5: Testing & Polish

1. **Unit Tests**
   - **Logic Layer**:
     - Test spaced repetition calculations
     - Test card scheduling logic
     - Test file I/O with mocked fs
   - **Components**:
     - Test state transitions
     - Test user interactions
     - Mock Ink testing utilities

2. **Integration Tests**
   - Full flow: Load deck → Study → Save
   - Error scenarios (corrupted files, etc.)

3. **Error Handling**
   - File write failures → Keep in-memory changes
   - Invalid JSON → Show helpful error
   - Missing required fields → Provide defaults

## Technical Decisions

- **State Management**: React hooks (useState, useEffect) in App component
- **File I/O**: Async/await with try-catch blocks
- **Key Bindings**: 
  - Arrow keys for navigation
  - Enter for selection
  - ESC for back/cancel
  - Numbers for difficulty rating
- **Auto-save**: Debounced save after 500ms of inactivity

## Implementation Order

1. Set up project structure and dependencies
2. Implement types and interfaces
3. Build logic layer with tests
4. Create basic App shell with routing
5. Implement MainMenu
6. Add StudySession functionality
7. Build card management features
8. Polish CLI entry point
9. Add comprehensive error handling
10. Write documentation

## Assumptions for MVP

- Single-user, local file system only
- Plain text cards (no markdown/formatting)
- No undo/redo functionality
- No import/export beyond JSON
- No statistics or progress graphs
- English-only interface

## Next Steps After MVP

- Add markdown support for cards
- Implement statistics dashboard
- Multi-deck management
- Import from Anki/CSV
- Customizable repetition parameters
- Theme customization
- Cloud sync capability