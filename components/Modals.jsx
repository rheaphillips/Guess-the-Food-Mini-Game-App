import {
  Pressable,
  View,
  StyleSheet,
  ScrollView,
  Image,
  Platform,
  Modal,
} from "react-native";
import { Title, Subtitle, BodyText } from "./Text";
import { AnimatedButton } from "./Buttons";

export function HelpModal({ isOpenHelpModal, onCloseHelpModal }) {
  return (
    <Modal animationType="fade" transparent={true} visible={isOpenHelpModal}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Pressable onPress={onCloseHelpModal} style={styles.closeBtn}>
            <BodyText style={styles.closeBtnText}>&times;</BodyText>
          </Pressable>
          <Title>Instructions</Title>
          <Subtitle>Guess the 5-letter food item in 6 tries!</Subtitle>
          <ScrollView
            bounces={Platform.OS === "ios" ? false : true}
            overScrollMode={Platform.OS === "android" ? "never" : "auto"}
          >
            <BodyText>
              {"\u2022"} Each guess must be a valid food item that is 5 letters
              long
            </BodyText>
            <BodyText>
              {"\u2022"} After entering each word, the colour of the tiles
              change to reveal how close your guess was to the word
            </BodyText>
            <View style={styles.listItem}>
              <BodyText>{"\u2022"} Click</BodyText>
              <Image
                source={require("../assets/hint-0.png")}
                style={styles.listItemImg}
              />
              <BodyText>for upto three hints</BodyText>
            </View>
            <View style={styles.listItem}>
              <BodyText>{"\u2022"} Click</BodyText>
              <Image
                source={require("../assets/restart.png")}
                style={styles.listItemImg}
              />
              <BodyText>to reshuffle the word</BodyText>
            </View>
            <Subtitle>Examples</Subtitle>
            <Image
              source={require("../assets/instructions-1.png")}
              style={styles.exampleImg}
            />
            <BodyText>I is in the word and in the correct spot</BodyText>
            <Image
              source={require("../assets/instructions-2.png")}
              style={styles.exampleImg}
            />
            <BodyText>U is in the word but in the wrong spot</BodyText>
            <Image
              source={require("../assets/instructions-3.png")}
              style={styles.exampleImg}
            />
            <BodyText>T is not in the word in any spot</BodyText>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export function WinModal({ reset, onReset }) {
  return (
    <Modal animationType="fade" transparent={true} visible={reset}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Title>🎉 YOU WON!</Title>
          <AnimatedButton
            onPress={onReset}
            defaultImg={require("../assets/play-again.png")}
            hoverImg={require("../assets/play-again-hover.png")}
            width={145.423728814}
            height={40}
          />
        </View>
      </View>
    </Modal>
  );
}

export function LoseModal({ chosen, reset, onReset }) {
  return (
    <Modal animationType="fade" transparent={true} visible={reset}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Title>💔 YOU LOST!</Title>
          <Title>The word was {chosen}</Title>
          <AnimatedButton
            onPress={onReset}
            defaultImg={require("../assets/try-again.png")}
            hoverImg={require("../assets/try-again-hover.png")}
            width={130.847457627}
            height={40}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#00000099",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "80%",
    maxHeight: "80%",
    padding: 30,
    borderRadius: 10,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  closeBtn: {
    position: "absolute",
    top: 0,
    right: 10,
  },
  closeBtnText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    height: 30,
  },
  listItemImg: {
    height: 18,
    width: 18,
    marginRight: 5,
    marginLeft: 5,
  },
  exampleImg: {
    width: 205.079365079,
    height: 40,
    marginTop: 10,
    marginBottom: 10,
  },
});
