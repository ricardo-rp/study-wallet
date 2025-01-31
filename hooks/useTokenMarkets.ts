import { useCoinGeckoApi } from "@/hooks/useCoinGeckoApi";

export { useTokenMarkets, TokenMarketsResult };

type TokenMarketsResult = {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  image: string;
};

const useTokenMarkets = () =>
  useCoinGeckoApi<TokenMarketsResult[]>({
    route: "/coins/markets?vs_currency=usd",
  });
