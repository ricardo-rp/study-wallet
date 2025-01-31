import { useCoinGeckoApi } from "@/hooks/useCoinGeckoApi";
import { useDebounce } from "./useDebounce";
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
  const [debouncedQuery] = useDebounce(query.trim(), 300);

  const { data: searchResults, ...rest } = useCoinGeckoApi<{
    coins: TokenSearchResult[];
  }>(
    debouncedQuery
      ? { route: `/search?query=${debouncedQuery}` }
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
