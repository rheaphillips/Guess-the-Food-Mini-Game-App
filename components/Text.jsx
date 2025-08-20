import { Text, StyleSheet } from "react-native";

export function Title({ children }) {
  return <Text style={{ ...styles.text, ...styles.title }}>{children}</Text>;
}

export function Subtitle({ style, children }) {
  return (
    <Text style={{ ...styles.text, ...styles.subtitle, ...style }}>
      {children}
    </Text>
  );
}

export function BodyText({ style, children }) {
  return (
    <Text style={{ ...styles.text, ...styles.bodytext, ...style }}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: "Segoe UI",
    color: "#333",
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    paddingBottom: 10,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 15,
    paddingTop: 5,
    paddingBottom: 5,
    fontWeight: "700",
  },
  bodytext: {
    fontSize: 15,
    paddingTop: 5,
    paddingBottom: 5,
  },
});
