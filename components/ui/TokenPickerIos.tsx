import { TouchableOpacity, Modal } from "react-native";
import { Colors } from "@/constants/Colors";
import { TokenMarketsResult } from "@/hooks/useTokenMarkets";
import { SafeAreaView } from "react-native-safe-area-context";

import styled from "styled-components/native";
import { useState } from "react";
import { Picker } from "@react-native-picker/picker";

export { TokenPickerIos };

type TokenPickerIos = {
  selectedToken: string;
  setSelectedToken: (token: string) => void;
  options: TokenMarketsResult[];
};

const TokenPickerIos: React.FC<TokenPickerIos> = ({
  selectedToken,
  setSelectedToken,
  options,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <TokenDisplay>
          <TokenText>{selectedToken.toUpperCase()}</TokenText>
        </TokenDisplay>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">
        <SafeAreaView>
          <ModalHeader>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <CloseText>Close</CloseText>
            </TouchableOpacity>
          </ModalHeader>

          <Picker
            selectedValue={selectedToken}
            onValueChange={setSelectedToken}
          >
            {options.map(({ id, symbol }) => (
              <Picker.Item key={id} label={symbol.toUpperCase()} value={id} />
            ))}
          </Picker>
        </SafeAreaView>
      </Modal>
    </>
  );
};

const TokenDisplay = styled.View`
  background-color: ${Colors.lightGrey};
  padding: 12px;
  border-radius: 8px;
  align-items: center;
`;

const TokenText = styled.Text`
  font-size: 16px;
  color: ${Colors.darkGrey};
`;

const ModalHeader = styled.View`
  padding: 16px;
  background-color: ${Colors.white};
  border-bottom-width: 1px;
  border-bottom-color: ${Colors.lightGrey};
`;

const CloseText = styled.Text`
  font-size: 16px;
  color: ${Colors.darkBlue};
`;
