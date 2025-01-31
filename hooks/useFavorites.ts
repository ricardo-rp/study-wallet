import { useMemo } from "react";
import { useFavoriteIds } from "./useFavoriteIds";
import { TokenMarketsResult, useTokenMarkets } from "./useTokenMarkets";

export { useFavorites };

const useFavorites = (cachedTokens: TokenMarketsResult[]) => {
  const { favoriteIds } = useFavoriteIds();

  // All favorites
  const favoritedElements = useMemo(
    () => cachedTokens.filter((token) => favoriteIds.includes(token.id)),
    [cachedTokens, favoriteIds],
  );

  return { data: favoritedElements } as const;
};
