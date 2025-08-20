import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ImageBackground, Image } from "react-native";
import { useState } from "react";
import { Modal, HelpModal } from "./Modals";
import { AnimatedButton } from "./Buttons";

const image = require("../assets/background-phone.png");

export function Home({ onOpenGame }) {
  const [isOpenHelpModal, setIsOpenHelpModal] = useState(false);

  function handleCloseOpenModal() {
    setIsOpenHelpModal(true);
  }

  function handleCloseHelpModal() {
    setIsOpenHelpModal(false);
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={image}
        resizeMode="cover"
        style={styles.background}
      >
        <View style={styles.buttons}>
          <AnimatedButton
            onPress={onOpenGame}
            defaultImg={require("../assets/play.png")}
            hoverImg={require("../assets/play-hover.png")}
            width={100}
            height={50}
          />
          <AnimatedButton
            onPress={handleCloseOpenModal}
            defaultImg={require("../assets/instructions.png")}
            hoverImg={require("../assets/instructions-hover.png")}
            width={247.727272727}
            height={50}
          />
        </View>
        <HelpModal
          isOpenHelpModal={isOpenHelpModal}
          onCloseHelpModal={handleCloseHelpModal}
        />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: "center",
  },
  buttons: {
    marginTop: 130,
    gap: 15,
    justifyContent: "center",
    alignItems: "center",
  },
});
