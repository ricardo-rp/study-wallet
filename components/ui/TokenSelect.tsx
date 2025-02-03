import { useState } from "react";
import { Text } from "react-native";
import { Picker } from "@react-native-picker/picker";
import styled from "styled-components/native";

import { Colors } from "@/constants/Colors";
import { TokenMarketsResult } from "@/hooks/useTokenMarkets";
import { formatCurrency } from "@/utils";

export { TokenSelect };

const TokenSelect = ({
  selectedToken,
  setSelectedToken,
  options,
}: {
  selectedToken: string;
  setSelectedToken: (x: string) => void;
  options: TokenMarketsResult[];
}) => {
  const [amount, setAmount] = useState<string>("0");

  const currentToken = options.find((t) => t.id === selectedToken);

  if (!currentToken) return <InvalidText>Invalid token selected.</InvalidText>;
  return (
    <SelectWrapper>
      <GreyBox>
        <TokenIcon source={{ uri: currentToken.image }} />

        <InputsWrapper>
          <StyledPicker
            selectedValue={selectedToken}
            onValueChange={(itemValue: string) => setSelectedToken(itemValue)}
          >
            {options.map((token) => (
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
      </GreyBox>

      <PriceText>
        1 {currentToken.symbol.toUpperCase()} ={" "}
        <Text style={{ color: Colors.darkGreen }}>
          {formatCurrency(currentToken.current_price)}
        </Text>
      </PriceText>
    </SelectWrapper>
  );
};

const PriceText = styled.Text`
  color: rgb(184, 184, 184);
`;

const SelectWrapper = styled.View`
  flex: 1;
  flex-direction: columnkj;
  height: fit-content;
  place-items: center;
  gap: 4px;
`;

const GreyBox = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
  background-color: ${Colors.lightGrey};
  border-radius: 12px;
  padding: 13px 16px;
`;

// A wrapper for both the Picker and the TextInput
const InputsWrapper = styled.View`
  flex: 1;
  gap: 4px;
`;

// Restrict or style the Picker's size to prevent overflow
const StyledPicker = styled(Picker)`
  width: 100%;
  border-radius: 4px;
  background-color: transparent;
  border: none;
  font-weight: bold;
  font-size: 14px;
  line-height: 24px;
  padding: 0 4px;
`;

// Basic numeric input styling
const AmountInput = styled.TextInput`
  width: 100%;
  padding: 0 4px;
  border-radius: 4px;
  color: ${Colors.darkGrey};
  padding: 4px;
`;

const TokenIcon = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 999px;
`;

const InvalidText = styled.Text`
  justify-content: center;
  align-items: center;
  flex: 1;
  color: ${Colors.red};
`;
