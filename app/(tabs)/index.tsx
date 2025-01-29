import { ActivityIndicator, View } from "react-native";

import { useCoinGeckoApi } from "@/hooks/useCoinGeckoApi";

import styled from "styled-components/native";
import type { TokenInfo } from "@/types/domain";

export default function HomeScreen() {
  const { data, isLoading } = useCoinGeckoApi<TokenInfo[]>("/coins/list");

  if (isLoading || !data) return <ActivityIndicator />;

  const tokenList = data.filter((token) =>
    ["bitcoin", "tether", "ethereum"].includes(token.id)
  );

  return (
    <View>
      {tokenList.map((token) => (
        <WhiteText key={token.id}>{token.name}</WhiteText>
      ))}
    </View>
  );
}

const WhiteText = styled.Text`
  color: white;
`;
