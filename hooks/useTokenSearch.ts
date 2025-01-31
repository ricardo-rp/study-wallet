import { useCoinGeckoApi } from "@/hooks/useCoinGeckoApi";
import { useDeferredValue } from "react";
import { TokenMarketsResult } from "./useTokenMarkets";

type TokenSearchResult = {
  id: string;
  symbol: string;
  name: string;
  large: string;
};

export const useTokenSearch = (
  query: string,
  cachedTokens: TokenMarketsResult[],
) => {
  const deferredQuery = useDeferredValue(query);

  const { data: searchResults, ...rest } = useCoinGeckoApi<{
    coins: TokenSearchResult[];
  }>(
    deferredQuery.trim() !== ""
      ? { route: `/search?query=${deferredQuery}` }
      : { enabled: false },
  );

  const data = cachedTokens.filter((cachedToken) =>
    searchResults === undefined
      ? undefined
      : searchResults.coins.some(
          (resultToken) => resultToken.id === cachedToken.id,
        ),
  );

  return { ...rest, data };
};
