import { Image, View } from "react-native";
import styled from "styled-components/native";
import { useFavorites } from "@/hooks/useFavorites";
import { TokenInfo } from "@/types/domain";
import { Link } from "expo-router";
import { formatCurrency } from "@/utils";

export { TokenListItem };

const TokenListItem = ({ id, symbol, current_price, image }: TokenInfo) => {
  const { toggleFavorite, isFavorited } = useFavorites();

  return (
    <TokenItem>
      <Link href={`/token/${id}`} asChild>
        <PressableRow>
          <StyledView>
            <TokenImage source={{ uri: image }} resizeMode="contain" />

            <WhiteText>{symbol.toUpperCase()}</WhiteText>
          </StyledView>

          <PriceText>≈ {formatCurrency(current_price)}</PriceText>
        </PressableRow>
      </Link>

      <HeartButton onPress={() => toggleFavorite(id)}>
        {isFavorited(id) ? "❤️" : "🤍"}
      </HeartButton>
    </TokenItem>
  );
};

const StyledView = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const PressableRow = styled.Pressable`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const PriceText = styled.Text`
  color: white;
  font-size: 16px;
  margin-right: 16px;
`;

const TokenItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
`;

const HeartButton = styled.TouchableOpacity`
  padding: 8px;
  font-size: 24px;
`;

const WhiteText = styled.Text`
  color: white;
  font-weight: bold;
`;

const TokenImage = styled(Image)`
  width: 40px;
  height: 40px;
`;
