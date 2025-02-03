import { useState } from "react";
import styled from "styled-components/native";
import { useLocalSearchParams } from "expo-router";

import { Gutter } from "@/constants/Layout";
import { Colors } from "@/constants/Colors";
import { useTokenMarkets } from "@/hooks/useTokenMarkets";
import { useCoinGeckoApi } from "@/hooks/useCoinGeckoApi";
import { TokenSelect } from "@/components/ui/TokenSelect";

export default function ExchangeScreen() {
  const { tokenId } = useLocalSearchParams<{ tokenId?: string }>();
  const [tokenA, setTokenA] = useState(tokenId ?? "bitcoin");
  const [tokenB, setTokenB] = useState("tether");
  const { data } = useTokenMarkets();
  const {} = useCoinGeckoApi({ route: "/simple/price" });

  return (
    <Container>
      {data && (
        <TokenSelect
          selectedToken={tokenA}
          setSelectedToken={setTokenA}
          options={data}
        />
      )}

      {data && (
        <TokenSelect
          selectedToken={tokenB}
          setSelectedToken={setTokenB}
          options={data}
        />
      )}
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  flex-direction: row;
  gap: 18px;
  padding-horizontal: ${Gutter / 2}px;
  padding-vertical: 26px;
  background-color: ${Colors.white};
`;
