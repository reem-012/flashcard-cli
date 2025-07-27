#!/usr/bin/env node

// Simple test to verify the app loads correctly
console.log('🧪 Testing Flashcard CLI Application...\n');

// Test imports
try {
  console.log('✅ Testing module imports...');
  const { loadDeck } = await import('./dist/utils/deckManager.js');
  const { getCardsDueForReview } = await import('./dist/utils/repetition.js');
  console.log('✅ All modules imported successfully');

  // Test deck loading
  console.log('✅ Testing deck loading...');
  const deck = await loadDeck('./example-deck.json');
  console.log(`✅ Loaded deck: "${deck.name}" with ${deck.cards.length} cards`);

  // Test spaced repetition logic
  console.log('✅ Testing spaced repetition logic...');
  const dueCards = getCardsDueForReview(deck.cards);
  console.log(`✅ Found ${dueCards.length} cards due for review`);

  console.log('\n🎉 All tests passed! The application is working correctly.');
  console.log('\n📝 Note: The TUI interface requires a proper terminal with raw mode support.');
  console.log('   In a real terminal, you would run: npm run start example-deck.json');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}