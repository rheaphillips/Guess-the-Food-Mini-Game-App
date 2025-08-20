import { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  useWindowDimensions,
  Animated,
} from "react-native";

const keyLayout = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Enter", "Z", "X", "C", "V", "B", "N", "M", "backspace"],
];

export function Keyboard({ evalKey, keyboardColours, invalid }) {
  const { width, height } = useWindowDimensions();
  const shake = useRef(new Animated.Value(0)).current;

  useEffect(
    function () {
      shake.setValue(0);
      shake.stopAnimation(() => {
        Animated.sequence([
          Animated.timing(shake, {
            toValue: 1,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(shake, {
            toValue: -1,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(shake, {
            toValue: 0,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(shake, {
            toValue: 1,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(shake, {
            toValue: -1,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(shake, {
            toValue: 0,
            duration: 50,
            useNativeDriver: true,
          }),
        ]).start();
      });
    },
    [invalid]
  );

  const translateX = shake.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-3, 0, 3], // Adjust these values for desired shake intensity
  });

  return (
    <View>
      {keyLayout.map((row, i) => (
        <View key={i} style={styles.keyboardRow}>
          {row.map((key) => (
            <Animated.View
              key={key}
              style={
                key.toUpperCase() === invalid
                  ? { transform: [{ translateX }] }
                  : {}
              }
            >
              <Pressable
                style={[
                  styles.box,
                  keyboardColours[key.toUpperCase()]
                    ? styles[keyboardColours[key.toUpperCase()]]
                    : styles.default,
                  {
                    minWidth: width / 11,
                    height: height * (2 / 30),
                  },
                ]}
                onPress={() => evalKey(key.toUpperCase())}
              >
                {key === "backspace" ? (
                  <Image
                    source={require("../assets/backspace.png")}
                    style={styles.backspaceBtn}
                  />
                ) : (
                  <Text
                    style={[
                      styles.boxText,
                      keyboardColours[key.toUpperCase()]
                        ? styles.boxTextRevealed
                        : styles.boxTextDefault,
                    ]}
                  >
                    {key}
                  </Text>
                )}
              </Pressable>
            </Animated.View>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  keyboardRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginLeft: 10,
    marginRight: 10,
  },

  box: {
    alignItems: "center",
    justifyContent: "center",
    margin: 1,
    padding: 5,
    borderRadius: 7,
    borderColor: "#dcdcdc",
    shadowColor: "#0000001a",
  },
  default: {
    backgroundColor: "white",
    borderWidth: 2,
  },
  correct: {
    backgroundColor: "#338475",
  },
  present: {
    backgroundColor: "#d6a200",
  },
  absent: {
    backgroundColor: "#4b4f54",
  },

  boxText: {
    fontSize: 20,
    fontWeight: 900,
    fontFamily: "Segoe UI",
  },
  boxTextDefault: {
    color: "#333",
  },
  boxTextRevealed: {
    color: "white",
  },

  backspaceBtn: {
    width: 26.72,
    height: 20,
  },
});
