import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import {
  useFonts,
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from "@expo-google-fonts/dm-sans";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FloatingButton } from "@/components/FloatingButton";
import { Colors } from "@/constants/Colors";
import { View } from "react-native";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <ThemeProvider value={DefaultTheme}>
      <QueryClientProvider client={queryClient}>
        {/* Main app container */}
        <View style={{ flex: 1 }}>
          {/* Navigation stack */}
          <Stack
            screenOptions={{
              headerShown: true,
            }}
          >
            <Stack.Screen
              name="index"
              options={{ headerShown: false, animation: "fade" }}
            />
            <Stack.Screen
              name="exchange"
              options={{
                title: "Exchange",
                headerStyle: { backgroundColor: Colors.white },
                headerTintColor: Colors.darkBlue,
                headerTitleAlign: "center",
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="token/[id]"
              options={{
                headerShown: true,
                animation: "slide_from_right",
                title: "",
                headerStyle: { backgroundColor: Colors.red },
                headerShadowVisible: false,
                headerTintColor: Colors.white,
              }}
            />
            <Stack.Screen name="+not-found" />
          </Stack>

          <FloatingButton />
        </View>
      </QueryClientProvider>

      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
