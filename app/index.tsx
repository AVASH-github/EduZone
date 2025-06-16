import { Redirect } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";

const Index = () => {
  const [loggedInUser, setLoggedInUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const subscription = async () => {
      
        const token = SecureStore.getItem("accessToken");
        setLoggedInUser(token ? true : false);
    setLoading(false);
        
      }; 
    
    subscription();
  }, []);

 
  return (
    <>
      { loading ? (
        <></>
      ) : (
        <Redirect href={!loggedInUser ? "/(routes)/onboarding" :"/(tabs)" } />

        )}
    </>
  );
}


export default Index;