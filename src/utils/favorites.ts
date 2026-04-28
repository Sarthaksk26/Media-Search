// Simple favorites utility for localStorage management

const FAVORITES_KEY = 'media-favorites';

// Get all favorite IDs
export const getFavorites = (): string[] => {
  try {
    const favorites = localStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error reading favorites:', error);
    return [];
  }
};

// Add item to favorites
export const addToFavorites = (itemId: string): void => {
  try {
    const favorites = getFavorites();
    if (!favorites.includes(itemId)) {
      favorites.push(itemId);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
  } catch (error) {
    console.error('Error adding to favorites:', error);
  }
};

// Remove item from favorites
export const removeFromFavorites = (itemId: string): void => {
  try {
    const favorites = getFavorites();
    const newFavorites = favorites.filter((id: string) => id !== itemId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
  } catch (error) {
    console.error('Error removing from favorites:', error);
  }
};

// Check if item is favorite
export const isFavorite = (itemId: string): boolean => {
  try {
    const favorites = getFavorites();
    return favorites.includes(itemId);
  } catch (error) {
    console.error('Error checking favorite:', error);
    return false;
  }
};

// Toggle favorite status
export const toggleFavorite = (itemId: string): boolean => {
  try {
    if (isFavorite(itemId)) {
      removeFromFavorites(itemId);
      return false;
    } else {
      addToFavorites(itemId);
      return true;
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return false;
  }
};

// Clear all favorites
export const clearFavorites = (): void => {
  try {
    localStorage.removeItem(FAVORITES_KEY);
  } catch (error) {
    console.error('Error clearing favorites:', error);
  }
};