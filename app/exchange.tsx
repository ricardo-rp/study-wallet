import { useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import styled from "styled-components/native";
import { useLocalSearchParams } from "expo-router";

import { Gutter } from "@/constants/Layout";
import { Colors } from "@/constants/Colors";
import { useTokenMarkets } from "@/hooks/useTokenMarkets";

export default function ExchangeScreen() {
  const { tokenId } = useLocalSearchParams<{ tokenId?: string }>();

  return (
    <Container>
      <TokenSelect />
      <TokenSelect />
    </Container>
  );
}

const TokenSelect = () => {
  const [selectedToken, setSelectedToken] = useState<string>("bitcoin");
  const [amount, setAmount] = useState<string>("0");
  const { data, isLoading } = useTokenMarkets();

  if (isLoading || !data) return <ActivityIndicator />;

  const currentToken = data.find((t) => t.id === selectedToken);
  if (!currentToken)
    return (
      <InvalidView>
        <InvalidText>Invalid token selected.</InvalidText>
      </InvalidView>
    );

  return (
    <SelectContainer>
      <TokenIcon source={{ uri: currentToken.image }} />

      <InputsWrapper>
        <StyledPicker
          selectedValue={selectedToken}
          onValueChange={(itemValue: string) => setSelectedToken(itemValue)}
        >
          {data.map((token) => (
            <Picker.Item
              key={token.id}
              label={token.symbol.toUpperCase()}
              value={token.id}
            />
          ))}
        </StyledPicker>

        <AmountInput
          keyboardType="numeric"
          value={amount}
          onChangeText={(text: string) => setAmount(text)}
          placeholder="Amount"
        />
      </InputsWrapper>
    </SelectContainer>
  );
};

const Container = styled.View`
  flex: 1;
  flex-direction: row;
  gap: 18px;
  padding-horizontal: ${Gutter / 2}px;
  padding-vertical: 26px;
  background-color: ${Colors.white};
`;

const SelectContainer = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  background-color: ${Colors.lightGrey};
  border-radius: 12px;
  padding: 13px 16px;
  height: fit-content;
`;

// A wrapper for both the Picker and the TextInput
const InputsWrapper = styled.View`
  flex: 1;
  gap: 4px;
`;

// Restrict or style the Picker's size to prevent overflow
const StyledPicker = styled(Picker)`
  width: 100%;
  background-color: ${Colors.lightGrey};
  border: none;
  font-weight: bold;
  font-size: 14px;
  line-height: 24px;
`;

// Basic numeric input styling
const AmountInput = styled.TextInput`
  width: 100%;
  padding: 0 4px;
  border-radius: 4px;
  color: ${Colors.darkBlue};
`;

const TokenIcon = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 999px;
`;

const InvalidView = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const InvalidText = styled.Text`
  color: ${Colors.red};
`;
