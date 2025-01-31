import { ActivityIndicator, SectionList, Image } from "react-native";
import styled from "styled-components/native";
import { useState } from "react";
import { useTokenSearch } from "@/hooks/useTokenSearch";
import { TokenListItem } from "@/components/TokenListItem";
import { Colors } from "@/constants/Colors";
import { Span } from "@/components/ui/typography/Span";
import { Gutter } from "@/constants/Layout";

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
  if (error) return <Span>Error loading tokens</Span>;

  const sections = [
    { title: "Bookmarks", data: favorites },
    { title: "Results", data: rest },
  ];

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => (
        <TokenListItem index={index} {...item} />
      )}
      renderSectionHeader={({ section }) => (
        <SectionTitle>{section.title}</SectionTitle>
      )}
      stickySectionHeadersEnabled
    />
  );
};

const SectionTitle = styled.Text`
  color: ${Colors.darkBlue};

  margin-bottom: 8px;
  padding: 12px ${Gutter}px;
  background: white;

  font-size: 18px;
  font-weight: 700;
  line-height: 28px;
`;

const SearchInput = styled.TextInput`
  padding: 16px;
  margin: ${Gutter - 8}px;
  fontsize: 13px;
  border-radius: 999px;
  background: ${Colors.lightGrey};
  border: solid rgba(41, 45, 50, 0.1);
`;

const Container = styled.View`
  flex: 1;
  background: ${Colors.white};
`;
