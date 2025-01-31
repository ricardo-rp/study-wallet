import { useMemo } from "react";
import { useFavoriteIds } from "./useFavoriteIds";
import { useTokenMarkets } from "./useTokenMarkets";

export { useFavorites };

const useFavorites = () => {
  const { data, isLoading, error } = useTokenMarkets();

  const { favoriteIds } = useFavoriteIds();

  // All favorites
  const favoritedElements = useMemo(
    () => data?.filter((token) => favoriteIds.includes(token.id)),
    [data, favoriteIds],
  );

  return { data: favoritedElements, isLoading, error } as const;
};
