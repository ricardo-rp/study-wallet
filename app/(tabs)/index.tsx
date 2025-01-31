import { ActivityIndicator, FlatList } from "react-native";
import styled from "styled-components/native";
import { useState } from "react";
import { useTokenSearch } from "@/hooks/useTokenSearch";
import { TokenListItem } from "@/components/TokenListItem";
import { Colors } from "@/constants/Colors";
import { Span } from "@/components/ui/typography/Span";
import { Gutter } from "@/constants/Layout";
import { useFavorites } from "@/hooks/useFavorites";
import { TokenMarketsResult, useTokenMarkets } from "@/hooks/useTokenMarkets";

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Container>
      <SearchInput
        placeholder="Search"
        placeholderTextColor="#888"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <CachedTokensLoader searchQuery={searchQuery} />
    </Container>
  );
}

const CachedTokensLoader = ({ searchQuery }: { searchQuery: string }) => {
  const { data, isLoading, error } = useTokenMarkets();

  if (!data || isLoading) return null;

  if (isLoading || !data) return <ActivityIndicator />;
  if (error) return <Span>Error loading tokens</Span>;

  if (searchQuery.trim().length === 0)
    return <FavoritesList cachedTokens={data} />;

  return <SearchResults searchQuery={searchQuery} cachedTokens={data} />;
};

const FavoritesList = ({
  cachedTokens,
}: {
  cachedTokens: TokenMarketsResult[];
}) => {
  const { data } = useFavorites(cachedTokens);

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => (
        <TokenListItem index={index} {...item} />
      )}
      ListEmptyComponent={
        <EmptyMessage>No bookmarks yet. Search to add some!</EmptyMessage>
      }
    />
  );
};

const SearchResults = ({
  searchQuery,
  cachedTokens,
}: {
  searchQuery: string;
  cachedTokens: TokenMarketsResult[];
}) => {
  const { data, isLoading, error } = useTokenSearch(searchQuery, cachedTokens);

  if (isLoading) return <ActivityIndicator />;
  if (error) return <Span>Error loading results</Span>;

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => (
        <TokenListItem index={index} {...item} />
      )}
      ListEmptyComponent={<EmptyMessage>No results found</EmptyMessage>}
    />
  );
};

const EmptyMessage = styled(Span)`
  padding: ${Gutter}px;
  text-align: center;
`;

// Rest of your styled components remain the same
const SearchInput = styled.TextInput`
  padding: 16px;
  margin: ${Gutter - 8}px;
  font-size: 13px;
  border-radius: 999px;
  background: ${Colors.lightGrey};
  border: solid rgba(41, 45, 50, 0.1);
`;

const Container = styled.View`
  flex: 1;
  background: ${Colors.white};
`;
