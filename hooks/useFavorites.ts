import { useMemo } from "react";
import { useCoinGeckoApi } from "@/hooks/useCoinGeckoApi";
import type { TokenInfo } from "@/types/domain";
import { useFavoriteIds } from "./useFavoriteIds";

export { useFavorites };

const useFavorites = () => {
  const { data, isLoading, error } = useCoinGeckoApi<TokenInfo[]>({
    route: "/coins/markets?vs_currency=usd",
  });

  const { favoriteIds } = useFavoriteIds();

  // All favorites
  const favoritedElements = useMemo(
    () => data?.filter((token) => favoriteIds.includes(token.id)),
    [data, favoriteIds],
  );

  return { data: favoritedElements, isLoading, error } as const;
};
