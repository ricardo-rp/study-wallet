export type { TokenInfo, TokenDetails };

type TokenInfo = {
  id: string;
  symbol: string;
  name: string;
};

type TokenDetails = TokenInfo & {
  market_data: {
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
