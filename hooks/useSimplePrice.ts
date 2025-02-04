import { useCoinGeckoApi } from "./useCoinGeckoApi";

export { useSimplePrice };

type SimplePriceResponse = Record<string, { usd: number }>;

const useSimplePrice = (tokenAId: string, tokenBId: string) =>
  useCoinGeckoApi<SimplePriceResponse>({
    route: `/simple/price?ids=${tokenAId}%2c${tokenBId}&vs_currencies=usd`,
    refetchInterval: 60 * 1000, // 60 seconds in milis
  });
