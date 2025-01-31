import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";

export { useFavoriteIds as useFavoriteIds };

const FAVORITES_KEY = "favorites";
const FAVORITES_QUERY_KEY = ["async-storage-favorites"];

// Helper functions for AsyncStorage operations
const fetchFavorites = async (): Promise<string[]> => {
  const stored = await AsyncStorage.getItem(FAVORITES_KEY);
  return stored ? JSON.parse(stored) : [];
};

const persistFavorites = (favorites: string[]): Promise<void> =>
  AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));

const useFavoriteIds = () => {
  const queryClient = useQueryClient();

  // Query for fetching favorites
  const { data: favoriteIds = [] } = useQuery<string[]>({
    queryKey: FAVORITES_QUERY_KEY,
    queryFn: fetchFavorites,
    // Disable background refetching since we're managing local storage
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  // Mutation for toggling favorites
  const { mutate: toggleFavorite } = useMutation({
    mutationFn: async (tokenId: string) => {
      const updatedFavorites = favoriteIds.includes(tokenId)
        ? favoriteIds.filter((id) => id !== tokenId)
        : [...favoriteIds, tokenId];

      await persistFavorites(updatedFavorites);
      return updatedFavorites;
    },
    onMutate: async (tokenId: string) => {
      // Optimistic update
      const newFavorites = favoriteIds.includes(tokenId)
        ? favoriteIds.filter((id) => id !== tokenId)
        : [...favoriteIds, tokenId];

      queryClient.setQueryData(FAVORITES_QUERY_KEY, newFavorites);
      return { favoriteIds }; // pass as context so it can be reverted on error
    },
    onError: (err, _, context) => {
      // Rollback on error
      queryClient.setQueryData(FAVORITES_QUERY_KEY, context?.favoriteIds);
      console.error("Failed to toggle favorite:", err);
    },
  });

  // Check if a token is favorited
  const isFavorited = (tokenId: string) => favoriteIds.includes(tokenId);

  return {
    favoriteIds,
    toggleFavorite,
    isFavorited,
  };
};
