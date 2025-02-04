import { fetchFromCoinGecko } from "@/hooks/useCoinGeckoApi";
import { TokenMarketsResult, useTokenMarkets } from "@/hooks/useTokenMarkets";
import { neverCall } from "@/utils";
import React, {
  createContext,
  useReducer,
  useEffect,
  ReactNode,
  Dispatch,
  useContext,
} from "react";

export { ExchangeProvider, useExchangeContext };

type TokenPrices = "loading" | { A: number; B: number };
type ExchangeState = {
  tokenAId: string;
  tokenBId: string;
  tokenPrices: TokenPrices;
  tokenAAmount: number;
  tokenBAmount: number;
};

const initialState: ExchangeState = {
  tokenAId: "bitcoin",
  tokenBId: "tether",
  tokenPrices: "loading",
  tokenAAmount: 0,
  tokenBAmount: 0,
};

type ExchangeAction =
  | { type: "SET_TOKEN_A_ID"; payload: { tokenAId: string } }
  | { type: "SET_TOKEN_B_ID"; payload: { tokenBId: string } }
  | { type: "SET_PRICES"; payload: { tokenPrices: TokenPrices } }
  | { type: "SET_TOKEN_A_AMOUNT"; payload: { newAmount: number } }
  | { type: "SET_TOKEN_B_AMOUNT"; payload: { newAmount: number } };

function reducer(
  state: ExchangeState,
  { type, payload }: ExchangeAction,
): ExchangeState {
  switch (type) {
    case "SET_TOKEN_A_ID": {
      return { ...state, tokenAId: payload.tokenAId, tokenPrices: "loading" };
    }

    case "SET_TOKEN_B_ID": {
      return { ...state, tokenBId: payload.tokenBId, tokenPrices: "loading" };
    }

    case "SET_PRICES": {
      return { ...state, tokenPrices: payload.tokenPrices };
    }
    case "SET_TOKEN_A_AMOUNT": {
      if (state.tokenPrices === "loading") return state;
      const { newAmount } = payload;
      const { A, B } = state.tokenPrices;
      const tokenBAmount = (newAmount * A) / B;
      return { ...state, tokenAAmount: newAmount, tokenBAmount };
    }

    case "SET_TOKEN_B_AMOUNT": {
      if (state.tokenPrices === "loading") return state;
      const { newAmount } = payload;
      const { A, B } = state.tokenPrices;
      const tokenAAmount = (newAmount * B) / A;
      return { ...state, tokenBAmount: newAmount, tokenAAmount };
    }

    default: {
      return neverCall(type, state);
    }
  }
}

type ExchangeContextValue = {
  dispatch: Dispatch<ExchangeAction>;
  marketsData: "loading" | TokenMarketsResult[];
  tokenA: { id: string; amount: number; price: number | "loading" };
  tokenB: { id: string; amount: number; price: number | "loading" };
};

const ExchangeContext = createContext<ExchangeContextValue>(
  {} as ExchangeContextValue,
);

/**
 * fetchPrices is a pure function that receives a tokenAId and tokenBId,
 * fetches their USD prices and returns a Promise of type TokenPrices.
 */
async function fetchPrices(tokenAId: string, tokenBId: string) {
  const route = `/simple/price?ids=${tokenAId}%2C${tokenBId}&vs_currencies=usd`;
  const data = await fetchFromCoinGecko<Record<string, { usd: number }>>(route);

  const tokenAPrice = data[tokenAId].usd;
  const tokenBPrice = data[tokenBId].usd;

  return { A: tokenAPrice, B: tokenBPrice };
}

type ExchangeProviderProps = { children: ReactNode; defaultTokenAId: string };

const ExchangeProvider: React.FC<ExchangeProviderProps> = ({
  children,
  defaultTokenAId,
}) => {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    tokenAId: defaultTokenAId,
  });
  const { tokenAId, tokenBId } = state;

  useEffect(() => {
    fetchPrices(tokenAId, tokenBId).then((tokenPrices) => {
      dispatch({ type: "SET_PRICES", payload: { tokenPrices } });
    });
  }, [tokenAId, tokenBId]);

  const { data: marketsData } = useTokenMarkets();

  return (
    <ExchangeContext.Provider
      value={{
        dispatch,
        marketsData: marketsData ?? "loading",
        tokenA: {
          id: state.tokenAId,
          amount: state.tokenAAmount,
          price:
            state.tokenPrices === "loading" ? "loading" : state.tokenPrices.A,
        },
        tokenB: {
          id: state.tokenBId,
          amount: state.tokenBAmount,
          price:
            state.tokenPrices === "loading" ? "loading" : state.tokenPrices.B,
        },
      }}
    >
      {children}
    </ExchangeContext.Provider>
  );
};

const useExchangeContext = () => useContext(ExchangeContext);
