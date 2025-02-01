import { ActivityIndicator, Image } from "react-native";
import { useCoinGeckoApi } from "@/hooks/useCoinGeckoApi";
import { useLocalSearchParams, useNavigation } from "expo-router";
import styled from "styled-components/native";
import { formatCurrency } from "@/utils";
import { Colors } from "@/constants/Colors";
import { useFavoriteIds } from "@/hooks/useFavoriteIds";
import { useLayoutEffect } from "react";
import { Gutter } from "@/constants/Layout";
import { HeartIcon } from "react-native-heroicons/outline";

export type { TokenDetails };

type TokenDetails = {
  id: string;
  symbol: string;
  name: string;
  image: { large: string; small: string; thumb: string };
  market_data: {
    current_price: PriceObject;
    market_cap: PriceObject;
    high_24h: PriceObject;
    low_24h: PriceObject;
    ath: PriceObject;
    atl: PriceObject;
  };
};

/**
 * Most "price"-related values from CoinGecko API come in this format.
 */
type PriceObject = { usd: number; btc: number; eur: number };

export default function TokenDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, error } = useCoinGeckoApi<TokenDetails>({
    route: `/coins/${id}`,
  });

  const { toggleFavorite, isFavorited } = useFavoriteIds();

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderHeartButton onPress={() => toggleFavorite(id)}>
          <HeartIcon stroke="white" fill={isFavorited(id) ? "white" : "none"} />
        </HeaderHeartButton>
      ),
    });
  }, [navigation, isFavorited(id)]);

  if (isLoading || !data) return <ActivityIndicator />;
  if (error) return <ErrorText>Error loading token details</ErrorText>;

  const { current_price, high_24h, low_24h, ath, atl, market_cap } =
    data.market_data;

  const symbol = data.symbol.toUpperCase();

  return (
    <Container>
      <Header>
        <TokenImage source={{ uri: data.image.large }} resizeMode="contain" />

        <HeaderText>{symbol}</HeaderText>
        <HeaderText>{formatCurrency(current_price.usd)}</HeaderText>
      </Header>

      <Section>
        <SectionTitle>{symbol} historical price</SectionTitle>

        <PriceRow darken>
          <Label>Market Cap</Label>
          <Text>{formatCurrency(market_cap.usd)}</Text>
        </PriceRow>

        <PriceRow>
          <Label>24h Range</Label>
          <Text>
            {formatCurrency(low_24h.usd)} - {formatCurrency(high_24h.usd)}
          </Text>
        </PriceRow>

        <PriceRow darken>
          <Label>All-Time High</Label>
          <Text>{formatCurrency(ath.usd)}</Text>
        </PriceRow>

        <PriceRow>
          <Label>All-Time Low</Label>
          <Text>{formatCurrency(atl.usd)}</Text>
        </PriceRow>
      </Section>
    </Container>
  );
}

// Styled components
const Container = styled.View`
  flex: 1;
  background: ${Colors.white};
`;

const Header = styled.View`
  flex-direction: column;
  align-items: center;
  margin-bottom: 38px;
  background: ${Colors.red};
  border-radius: 0 0 36px 36px;
  padding: 0 0 20px;
`;

const TokenImage = styled(Image)`
  border-radius: 999px;
  width: 72px;
  height: 72px;
`;

const HeaderText = styled.Text`
  color: ${Colors.white};
  font-size: 24px;
  font-weight: 700;
  line-height: 34px;
`;

const Section = styled.View``;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  padding-horizontal: ${Gutter + 9};
`;

const PriceRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-vertical: 24px;
  padding-horizontal: ${Gutter};
  background-color: ${({ darken }: { darken: boolean }) =>
    darken ? Colors.lightGrey : Colors.white};
`;

const Label = styled.Text`
  font-size: 16px;
`;

const Text = styled.Text`
  font-size: 16px;
  font-weight: 500;
`;

const ErrorText = styled.Text`
  color: ${Colors.red}
  font-size: 16px;
  text-align: center;
  margin-top: 20px;
`;

const HeaderHeartButton = styled.TouchableOpacity`
  padding: 16px;
  margin-right: 8px;
  font-size: 24px;
  border-radius: 999px;
`;
