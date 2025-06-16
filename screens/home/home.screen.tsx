import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import React from 'react'
import {LinearGradient} from 'expo-linear-gradient'
import { useTheme } from "@/context/theme.context";
import WelcomeHeader from "@/components/home/welcome.header";

export default function HomeScreen() {
      const { theme } = useTheme();
  return (
    <>
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
         <ScrollView>

         </ScrollView>
      </LinearGradient>
    </>
  )
}

const styles = StyleSheet.create({})