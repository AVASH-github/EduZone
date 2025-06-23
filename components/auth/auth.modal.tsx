import { fontSizes, windowHeight, windowWidth } from "@/themes/app.constant";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import axios from "axios";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { BlurView } from "expo-blur";
import jwt from "expo-jwt";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect } from "react";
import { Image, Platform, Pressable, Text, View } from "react-native";
// Read server URL from env, fallback to localhost
const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URI ?? "http://localhost:3000";

export default function AuthModal({
  setModalVisible,
}: {
  setModalVisible: (modal: boolean) => void;
}) {
  const configureGoogleSignIn = () => {
    if (Platform.OS === 'android') {
      GoogleSignin.configure({
        webClientId: "74598101794-q72vs70hd0qiarvd1svimbrgb03dn6ce.apps.googleusercontent.com",
      });
    }
  };

  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  // Github Auth config & hooks omitted for brevity — same as your original

  const githubAuthEndpoints = {
    authorizationEndpoint: "https://github.com/login/oauth/authorize",
    tokenEndpoint: "https://github.com/login/oauth/access_token",
    revocationEndpoint: `https://github.com/settings/connections/applications/Ov23liKrCWoHEtml2pDI`,
  };

  const [request, response] = useAuthRequest(
    {
      clientId: "Ov23liKrCWoHEtml2pDI",
      clientSecret: "bb9c6f88e43cd114f6b7928506334590639d97c0",
      scopes: ["identity"],
      redirectUri: makeRedirectUri({
        scheme: "eduzone",
      }),
    },
    githubAuthEndpoints
  );

  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;
      fetchAccessToken(code);
    }
  }, [response]);

  const handleGithubLogin = async () => {
    const result = await WebBrowser.openAuthSessionAsync(
      request?.url!,
      makeRedirectUri({
        scheme: "eduzone",
      })
    );

    if (result.type === "success" && result.url) {
      const urlParams = new URLSearchParams(result.url.split("?")[1]);
      const code: any = urlParams.get("code");
      fetchAccessToken(code);
    }
  };

  const fetchAccessToken = async (code: string) => {
    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `client_id=Ov23liKrCWoHEtml2pDI&client_secret=bb9c6f88e43cd114f6b7928506334590639d97c0&code=${code}`,
      }
    );

    const tokenData = await tokenResponse.json();
    const access_token = tokenData.access_token;
    if (access_token) {
      fetchUserInfo(access_token);
    } else {
      console.error("Error fetching access token:", tokenData);
    }
  };

  const fetchUserInfo = async (token: string) => {
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const userData = await userResponse.json();
    await authHandler({
     name: userData.name || userData.login, 
      email: userData.email || `${userData.login}@users.noreply.github.com`, // Fallback email
      avatar: userData.avatar_url,
    });
  };

const googleSignIn = async () => {
  try {
    await GoogleSignin.hasPlayServices();

        await GoogleSignin.signOut();
    const userInfo = await GoogleSignin.signIn();
    console.log("👉 Full Google userInfo:", JSON.stringify(userInfo, null, 2));

    const user = userInfo.data?.user;

    if (!user || !user.email) {
      console.error("❌ Google userInfo.data.user is undefined or missing email");
      return;
    }

    await authHandler({
      name: user.name ?? "Unknown",
      email: user.email,
      avatar: user.photo ?? "",
    });
  } catch (error) {
    console.log("❌ Google sign-in error:", error);
  }
};

const authHandler = async ({
  name,
  email,
  avatar,
}: {
  name: string;
  email: string;
  avatar: string;
}) => {
  console.log("Starting authHandler");
  try {
    const user = { name, email, avatar };

    const token = jwt.encode(user, process.env.EXPO_PUBLIC_JWT_SECRET_KEY!);

    console.log("Token being sent to backend:", token); // <-- Add here
    console.log(`Making API request to server at ${SERVER_URL}`);

    const res = await axios.post(`${SERVER_URL}/login`, {
      signedToken: token,
    });

    console.log("Server response received:", res.data);

    await SecureStore.setItemAsync("accessToken", res.data.accessToken);
    console.log("Access token stored");

    setModalVisible(false);
    router.replace("/(tabs)");
  } catch (error) {
    console.error("Authentication error:", error);
  }
};



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
          <Pressable onPress={handleGithubLogin}>
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
  );
}
