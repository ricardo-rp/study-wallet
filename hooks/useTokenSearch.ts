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
  wholeList: TokenMarketsResult,
) => {
  const [debouncedQuery] = useDebounce(query.trim(), 300);

  return useCoinGeckoApi<{ coins: TokenSearchResult[] }>(
    debouncedQuery
      ? { route: `/search?query=${debouncedQuery}` }
      : { enabled: false },
  );
};
