import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from 'react'
import { useTheme } from "@/context/theme.context";
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale, verticalScale } from 'react-native-size-matters';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { fontSizes } from '@/themes/app.constant';
import { router } from 'expo-router';
import { MotiView } from "moti";
import { Skeleton } from "moti/skeleton";
import { NotificationsData } from "@/configs/constants";
import moment from "moment";
import { Swipeable } from "react-native-gesture-handler";
import useUserData from "@/hooks/useUserData";

export default function NoficationScreen() {
      const { theme } = useTheme();
      const [loader, setLoader] = useState(false);
      const { avatar } = useUserData();
      const [active, setActive] = useState("All");


      const renderItem = ({item}:{item:NotificationType}) =>(
        <Swipeable
      renderRightActions={() => (
        <Pressable
          style={styles.deleteButton}
         // onPress={() => notificationDeleteHandler(item)}
        >
          <MaterialIcons
            name="delete-outline"
            size={scale(25)}
            color={"#fff"}
          />
        </Pressable>
      )}
    >
      <Pressable
        style={[
          styles.notificationItem,
          {
            padding: scale(14),
            paddingVertical: verticalScale(10),
            backgroundColor:
              item.status === "Unread"
                ? theme.dark
                  ? "#3c43485c"
                  : "#f1f1f1"
                : theme.dark
                ? "#101010"
                : "#fff",
          },
        ]}
      >
        {avatar && (
          <Image
            source={{ uri: avatar }}
            width={scale(50)}
            height={scale(50)}
            borderRadius={scale(100)}
            style={{ marginRight: verticalScale(8) }}
          />
        )}
        <View style={{ width: scale(265) }}>
          <Text
            style={[
              styles.notificationText,
              {
                fontWeight: "500",
                fontFamily: "Poppins_500Medium",
                fontSize: fontSizes.FONT18,
                color: theme.dark ? "#fff" : "#000",
              },
            ]}
          >
            {item.title}
          </Text>
          <Text
            style={[
              styles.notificationText,
              {
                color: theme.dark ? "#fff" : "#333",
              },
            ]}
          >
            {item.message}
          </Text>
          <Text
            style={[
              styles.notificationText,
              {
                opacity: 0.8,
                color: theme.dark ? "#fff" : "#333",
              },
            ]}
          >
           1 day ago
          </Text>
        </View>
      </Pressable>
    </Swipeable>
      )
  return (
    <SafeAreaView
 style={{ flex: 1, backgroundColor: theme.dark ? "#101010" : "#fff" }}
      edges={["top"]}
    >
        <View style={{ overflow: "hidden", paddingBottom: verticalScale(1) }}>
      <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            height: theme.dark ? verticalScale(35) : verticalScale(35),
            backgroundColor: theme.dark ? "#131313" : "#fff",
            paddingHorizontal: scale(8),
            paddingBottom: theme.dark ? verticalScale(5) : verticalScale(0),
            shadowColor: theme.dark ? "#fff" : "#000",
            shadowOpacity: theme.dark ? 0.1 : 0.1,
            shadowOffset: { width: 0, height: 1 },
            shadowRadius: 1,
            elevation: theme.dark ? 5 : 5,
          }}
        >
<Pressable
            onPress={() => router.back()}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: scale(2),
            }}
          >
            <AntDesign
              name="left"
              size={scale(22)}
              color={theme.dark ? "#fff" : "005DE0"}
            />
