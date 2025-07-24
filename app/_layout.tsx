import { ThemeProvider } from "@/context/theme.context";
import {
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import { Stack } from "expo-router";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NotificationProvider } from "@/context/notification.provider";
import * as Notifications from 'expo-notifications';
const _layout = () => {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Poppins_600SemiBold,
    Poppins_300Light,
    Poppins_700Bold,
    Poppins_400Regular,
    Poppins_500Medium,
  });

  if (!loaded) {
    return null;
  }


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

  return (
     <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
           <NotificationProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(routes)/onboarding/index" />
         <Stack.Screen name="(routes)/course-access" />
          <Stack.Screen name="(routes)/notification/index" />
        </Stack>
</NotificationProvider>
    </ThemeProvider>
    </GestureHandlerRootView>
    
  );
};



export default _layout;
