import styled from "styled-components/native";
import { useLocalSearchParams } from "expo-router";

import { Gutter } from "@/constants/Layout";
import { Colors } from "@/constants/Colors";
import { TokenSelect } from "@/components/ui/TokenSelect";
import {
  ExchangeProvider,
  useExchangeContext,
} from "@/context/ExchangeContext";

export default function ExchangeScreen() {
  const { tokenId } = useLocalSearchParams<{ tokenId?: string }>();

  return (
    <ExchangeProvider defaultTokenAId={tokenId ?? "bitcoin"}>
      <ExchangeUi />
    </ExchangeProvider>
  );
}

const ExchangeUi = () => {
  const { dispatch, tokenA, tokenB } = useExchangeContext();

  const setTokenA = (tokenAId: string) =>
    dispatch({ type: "SET_TOKEN_A_ID", payload: { tokenAId } });
  const setTokenAAmount = (newAmount: number) =>
    dispatch({ type: "SET_TOKEN_A_AMOUNT", payload: { newAmount } });

  const setTokenB = (tokenBId: string) =>
    dispatch({ type: "SET_TOKEN_B_ID", payload: { tokenBId } });
  const setTokenBAmount = (newAmount: number) =>
    dispatch({ type: "SET_TOKEN_B_AMOUNT", payload: { newAmount } });

  return (
    <Container>
      <TokenSelect
        selectedToken={tokenA.id}
        amount={tokenA.amount}
        price={tokenA.price}
        setSelectedToken={setTokenA}
        setAmount={setTokenAAmount}
      />

      <TokenSelect
        selectedToken={tokenB.id}
        amount={tokenB.amount}
        price={tokenB.price}
        setSelectedToken={setTokenB}
        setAmount={setTokenBAmount}
      />
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  flex-direction: row;
  gap: 18px;
  padding-horizontal: ${Gutter / 2}px;
  padding-vertical: 26px;
  background-color: ${Colors.white};
`;
