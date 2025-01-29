import { ActivityIndicator, FlatList } from "react-native";
import styled from "styled-components/native";
import { useState } from "react";
import { useTokenSearch } from "@/hooks/useTokenSearch";
import { useFavorites } from "@/hooks/useFavorites";
import { TokenInfo } from "@/types/domain";

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
    <FlatList
      data={rest}
      renderItem={({ item }) => <Token {...item} />}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <HeaderContainer>
          <WhiteText>Favorites: </WhiteText>
          {favorites.length === 0 ? (
            <WhiteText>No favorites</WhiteText>
          ) : (
            favorites.map((fav) => <Token key={fav.id} {...fav} />)
          )}
        </HeaderContainer>
      }
      ListEmptyComponent={<WhiteText>No tokens found</WhiteText>}
    />
  );
};

const Token = ({ name, id, symbol }: TokenInfo) => {
  const { toggleFavorite, isFavorited } = useFavorites();

  return (
    <TokenItem>
      <WhiteText>{name}</WhiteText>
      <WhiteText>({symbol})</WhiteText>
      <HeartButton onPress={() => toggleFavorite(id)}>
        <HeartText>{isFavorited(id) ? "❤️" : "🤍"}</HeartText>
      </HeartButton>
    </TokenItem>
  );
};

const HeaderContainer = styled.View`
  /* Some optional styling to separate favorites from the rest list */
  padding: 12px 16px;
  border-bottom-width: 1px;
  border-bottom-color: #444;
`;

const TokenItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
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
