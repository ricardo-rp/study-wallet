import { ActivityIndicator, FlatList } from "react-native";
import styled from "styled-components/native";
import { useState } from "react";
import { useTokenSearch } from "@/hooks/useTokenSearch";
import { TokenListItem } from "@/components/TokenListItem";
import { Colors } from "@/constants/Colors";
import { Span } from "@/components/ui/typography/Span";
import { Gutter } from "@/constants/Layout";
import { useFavorites } from "@/hooks/useFavorites";

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const hasSearchQuery = searchQuery.trim().length > 0;

  return (
    <Container>
      <SearchInput
        placeholder="Search"
        placeholderTextColor="#888"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {hasSearchQuery ? (
        <SearchResults searchQuery={searchQuery} />
      ) : (
        <FavoritesList />
      )}
    </Container>
  );
}

const FavoritesList = () => {
  const { data, isLoading, error } = useFavorites();

  if (isLoading) return <ActivityIndicator />;
  if (error) return <Span>Error loading favorites</Span>;

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

const SearchResults = ({ searchQuery }: { searchQuery: string }) => {
  const { data, isLoading, error } = useTokenSearch(searchQuery);

  if (isLoading) return <ActivityIndicator />;
  if (error) return <Span>Error loading results</Span>;

  return (
    <FlatList
      data={data?.coins}
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
