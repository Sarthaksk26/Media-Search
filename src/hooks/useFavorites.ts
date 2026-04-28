import { useState, useEffect } from 'react';
import { type SearchResult } from '../redux/features/searchSlice';
import { getFavorites } from '../utils/favorites';

// Hook to get favorite items from search results
export const useFavoriteItems = (allResults: SearchResult[]) => {
  const [favoriteItems, setFavoriteItems] = useState<SearchResult[]>([]);

  useEffect(() => {
    // Get favorite IDs from localStorage
    const favoriteIds = getFavorites();
    
    // Filter all results to get only favorites
    const favorites = allResults.filter(item => favoriteIds.includes(item.id));
    
    setFavoriteItems(favorites);
  }, [allResults]);

  return favoriteItems;
};

// Hook to check if we have any favorites
export const useHasFavorites = () => {
  const [hasFavorites, setHasFavorites] = useState(false);

  useEffect(() => {
    const favorites = getFavorites();
    setHasFavorites(favorites.length > 0);
  }, []);

  return hasFavorites;
};