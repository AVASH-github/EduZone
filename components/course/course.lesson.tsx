import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { useTheme } from "@/context/theme.context";
import { scale, verticalScale } from "react-native-size-matters";
import { fontSizes } from "@/themes/app.constant";
import { Entypo, Feather } from "@expo/vector-icons";

export default function CourseLesson({
  courseDetails,
}: {
  courseDetails: CourseDataType[];
}) {
  const { theme } = useTheme();
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());

  const videoSections: string[] = [
    ...new Set(courseDetails.map((item) => item.videoSection)),
  ];

  const toggleSection = (section: string) => {
    const newVisibleSections = new Set(visibleSections);
    newVisibleSections.has(section)
      ? newVisibleSections.delete(section)
      : newVisibleSections.add(section);
    setVisibleSections(newVisibleSections);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ paddingVertical: verticalScale(5), borderRadius: 8 }}>
        {videoSections.map((section) => {
          const isSectionVisible = visibleSections.has(section);
          const sectionVideos = courseDetails.filter((i) => i.videoSection === section);

          return (
            <View key={`section-${section}`}>
              {/* Section Header */}
              <View
                style={{
                  marginBottom: !isSectionVisible ? verticalScale(5) : undefined,
                  borderBottomColor: "#DCDCDC",
                  paddingVertical: verticalScale(5),
                  borderBottomWidth: !isSectionVisible ? 1 : 0,
                }}
              >
                <View style={styles.sectionHeader}>
                  <Text
                    style={{
                      fontSize: fontSizes.FONT21,
                      width: scale(265),
                      fontFamily: "Poppins_500Medium",
                      color: theme.dark ? "#fff" : "#000",
                    }}
                  >
                    {section}
                  </Text>
                  <TouchableOpacity onPress={() => toggleSection(section)}>
                    <Entypo
                      name={isSectionVisible ? "chevron-up" : "chevron-down"}
                      size={scale(20)}
                      color={theme.dark ? "#fff" : "#000"}
                    />
                  </TouchableOpacity>
                </View>

                {!isSectionVisible && (
                  <Text
                    style={{
                      fontSize: fontSizes.FONT18,
                      fontFamily: "Poppins_400Regular",
                      color: theme.dark ? "#fff" : "#000",
                    }}
                  >
                    {sectionVideos.length} Lessons
                  </Text>
                )}
              </View>

              {/* Section Videos */}
              {isSectionVisible &&
                sectionVideos.map((item) => (
                  <View
                    key={`video-${item.id}`}
                    style={styles.videoCard}
                  >
                    <View style={styles.itemContainer}>
                      <View style={styles.itemContainerWrapper}>
                        <View style={styles.itemTitleWrapper}>
                          <Feather
                            name="video"
                            size={scale(16)}
                            color={theme.dark ? "#fff" : "#8a8a8a"}
                          />
                          <Text
                            style={[
                              styles.itemTitleText,
                              {
                                fontFamily: "Poppins_500Medium",
                                color: theme.dark ? "#fff" : "#525258",
                                fontSize: fontSizes.FONT17,
                                width: scale(245),
                              },
                            ]}
                          >
                            {item.title}
                          </Text>
                        </View>
                        <View style={styles.itemDataContainer}>
                          <Text
                            style={{
                              marginRight: 6,
                              fontFamily: "Poppins_400Regular",
                              color: theme.dark ? "#fff" : "#818181",
                              fontSize: fontSizes.FONT17,
                            }}
                          >
                            {item.videoLength}{" "}
                            {parseInt(item.videoLength) > 60 ? "hours" : "minutes"}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  videoCard: {
    borderWidth: 1,
    borderColor: "#E1E2E5",
    borderRadius: 8,
    marginVertical: verticalScale(5),
  },
  itemContainer: {
    marginHorizontal: 10,
    paddingVertical: 12,
  },
  itemContainerWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemTitleWrapper: {
    flexDirection: "row",
  },
  itemTitleText: {
    marginLeft: 8,
    fontSize: 16,
  },
  itemDataContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
