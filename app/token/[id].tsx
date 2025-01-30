import { ActivityIndicator } from "react-native";
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

  return (
    <Container>
      <Header>
        <Title>{data.name}</Title>
        <Symbol>{data.symbol.toUpperCase()}</Symbol>
      </Header>

      <DetailsContainer>
        <Section>
          <SectionTitle>Market Data</SectionTitle>
          <PriceRow>
            <Label>Market Cap</Label>
            <Value>{formatCurrency(data.market_data.market_cap.usd)}</Value>
          </PriceRow>
        </Section>

        <Section>
          <SectionTitle>Price Ranges</SectionTitle>
          <PriceRow>
            <Label>24h High</Label>
            <Value>{formatCurrency(data.market_data.high_24h.usd)}</Value>
          </PriceRow>
          <PriceRow>
            <Label>24h Low</Label>
            <Value>{formatCurrency(data.market_data.low_24h.usd)}</Value>
          </PriceRow>
        </Section>

        <Section>
          <SectionTitle>Historical</SectionTitle>
          <PriceRow>
            <Label>All-Time High</Label>
            <Value>{formatCurrency(data.market_data.ath.usd)}</Value>
          </PriceRow>
          <PriceRow>
            <Label>All-Time Low</Label>
            <Value>{formatCurrency(data.market_data.atl.usd)}</Value>
          </PriceRow>
        </Section>
      </DetailsContainer>
    </Container>
  );
}

// Helper function to format currency values
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
};

// Helper function to format large numbers
const formatCurrencyAbbreviation = (value: number) => {
  const formatter = Intl.NumberFormat("en", {
    notation: "compact",
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });
  return formatter.format(value);
};

// Styled components
const Container = styled.View`
  flex: 1;
  padding: 16px;
  background-color: #000;
`;

const Header = styled.View`
  margin-bottom: 24px;
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

const Value = styled.Text`
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
