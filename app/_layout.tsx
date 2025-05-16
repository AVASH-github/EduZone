import { View, Text } from 'react-native'
import React from 'react'
import { ThemeProvider } from '@/context/theme.context'
import { SplashScreen, Stack } from 'expo-router'
import {
  Poppins_600SemiBold,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_700Bold,
  Poppins_500Medium,
  useFonts,
} from "@expo-google-fonts/poppins";
// Prevent the splash screen from auto-hiding before asset loading is complete.
//  SplashScreen.preventAutoHideAsync();

const _layout = () => {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Poppins_600SemiBold,
    Poppins_300Light,
    Poppins_700Bold,
    Poppins_400Regular,
    Poppins_500Medium,
  });
  
  return (
    <ThemeProvider>
      <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen name='index' />
        <Stack.Screen name="(routes)/onboarding/index" />
      </Stack>
    </ThemeProvider>
  )
}

export default _layout