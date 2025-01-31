import { ActivityIndicator, Image } from "react-native";
import { useCoinGeckoApi } from "@/hooks/useCoinGeckoApi";
import { useLocalSearchParams } from "expo-router";
import styled from "styled-components/native";
import { formatCurrency } from "@/utils";
import { Colors } from "@/constants/Colors";
import { useFavoriteIds } from "@/hooks/useFavoriteIds";

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

  if (isLoading || !data) return <ActivityIndicator />;
  if (error) return <ErrorText>Error loading token details</ErrorText>;

  const { current_price, high_24h, low_24h, ath, atl, market_cap } =
    data.market_data;

  return (
    <Container>
      <Header>
        <ImageContainer>
          <TokenImage source={{ uri: data.image.large }} resizeMode="contain" />
        </ImageContainer>

        <TitleContainer>
          <TitleGroup>
            <Title>{data.name}</Title>
            <Symbol>{data.symbol.toUpperCase()}</Symbol>
          </TitleGroup>
          <PriceText>{formatCurrency(current_price.usd)}</PriceText>
        </TitleContainer>
      </Header>

      <DetailsContainer>
        <Section>
          <SectionTitle>Price Information</SectionTitle>
          <PriceRow>
            <Label>24h Range</Label>
            <Text>
              {formatCurrency(low_24h.usd)} - {formatCurrency(high_24h.usd)}
            </Text>
          </PriceRow>

          <PriceRow>
            <Label>All-Time High</Label>
            <Text>{formatCurrency(ath.usd)}</Text>
          </PriceRow>

          <PriceRow>
            <Label>All-Time Low</Label>
            <Text>{formatCurrency(atl.usd)}</Text>
          </PriceRow>

          <PriceRow>
            <Label>Market Cap</Label>
            <Text>{formatCurrency(market_cap.usd)}</Text>
          </PriceRow>
        </Section>

        <HeartButton onPress={() => toggleFavorite(id)}>
          {isFavorited(id) ? "❤️" : "🤍"}
        </HeartButton>
      </DetailsContainer>
    </Container>
  );
}

// Styled components
const Container = styled.View`
  flex: 1;
  padding: 16px;
  background: ${Colors.white};
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
`;

const ImageContainer = styled.View`
  border-radius: 8px;
  padding: 8px;
`;

const TokenImage = styled(Image)`
  width: 64px;
  height: 64px;
`;

const TitleContainer = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const TitleGroup = styled.View`
  gap: 4px;
`;

const Title = styled.Text`
  font-size: 28px;
  font-weight: bold;
`;

const Symbol = styled.Text`
  color: #888;
  font-size: 20px;
`;

const PriceText = styled.Text`
  font-size: 24px;
  font-weight: bold;
`;

const DetailsContainer = styled.View`
  gap: 24px;
`;

const Section = styled.View`
  border-radius: 8px;
  padding: 16px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
`;

const PriceRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-vertical: 8px;
`;

const Label = styled.Text`
  font-size: 16px;
`;

const Text = styled.Text`
  font-size: 16px;
  font-weight: 500;
`;

const ErrorText = styled.Text`
  color: red;
  font-size: 16px;
  text-align: center;
  margin-top: 20px;
`;

const HeartButton = styled.TouchableOpacity`
  padding: 8px;
  font-size: 24px;
`;
