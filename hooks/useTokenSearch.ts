import { useDeferredValue, useMemo } from "react";
import { useCoinGeckoApi } from "@/hooks/useCoinGeckoApi";
import type { TokenInfo } from "@/types/domain";
import { useFavorites } from "./useFavorites";

export const useTokenSearch = (searchQuery: string) => {
  const { data, isLoading, error } =
    useCoinGeckoApi<TokenInfo[]>("/coins/list");

  const deferredQuery = useDeferredValue(searchQuery);

  const filteredTokens = useMemo(() => {
    if (!data) return [];

    return filterTokens(data, deferredQuery);
  }, [data, deferredQuery]);

  const { favorites } = useFavorites();
  const [favoritedElements, rest] = useMemo(() => {
    const favorited: TokenInfo[] = [];
    const rest: TokenInfo[] = [];

    for (const token of filteredTokens) {
      if (favorites.includes(token.id)) favorited.push(token);
      else rest.push(token);
    }

    return [favorited, rest];
  }, [filteredTokens, favorites]);

  return {
    data: [favoritedElements, rest],
    isLoading,
    error,
  } as const;
};

const filterTokens = (tokens: TokenInfo[], query: string): TokenInfo[] => {
  const lowerQuery = query.trim().toLowerCase();
  if (!lowerQuery) return tokens;

  return tokens.filter((token) =>
    [token.name, token.symbol, token.id]
      .map((field) => field.toLowerCase())
      .some((field) => field.includes(lowerQuery))
  );
};
