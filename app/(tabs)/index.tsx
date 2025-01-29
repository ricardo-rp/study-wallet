import { ActivityIndicator, View, FlatList } from "react-native";

import { useCoinGeckoApi } from "@/hooks/useCoinGeckoApi";

import styled from "styled-components/native";
import type { TokenInfo } from "@/types/domain";

export default function HomeScreen() {
  const { data: tokenList, isLoading } =
    useCoinGeckoApi<TokenInfo[]>("/coins/list");

  if (isLoading || !tokenList) return <ActivityIndicator />;

  return (
    <Container>
      <FlatList
        data={tokenList}
        renderItem={({ item }) => <WhiteText>{item.name}</WhiteText>}
        keyExtractor={(item) => item.id}
      />
    </Container>
  );
}

const WhiteText = styled.Text`
  color: white;
`;

const Container = styled.View`
  flex: 1;
`;
