import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/context/theme.context";
import WelcomeHeader from "@/components/home/welcome.header";
import HomeBanner from "@/components/home/home.banner";
import {
  fontSizes,
  windowHeight,
  windowWidth,
} from "@/themes/app.constant";
import { scale, verticalScale } from "react-native-size-matters";
import GradientText from "@/components/common/gradient.text";
import SkeltonLoader from "@/utils/skelton";
import useGetCourses from "@/hooks/fetch/useGetCourses";
import CourseCard from "@/components/cards/course.card";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

export default function HomeScreen() {
  const { theme } = useTheme();
  const { courses, loading } = useGetCourses();
  const [active, setActive] = useState("All");
  const bottomTabBarHeight = useBottomTabBarHeight();

  const filteredCourses =
    active === "All"
      ? courses
      : courses.filter((course) => course.categories === active);

  const CategoryFilter = () => (
    <View style={{ marginBottom: verticalScale(20), marginTop: verticalScale(10) }}>
      <ScrollView
        horizontal={true}
        style={{ padding: scale(3) }}
        showsHorizontalScrollIndicator={false}
      >
        {["All", "Programming", "Graphics Design", "Digital Marketing"].map(
          (category) => (
            <TouchableOpacity
              key={category}
              style={{
                padding: verticalScale(8),
                backgroundColor:
                  active === category
                    ? theme.dark
    ? "#12BB70"  // active color for dark theme (example purple)
    : "#1f7ae8"  // active color for light theme (example green)
  : theme.dark
  ? "#3c43485c" 
  : "#f0f0f0",
                borderRadius: scale(5),
                marginRight: scale(20),
              }}
              onPress={() => setActive(category)}
            >
              <Text
                style={{
                  color: theme.dark ? "#fff" : "#000",
                  fontFamily: "Poppins_500Medium",
                  fontSize: fontSizes.FONT18,
                }}
              >
                {category}
              </Text>
            </TouchableOpacity>
          )
        )}
      </ScrollView>
    </View>
  );

  return (
    <LinearGradient
      colors={
        theme.dark ? ["#180D41", "#2A2D32", "#131313"] : ["#fff", "#f7f7f7"]
      }
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{
        flex: 1,
        backgroundColor: theme.dark ? "#101010" : "#fff",
      }}
    >
      <WelcomeHeader />
      <View style={{ flex: 1 }}>
        {loading ? (
          <>
            <CategoryFilter />
            <SkeltonLoader />
            <SkeltonLoader />
          </>
        ) : filteredCourses.length === 0 ? (
          <>
            <CategoryFilter />
            <SkeltonLoader />
            <SkeltonLoader />
          </>
        ) : (
          <View style={{ paddingHorizontal: scale(8) }}>
            <FlatList
              ListHeaderComponent={() => (
                <>
                  <CategoryFilter />

                  {active === "All" && (
                    <>
                      <HomeBanner />

                      {/* Popular Courses Section */}
                      <View
                        style={{
                          marginHorizontal: windowWidth(20),
                          marginTop: verticalScale(-25),
                        }}
                      >
                        <View
                          style={{
                            backgroundColor: "transparent",
                            marginTop: windowHeight(1),
                          }}
                        >
                          <GradientText text="Popular Courses" />
                        </View>

                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <View
                            style={{
                              backgroundColor: "#12BB70",
                              width: windowWidth(15),
                              height: windowWidth(15),
                              borderRadius: 100,
                            }}
                          />
                          <Text
                            style={{
                              fontFamily: "Poppins_400Regular",
                              fontSize: fontSizes.FONT18,
                              paddingLeft: windowWidth(5),
                              color: theme.dark ? "#fff" : "#000",
                            }}
                          >
                            our comprehensive project based courses
                          </Text>
                        </View>
                      </View>
                    </>
                  )}
                </>
              )}
              data={filteredCourses}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <CourseCard item={item} />}
              ListFooterComponent={() => (
                <View
                  style={{
                    height: theme.dark
                      ? verticalScale(60)
                      : verticalScale(50),
                  }}
                />
              )}
            />
          </View>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({});
