import { useDeferredValue, useMemo } from "react";
import { useCoinGeckoApi } from "@/hooks/useCoinGeckoApi";
import type { TokenInfo } from "@/types/domain";

export const useTokenSearch = (searchQuery: string) => {
  const { data, isLoading, error } =
    useCoinGeckoApi<TokenInfo[]>("/coins/list");

  const deferredQuery = useDeferredValue(searchQuery);

  const filteredTokens = useMemo(() => {
    if (!data) return [];

    return filterTokens(data, deferredQuery);
  }, [data, deferredQuery]);

  return {
    filteredTokens,
    isLoading,
    error,
    isEmpty: !isLoading && filteredTokens.length === 0,
  } as const;
};

const filterTokens = (tokens: TokenInfo[], query: string): TokenInfo[] => {
  const lowerQuery = query.trim().toLowerCase();
  if (!lowerQuery) return tokens;

  return tokens.filter(
    (token) =>
      [token.name, token.symbol, token.id]
        .map((field) => field.toLowerCase())
        .some((field) => field.includes(lowerQuery)) // If any field matches, include token in result
  );
};
