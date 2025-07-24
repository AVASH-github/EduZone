import React from 'react';
import { View } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';

export default function GradientText({ text }: { text: string }) {
  return (
    <View style={{ height: 40 }}>
      <Svg height="100%" width="100%">
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="100%" y2="0">
            <Stop offset="0" stopColor="#1528c6" />
            <Stop offset="1" stopColor="#26d4ea" />
          </LinearGradient>
        </Defs>
        <SvgText
          fill="url(#grad)"
          fontSize="30"
          x="0"
          y="32"
          fontFamily="Poppins_500Medium"
        >
          {text}
        </SvgText>
      </Svg>
    </View>
  );
}