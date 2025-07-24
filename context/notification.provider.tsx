import { View, Text, Alert } from "react-native";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import * as Notifications from "expo-notifications";
import useUser, { setAuthorizationHeader } from "@/hooks/fetch/useUser";
import { registerForPushNotificationsAsync } from "@/utils/registerForPushNotificationsAsync";
import axios from "axios";
import { router } from "expo-router";

// Add this at the top level to ensure notifications show even when app is foregrounded
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,    // show notification alert in foreground
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

interface NotificationContextType {
  expoPushToken: string | null;
  notification: Notifications.Notification | null;
  error: Error | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    Alert.alert("useNotification must be used within a notification provider");
  }
  return context!;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  const { user, loader } = useUser();

  useEffect(() => {
    if (expoPushToken) {
      console.log("Expo Push Token:", expoPushToken);
    }
  }, [expoPushToken]);

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      const registerPushNotification = async () => {
        try {
          const token = await registerForPushNotificationsAsync();
          console.log("Registered push token:", token);

          if (token) {
            if (!loader && user && user.pushToken !== token) {
              await setAuthorizationHeader();

              console.log("Updating token on backend...");
              await axios.put(
                `${process.env.EXPO_PUBLIC_SERVER_URI}/update-push-token`,
                { pushToken: token }
              );
              console.log("Token updated on backend");

              setExpoPushToken(token);
            } else {
              setExpoPushToken(token);
            }
          }
        } catch (error: any) {
          setError(error);
          console.error("Push registration error:", error);
          Alert.alert("Push registration failed", error.message);
        }
      };
      registerPushNotification();
    }

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("Notification received:", notification);
        Alert.alert(
          "Notification received",
          notification.request.content.body || ""
        );
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification response received:", response);
        const data = response.notification.request.content.data;

        if (data?.courseData) {
          router.push({
            pathname: "/(routes)/course-access",
            params: {
              ...data.courseData,
              activeVideo:
                data.activeVideo as
                  | string
                  | number
                  | (string | number)[]
                  | null
                  | undefined,
            },
          });
        } else if (typeof data?.link === "string" && data.link.length > 0) {
          console.log("Navigating to link:", data.link);
          router.push(data.link as any);
        }
      });

    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (!response?.notification) {
        return;
      }
    });

    return () => {
      isMounted = false;

      if (notificationListener.current) {
        notificationListener.current.remove();
        notificationListener.current = null;
      }
      if (responseListener.current) {
        responseListener.current.remove();
        responseListener.current = null;
      }
    };
  }, [loader]);

  return (
    <NotificationContext.Provider
      value={{ expoPushToken, notification, error }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
