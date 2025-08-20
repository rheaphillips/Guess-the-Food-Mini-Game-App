//////////////// IMPORTS ////////////////

import { createRef, useCallback, useEffect, useReducer, useRef } from "react";
import { StyleSheet, View, ImageBackground } from "react-native";
import { HamburgerMenu, Navbar, NavBtn, NavBtns, Logo } from "./Navbar";
import { HelpModal } from "./Modals";
import { MainContents } from "./MainContents";

//////////////// GLOBAL VARIABLES ////////////////

const groceryWords = [
  "apple",
  "grape",
  "peach",
  "mango",
  "lemon",
  "onion",
  "beans",
  "chard",
  "bacon",
  "steak",
  "roast",
  "cream",
  "gouda",
  "bread",
  "bagel",
  "pasta",
  "penne",
  "ramen",
  "flour",
  "sugar",
  "honey",
  "cumin",
  "thyme",
  "basil",
  "jelly",
  "yeast",
  "cocoa",
  "chips",
  "candy",
  "dates",
  "sushi",
  "juice",
  "broth",
  "stock",
  "mochi",
  "salsa",
  "pesto",
  "gravy",
  "decaf",
  "latte",
  "oreos",
  "guava",
  "pizza",
  "toast",
  "pears",
  "olive",
  "salad",
  "berry",
  "sauce",
  "spice",
  "wafer",
  "hazel",
  "curry",
  "cider",
  "tacos",
  "water",
  "melon",
  "limes",
  "beets",
  "snail",
  "leeks",
  "mints",
  "herbs",
  "grits",
  "crabs",
  "donut",
  "wheat",
  "fries",
  "cacao",
  "fudge",
  "icing",
  "scone",
  "pecan",
  "cakes",
  "kebab",
  "wings",
  "nacho",
  "chive",
  "dairy",
  "clams",
  "fruit",
  "crepe",
  "seeds",
  "pitas",
  "tarts",
  "prune",
  "mocha",
  "syrup",
  "ranch",
  "clove",
  "eggos",
  "okras",
  "plums",
  "prawn",
  "rolls",
  "tikka",
  "penne",
  "squid",
  "wraps",
  "tapas",
  "jello",
  "trout",
  "grain",
  "meats",
  "humus",
  "saute",
];

///////////////////////// HELPER FUNCTIONS /////////////////////////

function randomizeWord() {
  return groceryWords[Math.round(Math.random() * (groceryWords.length - 1))]
    .toUpperCase()
    .split("");
}

function randomInt(num) {
  return Math.round(Math.random() * (num - 1));
}

function createGrid() {
  const arr = [];
  for (let i = 0; i < 6; i++) {
    arr.push([]);
    for (let j = 0; j < 5; j++)
      arr[i].push({ letter: "", colour: "", isFlipped: false });
  }
  return arr;
}

function rowWord(row) {
  return row.reduce((acc, cur) => `${acc}${cur.letter}`, "");
}

///////////////////////// STATE MANAGEMENT /////////////////////////

const initialState = {
  isOpenHamburgerMenu: false,
  isOpenHelpModal: false,
  isGameOver: null,

  chosen: randomizeWord(),
  grid: createGrid(),
  row: [{}, {}, {}, {}, {}],

  flipping: false,
  invalid: null,
  letterNum: 0,
  wordNum: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case "openHamburgerMenu":
      return { ...state, isOpenHamburgerMenu: true };
    case "closeHamburgerMenu":
      return { ...state, isOpenHamburgerMenu: false };
    case "openHelpModal":
      return { ...state, isOpenHelpModal: true };
    case "closeHelpModal":
      return { ...state, isOpenHelpModal: false };
    case "win":
      return { ...state, isGameOver: "win" };
    case "incLetterNum":
      return { ...state, letterNum: state.letterNum + 1 };
    case "decLetterNum":
      return { ...state, letterNum: state.letterNum - 1 };
    case "incWordNum":
      return { ...state, letterNum: 0, wordNum: state.wordNum + 1 };
    case "lose":
      return { ...state, isGameOver: "lose" };
    case "setChosen":
      return { ...state, chosen: action.payload };
    case "setGridLetters":
      return {
        ...state,
        grid: state.grid.map((row, i) =>
          row.map((obj, j) =>
            i === action.payload.x && j === action.payload.y
              ? { ...obj, letter: action.payload.val }
              : obj
          )
        ),
      };
    case "setGridColours":
      return {
        ...state,
        grid: state.grid.map((row, j) =>
          row.map((obj, k) =>
            j === action.payload.x && k === action.payload.y
              ? { ...obj, colour: action.payload.val }
              : obj
          )
        ),
      };
    case "startFlipping":
      return { ...state, flipping: true };
    case "endFlipping":
      return { ...state, flipping: false };
    case "triggerFlip":
      return {
        ...state,
        grid: state.grid.map((row, j) =>
          row.map((obj, k) =>
            j === action.payload.x && k === action.payload.y
              ? { ...obj, isFlipped: true }
              : obj
          )
        ),
      };
    case "unflip":
      return {
        ...state,
        grid: state.grid.map((row) =>
          row.map((obj) => {
            return { ...obj, isFlipped: false };
          })
        ),
      };
    case "setRow":
      return {
        ...state,
        row: state.row.map((box, i) =>
          i === action.payload.y &&
          box[state.grid[action.payload.x][action.payload.y].letter] !== "hint"
            ? {
                ...box,
                [state.grid[action.payload.x][action.payload.y].letter]:
                  action.payload.val,
              }
            : box
        ),
      };

    case "giveHint":
      return {
        ...state,
        grid: state.grid.map((row, i) =>
          row.map((obj, j) =>
            i === state.wordNum && j === action.payload
              ? { letter: state.chosen[action.payload], colour: "correct" }
              : obj
          )
        ),
        row: state.row.map((box, j) =>
          j === action.payload
            ? { ...box, [state.chosen[action.payload]]: "hint" }
            : box
        ),
      };
    case "setInvalid":
      return { ...state, invalid: action.payload };
    case "reset":
      return {
        ...initialState,
        chosen: randomizeWord(),
        grid: state.grid,
      };
  }
}

