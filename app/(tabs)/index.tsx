import { ActivityIndicator, SectionList } from "react-native";
import styled from "styled-components/native";
import { useState } from "react";
import { useTokenSearch } from "@/hooks/useTokenSearch";
import { useFavorites } from "@/hooks/useFavorites";
import { TokenInfo } from "@/types/domain";
import { Link } from "expo-router";

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Container>
      <SearchInput
        placeholder="Search tokens..."
        placeholderTextColor="#888"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <TokensLoader searchQuery={searchQuery} />
    </Container>
  );
}

const TokensLoader = ({ searchQuery }: { searchQuery: string }) => {
  const {
    data: [favorites, rest],
    isLoading,
    error,
  } = useTokenSearch(searchQuery);

  if (isLoading) return <ActivityIndicator />;
  if (error) return <WhiteText>Error loading tokens</WhiteText>;

  return (
    <SectionList
      sections={[
        { title: "Favorites", data: favorites },
        { title: "Results", data: rest },
      ]}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <Token {...item} />}
      renderSectionHeader={({ section }) => (
        <SectionHeader>
          <SectionTitle>{section.title}</SectionTitle>
          {section.data.length === 0 && (
            <WhiteText>No {section.title.toLowerCase()}</WhiteText>
          )}
        </SectionHeader>
      )}
      stickySectionHeadersEnabled
    />
  );
};

const Token = ({ name, id, symbol }: TokenInfo) => {
  const { toggleFavorite, isFavorited } = useFavorites();

  return (
    <TokenItem>
      <Link href={`/token/${id}`}>
        <Column>
          <WhiteText>{name}</WhiteText>
          <SymbolText>({symbol})</SymbolText>
        </Column>
      </Link>

      <HeartButton onPress={() => toggleFavorite(id)}>
        <HeartText>{isFavorited(id) ? "❤️" : "🤍"}</HeartText>
      </HeartButton>
    </TokenItem>
  );
};

// Styled components
const SectionHeader = styled.View`
  padding: 16px;
  background-color: #1a1a1a;
  border-bottom-width: 1px;
  border-bottom-color: #333;
`;

const SectionTitle = styled.Text`
  color: #888;
  font-weight: bold;
  margin-bottom: 8px;
`;

const TokenItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #000;
`;

const Column = styled.View`
  flex-direction: column;
`;

const SymbolText = styled.Text`
  color: #666;
  font-size: 12px;
`;

const HeartButton = styled.TouchableOpacity`
  padding: 8px;
`;

const HeartText = styled.Text`
  font-size: 24px;
`;

const SearchInput = styled.TextInput`
  padding: 12px;
  margin: 16px;
  background-color: #333;
  color: white;
  border-radius: 8px;
`;

const WhiteText = styled.Text`
  color: white;
`;

const Container = styled.View`
  flex: 1;
  background-color: #000;
`;
