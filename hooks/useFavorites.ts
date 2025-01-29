import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITES_KEY = "favorites";

export const useFavorites = () => {
  const [favoriteIds, setFavorites] = useState<string[]>([]);

  // Load favorites on mount
  useEffect(() => {
    AsyncStorage.getItem(FAVORITES_KEY)
      .then((stored) => stored !== null && setFavorites(JSON.parse(stored)))
      .catch((e) => console.error("Failed to load favorites:", e));
  }, []);

  const toggleFavorite = useCallback(
    (tokenId: string) => {
      const updatedFavorites = favoriteIds.includes(tokenId)
        ? favoriteIds.filter((id) => id !== tokenId)
        : [...favoriteIds, tokenId];

      setFavorites(updatedFavorites);
      AsyncStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(updatedFavorites)
      ).catch((error) => console.error("Failed to toggle favorite:", error));
    },
    [favoriteIds]
  );

  // Check if a token is favorited
  const isFavorited = useCallback(
    (tokenId: string) => favoriteIds.includes(tokenId),
    [favoriteIds]
  );

  return { favoriteIds, toggleFavorite, isFavorited };
};