///////////////////////// GAME COMPONENT /////////////////////////

export function Game({ onCloseGame }) {
  // STATE
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    isOpenHamburgerMenu,
    isOpenHelpModal,
    chosen,
    grid,
    row,
    letterNum,
    wordNum,
  } = state;
  const numOfHints = row.reduce(
    (acc, cur, i) => acc + (cur[chosen[i]] === "hint" ? 1 : 0),
    0
  );
  let hintImg;
  if (numOfHints === 0) {
    hintImg = require("../assets/hint-3.png");
  } else if (numOfHints === 1) {
    hintImg = require("../assets/hint-2.png");
  } else if (numOfHints === 2) {
    hintImg = require("../assets/hint-1.png");
  } else {
    hintImg = require("../assets/hint-0.png");
  }

  // CALLBACKS
  const giveHint = useCallback(
    function () {
      if (
        !row.every((box, i) => box[chosen[i]] === "correct") &&
        numOfHints < 3
      ) {
        let index;
        do {
          index = randomInt(chosen.length);
        } while (
          row[index][chosen[index]] === "correct" ||
          row[index][chosen[index]] === "hint" ||
          chosen[index] === " "
        );

        dispatch({ type: "triggerFlip", payload: { x: wordNum, y: index } });
        setTimeout(() => dispatch({ type: "giveHint", payload: index }), 300);

        if (rowWord(grid[wordNum]) === chosen.join("")) {
          dispatch({ type: "win" });
        }

        let count = letterNum;
        while (count === index || grid[wordNum][count].letter) {
          dispatch({ type: "incLetterNum" });
          count++;
        }
      }
    },
    [chosen, grid, row, letterNum, numOfHints, wordNum]
  );

  const handleReset = useCallback(
    function () {
      let k = 0;
      grid.forEach((row, i) =>
        row.forEach((_, j) => {
          setTimeout(() => {
            dispatch({ type: "triggerFlip", payload: { x: i, y: j } });
            setTimeout(() => {
              dispatch({
                type: "setGridLetters",
                payload: { x: i, y: j, val: "" },
              });
              dispatch({
                type: "setGridColours",
                payload: { x: i, y: j, val: "" },
              });
            }, 50);
          }, k * 50);
          k++;
        })
      );
      dispatch({ type: "unflip" });
      dispatch({ type: "reset" });
    },
    [grid, row]
  );

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/background-game-phone.png")}
        resizeMode="cover"
        style={styles.background}
      >
        <Navbar>
          {isOpenHamburgerMenu && (
            <NavBtns>
              <NavBtn
                img={require("../assets/home.png")}
                onPress={onCloseGame}
              />
              <NavBtn
                img={require("../assets/help.png")}
                onPress={() => dispatch({ type: "openHelpModal" })}
              />
              <NavBtn img={hintImg} onPress={giveHint} />
              <NavBtn
                img={require("../assets/restart.png")}
                onPress={handleReset}
              />
              <NavBtn
                img={require("../assets/close.png")}
                onPress={() => dispatch({ type: "closeHamburgerMenu" })}
              />
            </NavBtns>
          )}
          {!isOpenHamburgerMenu && (
            <>
              <Logo
                img={require("../assets/name.png")}
                onPress={onCloseGame}
                width={171.7}
                height={25}
              />
              <HamburgerMenu
                onOpenHamburgerMenu={() =>
                  dispatch({ type: "openHamburgerMenu" })
                }
              />
            </>
          )}
        </Navbar>
        <MainContents state={state} dispatch={dispatch} onReset={handleReset} />
        <HelpModal
          isOpenHelpModal={isOpenHelpModal}
          onCloseHelpModal={() => dispatch({ type: "closeHelpModal" })}
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
});
