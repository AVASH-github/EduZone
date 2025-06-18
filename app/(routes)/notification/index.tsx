import { View, Text } from 'react-native'
import React from 'react'
import NotificationScreen from "@/screens/notification/notification.screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
export default function Notification() {
  return (
  <GestureHandlerRootView style={{ flex: 1 }}>
      <NotificationScreen />
    </GestureHandlerRootView>
  )
}