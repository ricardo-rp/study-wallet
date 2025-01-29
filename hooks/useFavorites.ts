import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITES_KEY = "favorites";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load favorites on mount
  useEffect(() => {
    AsyncStorage.getItem(FAVORITES_KEY)
      .then((stored) => stored !== null && setFavorites(JSON.parse(stored)))
      .catch((e) => console.error("Failed to load favorites:", e));
  }, []);

  const toggleFavorite = useCallback(
    (tokenId: string) => {
      const updatedFavorites = favorites.includes(tokenId)
        ? favorites.filter((id) => id !== tokenId)
        : [...favorites, tokenId];

      setFavorites(updatedFavorites);
      AsyncStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(updatedFavorites)
      ).catch((error) => console.error("Failed to toggle favorite:", error));
    },
    [favorites]
  );

  // Check if a token is favorited
  const isFavorited = useCallback(
    (tokenId: string) => favorites.includes(tokenId),
    [favorites]
  );

  return { favorites, toggleFavorite, isFavorited };
};
