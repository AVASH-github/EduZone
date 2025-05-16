import { View, Text } from 'react-native'
import React from 'react'
import { ThemeProvider } from '@/context/theme.context'
import { Stack } from 'expo-router'

const _layout = () => {
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