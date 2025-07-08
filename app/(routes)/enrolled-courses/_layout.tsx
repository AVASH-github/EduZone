// app/(routes)/course-details/_layout.tsx
import { fontSizes } from "@/themes/app.constant";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { router, Slot, Stack } from "expo-router";
import { scale } from "react-native-size-matters";
import { useTheme } from "@/context/theme.context";


export default function CourseDetailsLayout() {
       const { theme } = useTheme();
       
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 

             headerTitle: () => (
            <View style={{ flex:1 , paddingLeft:scale(35) }}>
              <Text style={{ 
                color: theme.dark ? "#fff" : "#000",
                fontSize: fontSizes.FONT25,
                fontWeight: 'bold'
              }}>
                Enrolled Courses
              </Text>
            </View>
          ),
            headerTitleStyle: {
        color: theme.dark ? "#fff" : "#000",
            //fontSize: fontSizes.FONT22,
          },
          
    headerStyle: { backgroundColor: theme.dark ? "#131313" : "#fff" },
       headerShadowVisible: true,
      
       headerLeft: ()=>(
        <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: scale(5),
              }}
              onPress={() => router.back()}
            >
              <AntDesign
                name="left"
                size={scale(30)}
                color={theme.dark ? "#fff" : "#005DE0"}
              />
              <Text
                style={{
                 color: theme?.dark ? "#fff" : "#005DE0",
                  fontSize: fontSizes.FONT20,
                }}
                
              >
                Back
              </Text>
            </Pressable>
       ),
        }} 
        
      />
    </Stack>
  );
}

const styles = StyleSheet.create({});