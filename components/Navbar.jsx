import { View, StyleSheet, useWindowDimensions } from "react-native";
import { AnimatedButton } from "./Buttons";
import { useRef } from "react";

export function Navbar({ children }) {
  const { height } = useWindowDimensions();
  return (
    <View style={[styles.navbar, { height: (100 * height) / 800 }]}>
      {children}
    </View>
  );
}

export function Logo({ onPress }) {
  const { height } = useWindowDimensions();
  return (
    <View style={[styles.logo, { marginTop: (45 * height) / 800 }]}>
      <AnimatedButton
        onPress={onPress}
        defaultImg={require("../assets/name.png")}
        hoverImg={require("../assets/name.png")}
        width={214.625}
        height={31.25}
      />
    </View>
  );
}

export function NavBtns({ children }) {
  const { height } = useWindowDimensions();
  return (
    <View style={[styles.navBtns, { marginTop: (45 * height) / 800 }]}>
      {children}
    </View>
  );
}

export function NavBtn({ onPress, img }) {
  const button = useRef(null);

  function handlePress() {
    onPress();
    button.current.blur();
  }
  return (
    <AnimatedButton
      onPress={handlePress}
      defaultImg={img}
      hoverImg={img}
      width={30}
      height={30}
      ref={button}
      value={1.3}
    />
  );
}

export function HamburgerMenu({ onOpenHamburgerMenu }) {
  const { height } = useWindowDimensions();
  return (
    <View style={[styles.hamburgerMenu, { marginTop: (45 * height) / 800 }]}>
      <AnimatedButton
        onPress={onOpenHamburgerMenu}
        defaultImg={require("../assets/menu.png")}
        hoverImg={require("../assets/menu.png")}
        width={30}
        height={30}
        value={1.3}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: 125,
    backgroundColor: "white",
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {},
  navBtns: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  hamburgerMenu: {
    position: "absolute",
    right: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
