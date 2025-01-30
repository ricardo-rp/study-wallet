import { ActivityIndicator, Image } from "react-native";
import { useCoinGeckoApi } from "@/hooks/useCoinGeckoApi";
import type { TokenDetails } from "@/types/domain";
import { useLocalSearchParams } from "expo-router";
import styled from "styled-components/native";

export default function TokenDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, error } = useCoinGeckoApi<TokenDetails>({
    route: `/coins/${id}`,
  });

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
          <Title>{data.name}</Title>
          <Symbol>{data.symbol.toUpperCase()}</Symbol>
        </TitleContainer>
      </Header>

      <DetailsContainer>
        <Section>
          <SectionTitle>Price Information</SectionTitle>
          <PriceRow>
            <Label>Current Price</Label>
            <Text>{formatCurrency(current_price.usd)}</Text>
          </PriceRow>

          <PriceRow>
            <Label>24h Range</Label>
            <Text>
              {formatCurrency(high_24h.usd)} - {formatCurrency(low_24h.usd)}
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
      </DetailsContainer>
    </Container>
  );
}

// Helper function to format currency values
const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(value);

// Styled components
const Container = styled.View`
  flex: 1;
  padding: 16px;
  background-color: #000;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
`;

const ImageContainer = styled.View`
  background-color: #1a1a1a;
  border-radius: 8px;
  padding: 8px;
`;

const TokenImage = styled(Image)`
  width: 64px;
  height: 64px;
`;

const TitleContainer = styled.View`
  flex: 1;
`;

const Title = styled.Text`
  color: white;
  font-size: 28px;
  font-weight: bold;
`;

const Symbol = styled.Text`
  color: #888;
  font-size: 20px;
`;

const DetailsContainer = styled.View`
  gap: 24px;
`;

const Section = styled.View`
  background-color: #1a1a1a;
  border-radius: 8px;
  padding: 16px;
`;

const SectionTitle = styled.Text`
  color: #fff;
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
  color: #888;
  font-size: 16px;
`;

const Text = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: 500;
`;

const ErrorText = styled.Text`
  color: red;
  font-size: 16px;
  text-align: center;
  margin-top: 20px;
`;
