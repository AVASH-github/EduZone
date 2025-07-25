import React, { FC } from "react";
import { Text, View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

type Props = {
  rating: number;
};

const Ratings: FC<Props> = ({ rating }) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(
        <View key={`full-${i}`} style={{ marginLeft: 5 }}>
          <FontAwesome name="star" size={24} color="#F6B100" />
        </View>
      );
    } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
      stars.push(
        <View key={`half-${i}`}>
          <FontAwesome name="star-half-empty" size={24} color="#F6B100" />
        </View>
      );
    } else {
      stars.push(
        <View key={`empty-${i}`}>
          <FontAwesome name="star-o" size={24} color="#F6B100" />
        </View>
      );
    }
  }

  return <View style={{ flexDirection: "row" }}>{stars}</View>; // Use View to wrap stars
};

export default Ratings;
