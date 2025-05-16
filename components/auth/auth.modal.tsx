import { View, Text, Pressable, Image } from 'react-native';
import React from 'react';
import { BlurView } from 'expo-blur';
import {
  fontSizes,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  windowHeight,
  windowWidth,
} from '@/themes/app.constant';

export default function AuthModal() {
  return (
    <BlurView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 380,
        paddingLeft:180,
      }}
    >
      <Pressable
        style={{
            width: windowWidth(420),
            height: windowHeight(250), 
          backgroundColor: '#fff',
          borderRadius: 30,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 20,
        }}
      >
        <Text
          style={{
            fontSize: fontSizes.FONT35,
            fontFamily: 'Poppins_700Bold',
          }}
        >
          Join to EduZone
        </Text>

        <Text
          style={{
            fontSize: fontSizes.FONT17,
            marginTop: 10,
            fontFamily: 'Poppins_300Light',
            textAlign: 'center',
          }}
        >
          It's easier than your imagination!
        </Text>

        <View
          style={{
            marginTop: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 20,
          }}
        >
          <Pressable>
            <Image
              source={require('@/assets/images/onboarding/google.png')}
              style={{
                width: 40,
                height: 40,
                resizeMode: 'contain',
              }}
            />
          </Pressable>
          <Pressable>
            <Image
              source={require('@/assets/images/onboarding/github.png')}
              style={{
                width: 40,
                height: 40,
                resizeMode: 'contain',
              }}
            />
          </Pressable>
          <Pressable>
            <Image
              source={require('@/assets/images/onboarding/apple.png')}
              style={{
                width: 40,
                height: 40,
                resizeMode: 'contain',
              }}
            />
          </Pressable>
        </View>
      </Pressable>
    </BlurView>
  );
}
