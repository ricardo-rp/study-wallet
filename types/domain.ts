export type { TokenInfo, TokenDetails };

type TokenInfo = {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  image: string;
};

type TokenDetails = {
  id: string;
  symbol: string;
  name: string;
  image: { large: string; small: string; thumb: string };
  market_data: {
    current_price: PriceObject;
    market_cap: PriceObject;
    high_24h: PriceObject;
    low_24h: PriceObject;
    ath: PriceObject;
    atl: PriceObject;
  };
};

/**
 * Most "price"-related values from CoinGecko API come in this format.
 */
type PriceObject = { usd: number; btc: number; eur: number };
