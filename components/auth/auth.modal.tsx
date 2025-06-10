import { fontSizes, windowHeight, windowWidth } from "@/themes/app.constant";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { BlurView } from "expo-blur";
import React from 'react';
import { Image, Platform, Pressable, Text, View } from "react-native";



export default function AuthModal() {


const configureGoogleSignIn = () => {
        if (Platform.OS === "android") {
      GoogleSignin.configure({
        webClientId:
          "518996370121-d8njj8kg0fpocjnanijnotlk7srnf884.apps.googleusercontent.com",
      });
    }
  };

  const googleSignIn= async ()=>{

  }

  return (
   <BlurView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Pressable
        style={{
          width: windowWidth(420),
          height: windowHeight(250),
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
         <View
          style={{
            paddingVertical: windowHeight(10),
            flexDirection: "row",
            gap: windowWidth(20),
          }}
        >
 <Pressable onPress={googleSignIn}>
            <Image
              source={require("@/assets/images/onboarding/google.png")}
              style={{
                width: windowWidth(40),
                height: windowHeight(40),
                resizeMode: "contain",
              }}
            />
</Pressable>
<Pressable >
            <Image
              source={require("@/assets/images/onboarding/github.png")}
              style={{
                width: windowWidth(40),
                height: windowHeight(40),
                resizeMode: "contain",
              }}
            />
          </Pressable>
<Pressable>
            <Image
              source={require("@/assets/images/onboarding/apple.png")}
              style={{
                width: windowWidth(40),
                height: windowHeight(40),
                resizeMode: "contain",
              }}
            />
          </Pressable>
        </View>

      </Pressable>
      </BlurView>
  )
}