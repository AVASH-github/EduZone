import { View, Text,Pressable } from 'react-native'
import React from 'react'
import { BlurView } from 'expo-blur'
import { fontSizes, windowHeight, windowWidth } from '@/themes/app.constant'

export default function AuthModal() {
  return (
 
    <BlurView
      style={{
            flex:1,
    justifyContent: "center",
    alignItems: "center",
  }}
  >
      <Pressable
        style={{
          width: windowWidth(614),
          height: windowHeight(220),
          marginHorizontal: windowWidth(50),
          backgroundColor: "#fff",
          borderRadius: 30,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
     <Text
          style={{
            fontSize: fontSizes.FONT35,
            fontFamily: "Poppins_700Bold",
          }}
        >
        Join to EduZone
      </Text>
      <Text
          style={{
            fontSize: fontSizes.FONT17,
            paddingTop: windowHeight(5),
            fontFamily: "Poppins_300Light",
          }}
        >
          It's easier than your imagination!
        </Text>
     </Pressable>
     </BlurView>
  )
}
