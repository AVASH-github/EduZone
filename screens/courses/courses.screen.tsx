import React, { useState } from "react";
import {
  FlatList,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { scale, verticalScale } from "react-native-size-matters";

import { useTheme } from "@/context/theme.context";
import { fontSizes, windowHeight, windowWidth } from "@/themes/app.constant";

import CourseCard from "@/components/cards/course.card";
import SkeltonLoader from "@/utils/skelton";
import useGetCourses from "@/hooks/fetch/useGetCourses";
import GradientText from "@/components/common/gradient.text";

const categories = ["All", "Programming", "Graphics Design", "Digital Marketing"];

export default function CoursesScreen() {
  const { theme } = useTheme();
  const { courses, loading } = useGetCourses();

  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredCourses =
    selectedCategory === "All"
      ? courses
      : courses.filter(
          (course) =>
            course.categories &&
            course.categories.toLowerCase() === selectedCategory.toLowerCase()
        );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.dark ? "#131313" : "#fff",
      }}
    >
      <StatusBar barStyle={!theme.dark ? "dark-content" : "light-content"} />

      <View style={{ flex: 0, marginTop: verticalScale(-20) }}>
        {loading ? (
          <View style={{ paddingHorizontal: scale(10) }}>
            <SkeltonLoader />
            <SkeltonLoader />
          </View>
        ) : (
          <FlatList
            data={filteredCourses}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: scale(10) }}
            ListHeaderComponent={() => (
              <>
                {/* Popular Courses (only for All) */}
                {selectedCategory === "All" && (
                  <View style={{ marginBottom: verticalScale(20) }}>
                    <View style={{ marginTop: windowHeight(8) }}>
                      <GradientText text="Popular Courses" />
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: verticalScale(5),
                        marginBottom: verticalScale(15),
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
                        Our comprehensive project based courses
                      </Text>
                    </View>
                  </View>
                )}

                {/* Categories Filter */}
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    flexDirection: "row",
                    paddingBottom: verticalScale(10),
                  }}
                >
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category}
                      onPress={() => setSelectedCategory(category)}
                      style={{
                        backgroundColor:
                          selectedCategory === category   ? theme.dark
    ? "#12BB70"  // active color for dark theme (example purple)
    : "#1f7ae8"  // active color for light theme (example green)
  : theme.dark
  ? "#3c43485c" 
  : "#f0f0f0",
                        paddingVertical: verticalScale(6),
                        paddingHorizontal: scale(12),
                        borderRadius: 20,
                        marginRight: scale(10),
                      }}
                    >
                      <Text
                        style={{
                          color:
                            selectedCategory === category
                              ? "#fff"
                              : theme.dark
                              ? "#fff"
                              : "#000",
                          fontFamily: "Poppins_500Medium",
                        }}
                      >
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </>
            )}
            renderItem={({ item }) => <CourseCard item={item} />}
            ListEmptyComponent={() => (
              <View style={{ paddingVertical: scale(30) }}>
                <SkeltonLoader />
                <SkeltonLoader />
              </View>
            )}
            ListFooterComponent={<View style={{ height: verticalScale(40) }} />}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
