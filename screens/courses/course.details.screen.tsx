import ReviewCard from "@/components/cards/review.card";
import CourseDetailsTabs from "@/components/course/course.details.tabs";
import CourseLesson from "@/components/course/course.lesson";
import { useTheme } from "@/context/theme.context";
import useUser, { setAuthorizationHeader } from "@/hooks/fetch/useUser";
import useUserData from "@/hooks/useUserData";
import {
  fontSizes,
  IsAndroid,
  IsIPAD,
  SCREEN_WIDTH,
  windowHeight,
  windowWidth,
} from "@/themes/app.constant";
import { Spacer } from "@/utils/skelton";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { BlurView } from "expo-blur";
import { router, useLocalSearchParams } from "expo-router";
import { MotiView } from "moti";
import { Skeleton } from "moti/skeleton";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import { Linking } from "react-native";
import { useKhalti } from "@/src/hooks/useKhalti";
import * as WebBrowser from "expo-web-browser";
import { AppState } from "react-native";
export default function CourseDetailsScreen() {
   const params: any= useLocalSearchParams();
    const [activeButton, setActiveButton] = useState("About");
    const { user, loader: userLoader } = useUser();
    const courseData: CourseType | any = params;
      const [loader, setLoader] = useState(true);
       const [isExpanded, setIsExpanded] = useState(false);
       const [purchaseLoader, setPurchaseLoader] = useState(false);
  const [reviews, setReviews] = useState([]);
     const prerequisites: BenefitsType[] | any = JSON.parse(params?.prerequisites);
  const benefits: BenefitsType[] | any = JSON.parse(params?.benefits);
    const courseContent: CourseDataType[] | any = JSON.parse(
    params?.courseContent
  );
    


  // Check purchase flag from URL query
  const justPurchased = params.purchased === "true";

  React.useEffect(() => {
    if (justPurchased) {
      alert("Payment successful! Enjoy your course.");
      // Optionally refresh user data here to update purchase status
    }
  }, [justPurchased]);


    
  const { name, email } = useUserData();

  const userOrders = user?.orders;
  const isPurchased = userOrders?.find(
    (i: OrderType) => i.courseId === courseData.id
  );


    //khalti integration 

const { initiate, isLoading, initiationError } = useKhalti({
    onSuccess: (paymentStatus) => {
      // Handle success (optional)
     // Alert.alert("Payment success", "You can now enter the course.");
      // Refresh purchased courses or update UI here
    },
    onError: (error) => {
      //Alert.alert("Payment failed", error.message || "Try again.");
    },
  });


const handlePurchase = async () => {
  setPurchaseLoader(true);

  try {
    await setAuthorizationHeader();

    if (courseData.price === "0") {
      // Free course logic here...
      return;
    }

    if (!user || !user.email || !user.name) {
      Alert.alert("Error", "User info is missing. Please login again.");
      return;
    }
const baseUrl = process.env.EXPO_PUBLIC_SERVER_URI;
    const paymentRequest = {
      amount: parseInt(courseData.price) * 100,
      purchase_order_id: courseData.id,
      purchase_order_name: courseData.name,
      website_url: "https://eduzone.com",
    return_url: `${baseUrl}/khalti-verify-payment?purchase_order_id=${courseData.id}&userId=${user.id}`,
      customer_info: {
        name: user.name,
        email: user.email,
        phone: "9800000000",
      },
    };

    const response = await initiate(paymentRequest);

    if (!response?.payment_url) {
      Alert.alert("Error", "Payment initiation failed");
      return;
    }

    // Open Khalti payment page in browser
    const browserResult = await WebBrowser.openBrowserAsync(response.payment_url);

    if (browserResult.type === "dismiss") {
      // Browser closed, now verify payment from backend
      const verifyResponse = await axios.get(
        `${process.env.EXPO_PUBLIC_SERVER_URI}/khalti-verify-payment`,
        {
          params: { pidx: response.pidx, userId: user.id },
        }
      );

      if (verifyResponse.data.success) {
        Alert.alert("Success", "Payment verified. Course unlocked!");
        // TODO: refresh user data or purchased courses here

        // Navigate or refresh course details page
        router.replace({
          pathname: "/(routes)/course-details",
          params: { id: courseData.id },
        });
      } else {
        Alert.alert("Payment failed", verifyResponse.data.message || "Try again.");
      }
    }
  } catch (error: any) {
    console.error("Purchase error:", error);
    Alert.alert("Error", "Something went wrong during payment.");
  } finally {
    setPurchaseLoader(false);
  }
};



  const { theme } = useTheme(); 
  const reviewsFetchingHandler = async () => {
    setActiveButton("Reviews");

    await axios
      .get(`${process.env.EXPO_PUBLIC_SERVER_URI}/get-reviews/${params.id}`)
      .then((res) => {
        setReviews(res.data.reviewsData);
        setLoader(false);
      });
  };

   const handleCourseAccess = () => {
    router.push({
      pathname: "/(routes)/course-access",
      params: {
        ...courseData,
      },
    });
  };

  return (
   <View
   style ={{flex: 1, backgroundColor: theme.dark ? "#131313" : "#fff"}}
   >
<ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
 <View style={{ padding: windowWidth(15) }}>
     <Image
            source={{
              uri: courseData.thumbnail ,
          }}
            resizeMode="contain"
            style={{
              width: IsAndroid ? SCREEN_WIDTH - 40 : SCREEN_WIDTH - 25,
              height: IsAndroid
                ? (SCREEN_WIDTH - 28) * 0.5625
                : (SCREEN_WIDTH - 40) * 0.5625,
              alignSelf: "center",
              borderRadius: windowWidth(10),
            }}
          />
           <Text
            style={{
              fontSize: fontSizes.FONT22,
              fontFamily: "Poppins_600SemiBold",
              paddingTop: verticalScale(10),
              color: theme.dark ? "#fff" : "#3E3B54",
              lineHeight: windowHeight(20),
            }}
          >
            {courseData.name}
          </Text>
              <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
<View style={{ flexDirection: "row" }}>

<Text
                style={{
                  fontSize: fontSizes.FONT22,
                  fontFamily: "Poppins_400Regular",
                  paddingTop: windowHeight(8),
                  color: theme.dark ? "#fff" : "#000",
                  lineHeight: windowHeight(20),
                }}
              >
                ${courseData?.price}
              </Text>

              <Text
                style={{
                  fontSize: fontSizes.FONT22,
                  fontFamily: "Poppins_400Regular",
                  color: theme.dark ? "#fff" : "#3E3B54",
                  lineHeight: IsIPAD ? windowHeight(0) : windowHeight(20),
                  paddingLeft: windowWidth(5),
                  textDecorationLine: "line-through",
                }}
              >
                ${courseData?.estimatedPrice}
              </Text>
</View>
            <Text
              style={{
                fontSize: fontSizes.FONT18,
                fontFamily: "Poppins_400Regular",
                color: theme.dark ? "#fff" : "#000",
              }}
            >
              {courseData?.purchased} Students
            </Text>

          </View>
{/* Course prerequisites */}
<View style={{ paddingTop: windowHeight(12) }}>
            <Text
              style={{
                fontSize: fontSizes.FONT24,
                fontFamily: "Poppins_600SemiBold",
                paddingTop: windowHeight(8),
                color: theme.dark ? "#fff" : "#3E3B54",
                lineHeight: windowHeight(20),
              }}
            >
              Course Prerequisites
            </Text>
            {prerequisites?.map((i: BenefitsType, index: number) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  paddingVertical: windowHeight(5),
                }}
              >
                <Ionicons
                  name="checkmark-done-outline"
                  size={scale(17)}
                  color={theme.dark ? "#fff" : "#000"}
                />
                <Text
                  style={{
                    marginLeft: windowWidth(5),
                    fontSize: fontSizes.FONT18,
                    color: theme.dark ? "#fff" : "#000",
                  }}
                >
                  {i?.title}
                </Text>
              </View>
            ))}
