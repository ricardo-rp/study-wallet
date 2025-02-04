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
  const { tokenA, tokenB, marketsData } = useExchangeContext();

  return (
    <Container>
      <TokenSelect
        selectedToken={tokenA.id}
        amount={tokenA.amount}
        price={tokenA.price}
        setSelectedToken={tokenA.setId}
        setAmount={tokenA.setAmount}
        options={marketsData}
      />

      <TokenSelect
        selectedToken={tokenB.id}
        amount={tokenB.amount}
        price={tokenB.price}
        setSelectedToken={tokenB.setId}
        setAmount={tokenB.setAmount}
        options={marketsData}
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
