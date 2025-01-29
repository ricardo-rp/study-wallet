import { View, Text } from "react-native";

import { useEffect } from "react";
import { useCoinGeckoApi } from "@/hooks/useCoinGeckoApi";

export default function HomeScreen() {
  const { data: btcData } = useCoinGeckoApi("coins/bitcoin");
  const { data: ethData } = useCoinGeckoApi("coins/tether");
  const { data: usdData } = useCoinGeckoApi("coins/ethereum");

  useEffect(() => {
    console.log({ btcData, ethData, usdData });
  }, [btcData, ethData, usdData]);

  return (
    <View>
      <Text>Hi!</Text>
    </View>
  );
}