</View>
 {/* Course Benefits */}
          <View style={{ paddingTop: windowHeight(12) }}>
            <Text
              style={{
                fontSize: fontSizes.FONT24,
                fontFamily: "Poppins_600SemiBold",
                paddingTop: windowHeight(8),
                color: theme.dark ? "#fff" : "#3E3B54",
                lineHeight: windowHeight(20),
              }}
            >
              Course Benefits
            </Text>
            {benefits?.map((i: BenefitsType, index: number) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  paddingVertical: windowHeight(5),
                }}
              >
                <Ionicons
                  name="checkmark-done-outline"
                  size={scale(17)}
                  color={theme.dark ? "#fff" : "#000"}
                />
                <Text
                  style={{
                    marginLeft: windowWidth(5),
                    fontSize: fontSizes.FONT18,
                    color: theme.dark ? "#fff" : "#000",
                  }}
                >
                  {i?.title}
                </Text>
              </View>
            ))}
          </View>

 {/* Course Tabs */}
          <CourseDetailsTabs
            activeButton={activeButton}
            reviewsFetchingHandler={reviewsFetchingHandler}
            setActiveButton={setActiveButton}

          />

{activeButton === "About" && (
  <View
    style={{
                marginHorizontal: scale(12),
                marginVertical: verticalScale(10),
              }}
  >
       <Text
                style={{
                  fontSize: fontSizes.FONT25,
                  fontFamily: "Poppins_500Medium",
                  color: theme.dark ? "#fff" : "#000",
                }}
              >
                About course
              </Text>
              <Text
                style={{
                  color: !theme.dark ? "#525258" : "#fff",
                  fontSize: fontSizes.FONT20,
                  marginTop: 10,
                  textAlign: "justify",
                }}
              >
                 {isExpanded
                  ? courseData?.description
                  : courseData?.description.slice(0, 302)}
                </Text> 
                {courseData?.description.length > 302 && (
                <TouchableOpacity
                  style={{ marginTop: verticalScale(2) }}
                  onPress={() => setIsExpanded(!isExpanded)}
                >
                  <Text
                    style={{
                      color: "#2467EC",
                      fontSize: fontSizes.FONT16,
                    }}
                  >
                    {isExpanded ? "Show Less" : "Show More"}
                    {isExpanded ? "-" : "+"}
                  </Text>
                </TouchableOpacity>
              )}
              </View>
)}
       {activeButton === "Lessons" && (
            <View
              style={{
                marginHorizontal: verticalScale(16),
                marginVertical: scale(15),
              }}
            >
              <CourseLesson courseDetails={courseContent} />
            </View>
          )}
{activeButton === "Reviews" && (
            <View style={{ marginHorizontal: 16, marginVertical: 25 }}>
              <View style={{ rowGap: 25 }}>
                {loader && (
                  <>
                    {[0, 1, 2, 3, 4, 5].map((i: any) => (
                      <MotiView
                        key={i}
                        transition={{
                          type: "timing",
                        }}
                        style={{
                          flex: 1,
                          flexDirection: "row",
                          gap: scale(10),
                          marginVertical: verticalScale(10),
                        }}
                        animate={{
                          backgroundColor: theme.dark ? "#131313" : "#fff",
                        }}
                      >
                        <Skeleton
                          colorMode={theme.dark ? "dark" : "light"}
                          radius="round"
                          height={verticalScale(55)}
                          width={verticalScale(55)}
                        />
                        <View>
                          <Skeleton
                            colorMode={theme.dark ? "dark" : "light"}
                            width={scale(240)}
                            height={verticalScale(22)}
                          />
                          <Spacer height={verticalScale(15)} />
                          <Skeleton
                            colorMode={theme.dark ? "dark" : "light"}
                            width={scale(240)}
                            height={verticalScale(22)}
                          />
                        </View>
                      </MotiView>
                    ))}
</>
                )}
              </View>
              {reviews?.map((item: ReviewsType, index: number) => (
                <ReviewCard item={item} key={index} />
              ))}
            </View>
          )}
 </View>

