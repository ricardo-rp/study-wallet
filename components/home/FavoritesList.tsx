import { FlatList } from "react-native";
import styled from "styled-components/native";
import { TokenListItem } from "@/components/home/TokenListItem";
import { Gutter } from "@/constants/Layout";
import { useFavorites } from "@/hooks/useFavorites";
import { TokenMarketsResult } from "@/hooks/useTokenMarkets";
import { Headline4, Span } from "../ui/Typography";
import { DmSans } from "@/constants/Fonts";

export { FavoritesList };

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
        <EmptyMessage>
          Your bookmarked tokens will appear here. Use the search bar above to
          find some!
        </EmptyMessage>
      }
      ListHeaderComponent={() => <Header>Bookmarks</Header>}
    />
  );
};

const EmptyMessage = styled(Span)`
  padding: ${Gutter}px;
  text-align: center;
  font-family: ${DmSans.regular};
`;

const Header = styled(Headline4)`
  padding: 12px ${Gutter}px;
  font-family: ${DmSans.bold};
`;
