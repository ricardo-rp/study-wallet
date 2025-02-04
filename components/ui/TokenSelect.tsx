import { Text } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Colors } from "@/constants/Colors";
import { formatCurrency } from "@/utils";
import { TokenMarketsResult } from "@/hooks/useTokenMarkets";

import styled from "styled-components/native";
import { DmSans, Quicksand } from "@/constants/Fonts";

export { TokenSelect };

const TokenSelect = ({
  selectedToken,
  setSelectedToken,
  amount,
  setAmount,
  price,
  options,
}: {
  selectedToken: string;
  setSelectedToken: (x: string) => void;
  amount: number;
  setAmount: (x: number) => void;
  price: "loading" | number;
  options: "loading" | TokenMarketsResult[];
}) => {
  if (options === "loading")
    return (
      <SelectWrapper>
        <Loader />
      </SelectWrapper>
    );

  const currentToken = options.find((t) => t.id === selectedToken);

  return (
    <SelectWrapper>
      <GreyBox>
        <TokenIcon source={{ uri: currentToken?.image }} />

        <InputsWrapper>
          <StyledPicker
            selectedValue={selectedToken}
            onValueChange={setSelectedToken}
          >
            {options.map(({ id, symbol }) => (
              <Picker.Item key={id} label={symbol.toUpperCase()} value={id} />
            ))}
          </StyledPicker>

          <AmountInput
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            placeholder="Amount"
          />
        </InputsWrapper>
      </GreyBox>

      <PriceText>
        {price === "loading" ? (
          "Loading..."
        ) : (
          <>
            1 {currentToken?.symbol.toUpperCase()} ≈{" "}
            <Text style={{ color: Colors.darkGreen }}>
              {formatCurrency(price)}
            </Text>
          </>
        )}
      </PriceText>
    </SelectWrapper>
  );
};

const PriceText = styled.Text`
  color: rgb(184, 184, 184);
  font-family: ${Quicksand.regular};
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

const InputsWrapper = styled.View`
  flex: 1;
  gap: 4px;
`;

const StyledPicker = styled(Picker)`
  width: 100%;
  border-radius: 4px;
  background-color: transparent;
  border: none;
  font-family: ${DmSans.bold};
  font-size: 14px;
  line-height: 24px;
  padding: 0 4px;
`;

const AmountInput = styled.TextInput`
  width: 100%;
  padding: 0 4px;
  border-radius: 4px;
  color: ${Colors.darkGrey};
  padding: 4px;
  font-family: ${Quicksand.regular};
`;

const TokenIcon = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 999px;
`;

const Loader = styled.View`
  background-color: ${Colors.lightGrey};
  border-radius: 12px;
  padding: 13px 16px;
  height: 72px;
  width: 100%;
`;