</ScrollView>

  {/* Bottom button */}

      <BlurView
        intensity={theme.dark ? 30 : 2}
        style={{
          backgroundColor: !theme.dark ? "#eaf3fb85" : "#000",
          paddingHorizontal: windowHeight(12),
          paddingVertical: windowHeight(8),
          paddingBottom: IsAndroid ? verticalScale(5) : windowHeight(20),
        }}
      >
        {isPurchased ? (
          <TouchableOpacity
            style={{
              backgroundColor: "#2467EC",
              paddingVertical: windowHeight(10),
              borderRadius: windowWidth(8),
            }}
            onPress={() => handleCourseAccess()}
          >
            <Text
              style={{
                textAlign: "center",
                color: "#FFFF",
                fontSize: fontSizes.FONT24,
                fontFamily: "Poppins_600SemiBold",
              }}
            >
              Enter to course
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{
              backgroundColor: "#2467EC",
              paddingVertical: windowHeight(10),
              borderRadius: windowWidth(8),
              opacity: purchaseLoader ? 0.6 : 1,
            }}
            disabled={purchaseLoader}
            onPress={handlePurchase}
          >
            <Text
              style={{
                textAlign: "center",
                color: "#FFFF",
                fontSize: fontSizes.FONT24,
                fontFamily: "Poppins_600SemiBold",
              }}
            >
              Buy now{" "}
              {courseData?.price === "0" ? "(free)" : `Rs ${courseData?.price}`}
            </Text>
          </TouchableOpacity>
        )}
      </BlurView>
   </View>
  )
}

const styles = StyleSheet.create({})