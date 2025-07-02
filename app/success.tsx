// app/success.tsx
import { useEffect } from "react";
import { useRouter, useGlobalSearchParams } from "expo-router";
import { View, ActivityIndicator } from "react-native";

export default function SuccessScreen() {
  const router = useRouter();
  const { courseId, ...rest } = useGlobalSearchParams();

  useEffect(() => {
    const timer = setTimeout(() => {
      // ⬅️ Redirect back to course details
      router.replace({
        pathname: "/(routes)/course-details",
        params: {
          id: courseId,
          ...rest, // send any other params you may need
        },
      });
    }, 1500); // optional delay for better UX

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#2467EC" />
    </View>
  );
}