<Text
              style={{
                color: theme?.dark ? "#fff" : "#005DE0",
                fontSize: fontSizes.FONT25,
                
              }}
            >
              Back
            </Text>
          </Pressable>
            <Text
            style={{
              color: theme.dark ? "#fff" : "#000",
              textAlign: "center",
              width: scale(200),
              fontSize: fontSizes.FONT28,
            }}
          >
            Notifications
          </Text>

        </View>
        </View>
         <View
              style={[
                  styles.container,
                  {
                    backgroundColor: theme.dark ? "#101010" : "#fff",
                  }
                ]}
              >
                  {loader ? (
          <View style={{ padding: scale(16) }}>
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i: any, index: number) => (
              <MotiView
                transition={{
                  type: "timing",
                }}
                style={{
                  flexDirection: "row",
                  gap: scale(15),
                  marginBottom: verticalScale(15),
                }}
                animate={{
                  backgroundColor: theme.dark ? "#101010" : "#ffff",
                }}
                key={index}
              >
                <Skeleton
                  colorMode={theme.dark ? "dark" : "light"}
                  radius={"round"}
                  height={scale(60)}
                  width={scale(60)}
                />
                <Skeleton
                  colorMode={theme.dark ? "dark" : "light"}
                  height={scale(50)}
                  width={scale(240)}
                />
              </MotiView>
            ))}
          </View>
        ) : (
          <>
            <View>
              <ScrollView
                horizontal={true}
                style={{ padding: scale(10) }}
                showsHorizontalScrollIndicator={false}
              >
                <TouchableOpacity
                  style={{
                    padding: verticalScale(8),
                    backgroundColor:
                      active === "All"
                        ? "#705DF2"
                        : theme.dark
                        ? "#3c43485c"
                        : "#f5f5f5",
                    borderRadius: scale(5),
                    marginRight: scale(20),
                  }}
                  onPress={() => setActive("All")}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontFamily: "Poppins_500Medium",
                      fontSize: fontSizes.FONT18,
                    }}
                  >
                    All
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    padding: verticalScale(8),
                    backgroundColor:
                      active === "Courses"
                        ? "#705DF2"
                        : theme.dark
                        ? "#3c43485c"
                        : "#f5f5f5",
                    borderRadius: scale(5),
                    marginRight: scale(20),
                  }}
                  onPress={() => setActive("Courses")}
                >
                  <Text
                    style={{
                      color: theme.dark ? "#fff" : "#000",
                      fontFamily: "Poppins_500Medium",
                      fontSize: fontSizes.FONT18,
                    }}
                  >
                    Courses
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    padding: verticalScale(8),
                    backgroundColor:
                      active === "Resources"
                        ? "#705DF2"
                        : theme.dark
                        ? "#3c43485c"
                        : "#f5f5f5",
                    borderRadius: scale(5),
                    marginRight: scale(20),
                  }}
                  onPress={() => setActive("Resources")}
                >
                  <Text
                    style={{
                      color: theme.dark ? "#fff" : "#000",
                      fontFamily: "Poppins_500Medium",
                      fontSize: fontSizes.FONT18,
                    }}
                  >
                    Resources
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    padding: verticalScale(8),
                    backgroundColor:
                      active === "Support Center"
                        ? "#705DF2"
                        : theme.dark
                        ? "#3c43485c"
                        : "#f5f5f5",
                    borderRadius: scale(5),
                    marginRight: scale(20),
                  }}
                  onPress={() => setActive("Support Center")}
                >
                  <Text
                    style={{
                      color: theme.dark ? "#fff" : "#000",
                      fontFamily: "Poppins_500Medium",
                      fontSize: fontSizes.FONT18,
                    }}
                  >
                    Support Center
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>

            <FlatList
            
              data={NotificationsData}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
            />
          </>
        )}

          

              </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    marginTop: verticalScale(2),
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: verticalScale(8),
    marginBottom: 5,
  },
  notificationItem: {
    flexDirection: "row",
    paddingVertical: verticalScale(5),
    backgroundColor: "#fff",
  },
  notificationIcon: {
    width: scale(30),
    height: scale(30),
    borderRadius: 20,
    backgroundColor: "#FFCA28",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  notificationInitial: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  notificationText: {
    flex: 1,
    color: "#333",
    fontFamily: "Poppins_400Regular",
    fontSize: fontSizes.FONT17,
  },
  deleteButton: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: scale(50),
    height: "100%",
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});