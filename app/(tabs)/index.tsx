import { ActivityIndicator, SectionList, Image } from "react-native";
import styled from "styled-components/native";
import { useState } from "react";
import { useTokenSearch } from "@/hooks/useTokenSearch";
import { TokenListItem } from "@/components/TokenListItem";

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
      renderItem={({ item }) => <TokenListItem {...item} />}
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

const SectionHeader = styled.View`
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: #333;
`;

const SectionTitle = styled.Text`
  color: #888;
  font-weight: bold;
  margin-bottom: 8px;
`;

const SearchInput = styled.TextInput`
  padding: 12px;
  margin: 16px;
  border-radius: 8px;
`;

const WhiteText = styled.Text`
  font-weight: bold;
`;

const Container = styled.View`
  flex: 1;
`;
