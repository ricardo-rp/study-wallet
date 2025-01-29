import { ActivityIndicator, FlatList } from "react-native";
import { useCoinGeckoApi } from "@/hooks/useCoinGeckoApi";
import styled from "styled-components/native";
import type { TokenInfo } from "@/types/domain";
import { useState, useMemo, useDeferredValue } from "react";

export default function HomeScreen() {
  const { data: tokenList, isLoading } =
    useCoinGeckoApi<TokenInfo[]>("/coins/list");
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const filteredTokens = useMemo(() => {
    if (!tokenList) return [];

    const trimmedQuery = deferredSearchQuery.trim();
    if (!trimmedQuery) return tokenList;

    return tokenList.filter(({ name, symbol, id }) =>
      [name.toLowerCase(), symbol.toLowerCase(), id.toLowerCase()].includes(
        trimmedQuery
      )
    );
  }, [tokenList, deferredSearchQuery]);

  if (isLoading || !tokenList) return <ActivityIndicator />;

  return (
    <Container>
      <SearchInput
        placeholder="Search tokens..."
        placeholderTextColor="#888"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredTokens}
        renderItem={({ item }) => (
          <WhiteText>
            {item.name} ({item.symbol})
          </WhiteText>
        )}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<WhiteText>No tokens found</WhiteText>}
      />
    </Container>
  );
}

const SearchInput = styled.TextInput`
  padding: 12px;
  margin: 16px;
  background-color: #333;
  color: white;
  border-radius: 8px;
`;

const WhiteText = styled.Text`
  color: white;
  padding: 12px;
`;

const Container = styled.View`
  flex: 1;
  background-color: #000;
`;
