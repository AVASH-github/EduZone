import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useTheme } from "@/context/theme.context";
import {
  fontSizes,
  SCREEN_WIDTH,
  windowHeight,
  windowWidth,
} from "@/themes/app.constant";
import { useRouter } from "expo-router";

export default function SourceCodeCard({
  item,
}: {
  item: {
    url: string;
    thumbnail: string;
    title: string;
  };
}) {
  const { theme } = useTheme();
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: "/modals/YouTubeViewer", 
      params: { url: item.url },
    });
  };

  return (
    <Pressable
      style={{
        paddingHorizontal: windowWidth(20),
        paddingVertical: windowHeight(7),
      }}
      onPress={handlePress}
    >
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.dark ? "#3c43485c" : "#eaf3fb85",
          },
        ]}
      >
        <Image
          source={{
            uri: item?.thumbnail,
          }}
          style={{
            width: SCREEN_WIDTH - 52,
            height: (SCREEN_WIDTH - 40) * 0.5625,
            alignSelf: "center",
            borderRadius: windowWidth(5),
          }}
        />
        <View
          style={{
            paddingHorizontal: windowWidth(15),
            paddingBottom: windowHeight(5),
          }}
        >
          <Text
            style={{
              paddingTop: windowHeight(5),
              fontFamily: "Poppins_400Regular",
              fontSize: fontSizes.FONT18,
              color: theme.dark ? "#fff" : "#3E3B54",
            }}
          >
            {item.title}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: windowWidth(10),
    shadowOpacity: 0.1,
    shadowColor: "#40E0D0",
    shadowRadius: 5,
  },
});
