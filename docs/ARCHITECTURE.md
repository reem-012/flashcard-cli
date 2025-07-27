# Application Architecture

This document describes the architecture of the Flashcard CLI, a TUI application built with TypeScript and Ink. The architecture is designed to be modular, separating UI components from business logic to facilitate Test-Driven Development (TDD) and future modifications.

---

## Core Modules

The application is broken down into three primary layers: the **Entry Point**, the **UI Layer (Components)**, and the **Logic Layer (Utils)**.

1.  **Entry Point (`src/index.ts`)**
    * **Responsibility**: The initial script that runs when the user executes the command.
    * **Tasks**:
        * Parses the command-line arguments to get the deck file path.
        * Performs initial validation (e.g., checks if a file path was provided).
        * Renders the main Ink component (`<App />`) and passes the file path as an initial prop.

2.  **UI Layer (`src/components/`)**
    * **Responsibility**: Manages all user-facing terminal interactions. This layer is built entirely with **Ink** and React functional components.
    * **Component Breakdown**:
        * `<App />`: The root component. It manages the application's global state, such as which view is active (main menu, study session, etc.) and holds the loaded deck data.
        * `<MainMenu />`: Displays the primary navigation options: "Study," "Add," "Edit," etc. It receives functions from `<App />` to switch to other views.
        * `<StudySession />`: Manages the entire quiz flow. It receives a list of cards to study, displays them one by one, and captures user input for difficulty.
        * `<EditCardList />`: Fetches and displays all cards in a navigable list, allowing the user to select one to edit or delete.
        * `<CardForm />`: A reusable form component for both adding a new card and editing an existing one.

3.  **Logic Layer (`src/utils/`)**
    * **Responsibility**: Contains all the business logic, completely decoupled from the UI. These modules can be tested independently.
    * **Module Breakdown**:
        * `deckManager.ts`: Handles all file system interactions. It will contain functions for `loadDeck(filePath)` and `saveDeck(filePath, data)`. This isolates file I/O.
        * `repetition.ts`: Implements the spaced repetition algorithm. It will contain pure functions that take a card and a user's answer ("Hard," "Medium," "Easy") to calculate the `nextReview` date and `repetitionInterval`.
        * `scheduler.ts`: Contains the logic to select which cards should appear in a new study session, based on their `nextReview` date and the deck's settings.

---

## Data Flow

The application follows a unidirectional data flow, which is managed by the root `<App />` component.

1.  **Initialization**:
    * `index.ts` starts the Ink application, passing the `deck_file.json` path to `<App />`.
    * `<App />`'s `useEffect` hook calls `deckManager.loadDeck()` to read the JSON file into a React state variable (`const [deck, setDeck] = useState(...)`).

2.  **User Interaction**:
    * The user interacts with a UI component (e.g., clicks "Easy" in `<StudySession />`).
    * The component calls a handler function passed down as a prop from `<App />` (e.g., `handleCardAnswered(cardId, 'easy')`).

3.  **State Update & Persistence**:
    * The handler function in `<App />` calculates the changes (using logic from `repetition.ts`).
    * It updates the main `deck` state using `setDeck(...)`. This triggers a re-render of the UI with the new data.
    * After the state is updated, an effect calls `deckManager.saveDeck()` to persist the entire updated `deck` object back to the JSON file, ensuring data is always saved.