import { StyleSheet, Text, View } from "react-native";
import React from "react";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";

export default function GradiantText({
  text,
  styles,
}: {
  text: string;
  styles: any;
}) {
  return (
    // @ts-ignore
    <MaskedView
      maskElement={
        <Text style={[styles, { backgroundColor: "transparent",      padding: 0, margin:0, opacity: 1 }]}>{text}</Text>
      }
    >
      <LinearGradient
        colors={["#6D55FE", "#8976FC"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={[styles, { opacity: 0 }]}>{text}</Text>
      </LinearGradient>
    </MaskedView>
  );
}

const styles = StyleSheet.create({});