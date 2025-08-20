import { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  View,
  Text,
  useWindowDimensions,
} from "react-native";

export function Grid({ children }) {
  return <View style={styles.grid}>{children}</View>;
}

export function Row({ children }) {
  const { height } = useWindowDimensions();
  return (
    <View style={[styles.row, { height: height * (4.75 / 60) }]}>
      {children}
    </View>
  );
}

export function Box({
  isActive,
  enteredLetter,
  gridColour,
  isFlipped,
  children,
}) {
  const { height } = useWindowDimensions();
  const flip = useRef(new Animated.Value(1)).current;

  useEffect(
    function () {
      if (!isFlipped) return;
      flip.setValue(1);
      flip.stopAnimation(() => {
        Animated.sequence([
          Animated.timing(flip, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(flip, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      });
    },
    [isFlipped]
  );

  return (
    <Animated.View
      style={[
        styles.box,
        isActive ? styles.active : styles.inactive,
        gridColour ? styles[gridColour] : styles.default,
        { transform: [{ scaleY: flip }] },
      ]}
    >
      {children}
      <Text
        style={[
          styles.boxText,
          gridColour ? styles.boxTextRevealed : styles.boxTextDefault,
          { fontSize: (24 * height) / 700 },
        ]}
      >
        {enteredLetter}
      </Text>
    </Animated.View>
  );
}

export function Hint({ children }) {
  const { height } = useWindowDimensions();
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(function () {
    opacity.setValue(0);
    opacity.stopAnimation(() => {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  }, []);

  return (
    <Animated.View
      style={[
        styles.hintBox,
        {
          width: (17 * height) / 700,
          height: (17 * height) / 700,
          top: (-4 * height) / 700,
          right: (-4 * height) / 700,
          opacity,
        },
      ]}
    >
      <Text style={[styles.hintBoxText, { fontSize: (10 * height) / 700 }]}>
        {children}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  grid: {
    alignItems: "center",
    gap: 2,
    marginRight: 30,
    marginLeft: 30,
    marginBottom: 20,
    marginTop: 40,
  },
  row: {
    flexDirection: "row",
    gap: 2,
  },
  box: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    zIndex: 5,
  },
  inactive: {
    borderColor: "#dcdcdc",
    shadowColor: "#0000001a",
  },
  active: {
    borderColor: "#c2c0c0",
    shadowColor: "#00000080",
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
    fontWeight: "900",
    fontFamily: "Segoe UI",
  },
  boxTextDefault: {
    color: "#333",
  },
  boxTextRevealed: {
    color: "white",
  },
  hintBox: {
    backgroundColor: "#338475",
    color: "white",
    position: "absolute",
    shadowColor: "#00000033",
    borderRadius: 3,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  hintBoxText: {
    fontWeight: "900",
    fontFamily: "Segoe UI",
    color: "white",
  },
});
