import { useLocalSearchParams } from "expo-router";
import styled from "styled-components/native";

export default function TokenDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <Container>
      <Title>Token Details</Title>
      <TokenId>{id}</TokenId>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: #000;
`;

const Title = styled.Text`
  color: white;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const TokenId = styled.Text`
  color: #888;
  font-size: 16px;
`;
