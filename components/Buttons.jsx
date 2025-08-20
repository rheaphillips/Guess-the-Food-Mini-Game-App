import { useRef } from "react";
import { Animated, Pressable, Image } from "react-native";

export function AnimatedButton({
  onPress,
  defaultImg,
  hoverImg,
  width,
  height,
  value = 1.1,
  ref = null,
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const defaultImgOpacity = useRef(new Animated.Value(1)).current;
  const hoverImgOpacity = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: value,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(defaultImgOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(hoverImgOpacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(defaultImgOpacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(hoverImgOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      ref={ref || useRef(null)}
    >
      <Animated.Image
        source={defaultImg}
        style={{
          borderRadius: 8,
          width,
          height,
          transform: [{ scale }],
          opacity: defaultImgOpacity,
        }}
      />
      <Animated.Image
        source={hoverImg}
        style={{
          borderRadius: 8,
          width,
          height,
          position: "absolute",
          top: 0,
          left: 0,
          transform: [{ scale }],
          opacity: hoverImgOpacity,
        }}
      />
    </Pressable>
  );
}

export function Button({ onPress, Img, width, height }) {
  return (
    <Pressable onPress={onPress}>
      <Image source={Img} style={{ borderRadius: 8, width, height }} />
    </Pressable>
  );
}
