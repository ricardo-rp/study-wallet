import { ActivityIndicator, FlatList } from "react-native";
import styled from "styled-components/native";
import { useTokenSearch } from "@/hooks/useTokenSearch";
import { TokenListItem } from "@/components/TokenListItem";
import { Span } from "@/components/ui/Typography";
import { Gutter } from "@/constants/Layout";
import { TokenMarketsResult } from "@/hooks/useTokenMarkets";

export { SearchResults };

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
      ListEmptyComponent={<EmptyMessage>No tokens found</EmptyMessage>}
    />
  );
};

const EmptyMessage = styled(Span)`
  padding: ${Gutter}px;
  text-align: center;
`;
