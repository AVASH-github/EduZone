import { Redirect } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";

const Index = () => {
  const [loggedInUser, setLoggedInUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await SecureStore.getItemAsync("accessToken");
        setLoggedInUser(!!token);
      } catch (error) {
        console.error("Error checking auth:", error);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) {
    return null;
  }

  return <Redirect href={!loggedInUser ? "/(routes)/onboarding" : "/(tabs)"} />;
};

export default Index;