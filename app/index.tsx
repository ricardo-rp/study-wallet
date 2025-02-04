import { ActivityIndicator } from "react-native";
import styled from "styled-components/native";
import { Colors } from "@/constants/Colors";
import { Span } from "@/components/ui/Typography";
import { Gutter } from "@/constants/Layout";
import { useTokenMarkets } from "@/hooks/useTokenMarkets";
import { FavoritesList } from "@/components/home/FavoritesList";
import { SearchResults } from "@/components/home/SearchResults";
import { useDebounceValue } from "usehooks-ts";
import { Quicksand } from "@/constants/Fonts";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useDebounceValue("", 250);

  return (
    <Container>
      <SearchInput
        placeholder="Search"
        placeholderTextColor="#888"
        onChangeText={setSearchQuery}
      />

      <CachedTokensLoader searchQuery={searchQuery} />
    </Container>
  );
}

const CachedTokensLoader = ({ searchQuery }: { searchQuery: string }) => {
  const { data, isLoading, error } = useTokenMarkets();

  if (isLoading || !data) return <ActivityIndicator />;
  if (error) return <Span>Error loading tokens</Span>;

  if (searchQuery.trim().length === 0)
    return <FavoritesList cachedTokens={data} />;

  return <SearchResults searchQuery={searchQuery} cachedTokens={data} />;
};

const SearchInput = styled.TextInput`
  padding: 16px;
  margin: ${Gutter - 8}px;
  font-size: 13px;
  border-radius: 999px;
  background: ${Colors.lightGrey};
  border: solid rgba(41, 45, 50, 0.1);
  font-family: ${Quicksand.regular};
  color: ${Colors.darkBlue};
`;

const Container = styled(SafeAreaView)`
  flex: 1;
  background: ${Colors.white};
`;
