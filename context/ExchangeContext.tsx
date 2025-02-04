import { fetchFromCoinGecko } from "@/hooks/useCoinGeckoApi";
import { TokenMarketsResult, useTokenMarkets } from "@/hooks/useTokenMarkets";
import { neverCall } from "@/utils";
import React, {
  createContext,
  useReducer,
  useEffect,
  ReactNode,
  useContext,
} from "react";

export { ExchangeProvider, useExchangeContext };

type TokenPrices = "error" | "loading" | { A: number; B: number };
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
  | { type: "SET_TOKEN_A_ID"; payload: { newId: string } }
  | { type: "SET_TOKEN_B_ID"; payload: { newId: string } }
  | { type: "SET_TOKEN_A_AMOUNT"; payload: { newAmount: number } }
  | { type: "SET_TOKEN_B_AMOUNT"; payload: { newAmount: number } }
  | { type: "SET_PRICES"; payload: { tokenPrices: TokenPrices } };

function reducer(
  state: ExchangeState,
  { type, payload }: ExchangeAction,
): ExchangeState {
  switch (type) {
    case "SET_TOKEN_A_ID": {
      return {
        ...state,
        tokenAId: payload.newId,
        tokenAAmount: 0,
        tokenBAmount: 0,
        tokenPrices: "loading",
      };
    }

    case "SET_TOKEN_B_ID": {
      return {
        ...state,
        tokenBId: payload.newId,
        tokenAAmount: 0,
        tokenBAmount: 0,
        tokenPrices: "loading",
      };
    }

    case "SET_PRICES": {
      return { ...state, tokenPrices: payload.tokenPrices };
    }

    case "SET_TOKEN_A_AMOUNT": {
      if (state.tokenPrices === "loading" || state.tokenPrices === "error")
        return state;
      const { newAmount } = payload;
      const { A, B } = state.tokenPrices;
      const tokenBAmount = (newAmount * A) / B;
      return { ...state, tokenAAmount: newAmount, tokenBAmount };
    }

    case "SET_TOKEN_B_AMOUNT": {
      if (state.tokenPrices === "loading" || state.tokenPrices === "error")
        return state;
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
  marketsData: "loading" | "error" | TokenMarketsResult[];
  tokenA: {
    id: string;
    amount: number;
    price: "loading" | "error" | number;
    setId: (tokenId: string) => void;
    setAmount: (amount: number) => void;
  };
  tokenB: {
    id: string;
    amount: number;
    price: "loading" | "error" | number;
    setId: (tokenId: string) => void;
    setAmount: (amount: number) => void;
  };
};

const ExchangeContext = createContext<ExchangeContextValue>(
  {} as ExchangeContextValue,
);

async function fetchPrices(tokenAId: string, tokenBId: string) {
  try {
    const route = `/simple/price?ids=${tokenAId}%2C${tokenBId}&vs_currencies=usd`;
    const data =
      await fetchFromCoinGecko<Record<string, { usd: number }>>(route);

    const tokenAPrice = data[tokenAId].usd;
    const tokenBPrice = data[tokenBId].usd;

    return { A: tokenAPrice, B: tokenBPrice };
  } catch (e) {
    console.error(e);
    return "error" as const;
  }
}

type ExchangeProviderProps = { children: ReactNode; defaultTokenAId: string };

const ExchangeProvider: React.FC<ExchangeProviderProps> = ({
  children,
  defaultTokenAId,
}) => {
  const [
    { tokenAId, tokenAAmount, tokenBId, tokenBAmount, tokenPrices },
    dispatch,
  ] = useReducer(reducer, { ...initialState, tokenAId: defaultTokenAId });

  // Fetch prices on token ID change
  useEffect(() => {
    fetchPrices(tokenAId, tokenBId).then((tokenPrices) => {
      dispatch({ type: "SET_PRICES", payload: { tokenPrices } });
    });
  }, [tokenAId, tokenBId]);

  // Refetch prices every 60 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchPrices(tokenAId, tokenBId).then((tokenPrices) => {
        dispatch({ type: "SET_PRICES", payload: { tokenPrices } });
      });
    }, 60_000);
    return () => clearInterval(intervalId);
  }, [tokenAId, tokenBId]);

  const { data: marketsData, error: marketsDataError } = useTokenMarkets();

  return (
    <ExchangeContext.Provider
      value={{
        marketsData: (() => {
          if (marketsData) return marketsData;
          if (marketsDataError) return "error";
          return "loading";
        })(),
        tokenA: {
          id: tokenAId,
          amount: tokenAAmount,
          price: (() => {
            if (tokenPrices === "error" || tokenPrices === "loading")
              return tokenPrices;
            else return tokenPrices.A;
          })(),
          setId(newId) {
            dispatch({ type: "SET_TOKEN_A_ID", payload: { newId } });
          },
          setAmount(newAmount) {
            dispatch({ type: "SET_TOKEN_A_AMOUNT", payload: { newAmount } });
          },
        },
        tokenB: {
          id: tokenBId,
          amount: tokenBAmount,
          price: (() => {
            if (tokenPrices === "error" || tokenPrices === "loading")
              return tokenPrices;
            else return tokenPrices.B;
          })(),
          setId(newId) {
            dispatch({ type: "SET_TOKEN_B_ID", payload: { newId } });
          },
          setAmount(newAmount) {
            dispatch({ type: "SET_TOKEN_B_AMOUNT", payload: { newAmount } });
          },
        },
      }}
    >
      {children}
    </ExchangeContext.Provider>
  );
};

const useExchangeContext = () => useContext(ExchangeContext);
