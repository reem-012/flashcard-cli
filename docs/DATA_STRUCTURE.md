# Deck JSON Data Structure

This document specifies the exact JSON structure for a flashcard deck file. All `.json` deck files used by this application must adhere to this format.

-----

## Root Object

The root of the JSON file must be an object containing two top-level keys: `meta` and `cards`.

| Key     | Type   | Description                               |
| :------ | :----- | :---------------------------------------- |
| `meta`  | Object | Contains metadata and settings for the deck. |
| `cards` | Array  | An array of card objects.                 |

-----

## 1\. The `meta` Object

The `meta` object holds configuration data that applies to the entire deck.

| Key                | Type   | Description                                                                 |
| :----------------- | :----- | :-------------------------------------------------------------------------- |
| `deckName`         | String | The human-readable name of the deck.                                        |
| `studySessionSize` | Number | The maximum number of cards to include in a single "Study" session.         |

-----

## 2\. The `cards` Array

The `cards` key holds an array of card objects. Each object in the array represents a single flashcard and must conform to the following structure.

| Key                  | Type             | Description                                                                                               |
| :------------------- | :--------------- | :-------------------------------------------------------------------------------------------------------- |
| `id`                 | String           | A unique identifier for the card. A UUID is recommended to prevent collisions when adding new cards.      |
| `question`           | String           | The question or prompt displayed to the user.                                                             |
| `answer`             | String           | The answer to the question.                                                                               |
| `lastReviewed`       | String or `null` | The date and time the card was last reviewed, in ISO 8601 format (`YYYY-MM-DDTHH:mm:ssZ`). `null` if never reviewed. |
| `nextReview`         | String or `null` | The calculated date and time for the card's next scheduled review. `null` if it's a new card.              |
| `repetitionInterval` | Number           | The number of days until the next review after the `lastReviewed` date. Used by the repetition algorithm. |

-----

## Example `deck.json` File

```json
{
  "meta": {
    "deckName": "Japanese Vocabulary",
    "studySessionSize": 15
  },
  "cards": [
    {
      "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
      "question": "What is the Japanese word for 'cat'?",
      "answer": "猫 (neko)",
      "lastReviewed": "2025-07-08T14:30:00Z",
      "nextReview": "2025-07-10T14:30:00Z",
      "repetitionInterval": 2
    },
    {
      "id": "b2c3d4e5-f6a7-8901-2345-67890abcdef1",
      "question": "What is the Japanese word for 'dog'?",
      "answer": "犬 (inu)",
      "lastReviewed": "2025-07-09T09:00:00Z",
      "nextReview": "2025-07-09T09:00:00Z",
      "repetitionInterval": 0
    },
    {
      "id": "c3d4e5f6-a7b8-9012-3456-7890abcdef12",
      "question": "What is the Japanese word for 'water'?",
      "answer": "水 (mizu)",
      "lastReviewed": null,
      "nextReview": null,
      "repetitionInterval": 0
    }
  ]
}
```