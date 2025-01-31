import { useMemo } from "react";
import { useCoinGeckoApi } from "@/hooks/useCoinGeckoApi";
import type { TokenInfo } from "@/types/domain";
import { useFavorites } from "./useFavorites";
import { useDebounce } from "./useDebounce";

export const useTokenSearch = (query: string) => {
  const [debouncedQuery] = useDebounce(query.trim(), 300);

  // Always fetch complete list for favorites
  const {
    data: allTokens,
    isLoading: allLoading,
    error: allError,
  } = useCoinGeckoApi<TokenInfo[]>({ route: "/coins/markets?vs_currency=usd" });

  // Conditional search API call
  const {
    data: searchResults,
    isLoading: searchLoading,
    error: searchError,
  } = useCoinGeckoApi<{ coins: TokenInfo[] }>(
    debouncedQuery
      ? { route: `/search?query=${debouncedQuery}` }
      : { enabled: false }
  );

  const { favoriteIds: favorites } = useFavorites();

  // All favorites
  const [favoritedElements, allNonFavorites] = useMemo(() => {
    if (!allTokens) return [[], []];

    const favoritedElements = [];
    const allNonFavorites = [];

    for (const token of allTokens) {
      if (favorites.includes(token.id)) favoritedElements.push(token);
      else allNonFavorites.push(token);
    }

    return [favoritedElements, allNonFavorites];
  }, [allTokens, favorites]);

  // Search results (excluding favorites)
  const searchResultsElements = useMemo(() => {
    if (!searchResults) return [];
    return searchResults.coins.filter((token) => !favorites.includes(token.id));
  }, [searchResults, favorites]);

  return {
    data: [
      favoritedElements,
      debouncedQuery ? searchResultsElements : allNonFavorites,
    ],
    isLoading: allLoading || searchLoading,
    error: allError || searchError,
  } as const;
};
