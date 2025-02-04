import { Image, View } from "react-native";
import styled from "styled-components/native";
import { Link } from "expo-router";
import { formatCurrency } from "@/utils";
import { Gutter } from "@/constants/Layout";
import { Colors } from "@/constants/Colors";
import { DmSans } from "@/constants/Fonts";

export { TokenListItem };

type TokenListItemProps = {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  image: string;
  index: number;
};

const TokenListItem = ({
  id,
  symbol,
  current_price,
  image,
  index,
}: TokenListItemProps) => (
  <TokenItem index={index}>
    <Link href={`/token/${id}`} asChild>
      <PressableRow>
        <StyledView>
          <TokenImage source={{ uri: image }} resizeMode="contain" />

          <SymbolText>{symbol.toUpperCase()}</SymbolText>
        </StyledView>

        <PriceText>≈ {formatCurrency(current_price)}</PriceText>
      </PressableRow>
    </Link>
  </TokenItem>
);

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
  font-size: 15px;
  margin-right: ${Gutter / 2}px;
  font-family: ${DmSans.regular};
  color: ${Colors.darkBlue};
`;

const TokenItem = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px ${Gutter - 4}px;
  background-color: ${({ index }: { index: number }) =>
    index % 2 === 0 ? Colors.lightGrey : Colors.white};
`;

const SymbolText = styled.Text`
  font-family: ${DmSans.bold};
  font-size: 18px;
`;

const TokenImage = styled(Image)`
  width: 40px;
  height: 40px;
  border-radius: 999px;
`;
