import { ActivityIndicator, FlatList } from "react-native";
import styled from "styled-components/native";
import { useState } from "react";
import { useTokenSearch } from "@/hooks/useTokenSearch";

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const { filteredTokens, isLoading, error } = useTokenSearch(searchQuery);

  if (isLoading) return <ActivityIndicator />;

  if (error) return <WhiteText>Error loading tokens</WhiteText>;

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

// Styled components remain the same
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
