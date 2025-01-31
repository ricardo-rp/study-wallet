import { useCoinGeckoApi } from "@/hooks/useCoinGeckoApi";
import type { TokenInfo } from "@/types/domain";
import { useDebounce } from "./useDebounce";

export const useTokenSearch = (query: string) => {
  const [debouncedQuery] = useDebounce(query.trim(), 300);
  return useCoinGeckoApi<{ coins: TokenInfo[] }>(
    debouncedQuery
      ? { route: `/search?query=${debouncedQuery}` }
      : { enabled: false },
  );
};
