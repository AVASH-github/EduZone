import { FlatList, ScrollView, StatusBar, Text, View } from "react-native";
import React, { useState } from 'react'
import { useTheme } from "@/context/theme.context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  fontSizes,
  IsAndroid,
  windowHeight,
  windowWidth,
} from "@/themes/app.constant";
import SkeltonLoader from "@/utils/skelton";
import GradiantText from "@/components/common/gradient.test";
import { scale, verticalScale } from "react-native-size-matters";

export default function CoursesScreen() {
    const {theme} = useTheme();
    const buttomTabVarHeight = useBottomTabBarHeight();
        const [loading, setLoading] = useState(true);
  return (
    <SafeAreaView
    style={{
                flex: 1,
        backgroundColor: theme.dark ? "#131313" : "#fff",
    }}
    >
        <ScrollView showsVerticalScrollIndicator={false} 
        style={{marginTop: verticalScale(-30)}}>
         <StatusBar barStyle={!theme.dark ? "dark-content" : "light-content"} />

         <View style={{marginHorizontal: windowWidth(20)}}>
          <View style={{ flexDirection: "row", marginTop: windowHeight(8) }}>
      <Text
                      style={{
                        fontSize: fontSizes.FONT35,
                        fontFamily: "Poppins_500Medium",
                        color: theme.dark ? "#fff" : "#000",
                      }}
                    >
                      Popular &nbsp;   
                       <Text style={{color: "#6D55FE"}}>
                         Courses
                      </Text>
                    </Text>
                    
                  </View>
                   <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View
                      style={{
                        backgroundColor: "#12BB70",
                        width: windowWidth(15),
                        height: windowWidth(15),
                        borderRadius: 100,
                        marginTop: verticalScale(-18),
                      }}
                    />
                    <Text
                      style={{
                        fontFamily: "Poppins_400Regular",
                        fontSize: fontSizes.FONT18,
                        paddingLeft: windowWidth(5),
                        paddingBottom: windowHeight(20),
                        color: theme.dark ? "#fff" : "#000",
                      }}
                    >
                      Our comprehensive project based courses
                    </Text>
                  </View>
                  </View>
{loading ? (
                        <>
                            <SkeltonLoader />
                            <SkeltonLoader />
                        </>
                    ): (
                        <View> 
                         </View>
                    )
                    }
        </ScrollView>

    </SafeAreaView>
  )
}