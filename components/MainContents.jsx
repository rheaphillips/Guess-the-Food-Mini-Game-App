import { useCallback, useEffect } from "react";
import { Grid, Row, Box, Hint } from "./Grid";
import { Keyboard } from "./Keyboard";
import { WinModal, LoseModal } from "./Modals";
import affData from "./en_US_aff";
import dicData from "./en_US_dic";
import TypoModule from "../typo/typo.js";
const Typo = TypoModule.default || TypoModule;

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

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

let dictionary;
const createDictionary = function () {
  dictionary = new Typo("en_US", affData, dicData, { platform: "any" });
};

function rowWord(row) {
  return row.reduce((acc, cur) => `${acc}${cur.letter}`, "");
}

export function MainContents({ state, dispatch, onReset }) {
  const {
    isGameOver,
    chosen,
    grid,
    row,
    letterNum,
    wordNum,
    flipping,
    invalid,
  } = state;

  // CALLBACKS
  const createKeyboardColours = useCallback(
    function () {
      let keyboardColours = {};
      alphabet.forEach((letter) => {
        if (
          row.some((box) => box[letter] === "correct" || box[letter] === "hint")
        ) {
          keyboardColours[letter] = "correct";
        } else if (row.some((box) => box[letter] === "present")) {
          keyboardColours[letter] = "present";
        } else if (row.some((box) => box[letter] === "absent")) {
          keyboardColours[letter] = "absent";
        }
      });
      return keyboardColours;
    },
    [row]
  );

  const updateLetterColor = useCallback(function (state, wordNum, i) {
    dispatch({
      type: "setGridColours",
      payload: { x: wordNum, y: i, val: state },
    });
    dispatch({
      type: "setRow",
      payload: { x: wordNum, y: i, val: state },
    });
  }, []);

  const revealColours = useCallback(function (wordNum, states) {
    dispatch({ type: "startFlipping" });
    states.forEach((state, i) => {
      setTimeout(() => {
        dispatch({ type: "triggerFlip", payload: { x: wordNum, y: i } });
        setTimeout(() => {
          updateLetterColor(state, wordNum, i);
        }, 300);
      }, i * 600);
    });
    dispatch({ type: "unflip" });
  }, []);

  const evalKey = useCallback(
    function (key) {
      if (letterNum < chosen.length && alphabet.includes(key)) {
        dispatch({
          type: "setGridLetters",
          payload: { x: wordNum, y: letterNum, val: key },
        });
        if (letterNum < 5) dispatch({ type: "incLetterNum" });
        let count = letterNum + 1;
        while (grid[wordNum][count]?.letter && count < 4) {
          dispatch({ type: "incLetterNum" });
          count++;
        }
      }

      if (
        key === "ENTER" &&
        grid[wordNum].every((box) => alphabet.includes(box.letter)) &&
        (groceryWords.includes(rowWord(grid[wordNum]).toLowerCase()) ||
          dictionary?.check(rowWord(grid[wordNum])))
      ) {
        let states = [];
        grid[wordNum].forEach((box, i) => {
          if (box.letter == chosen[i]) {
            states.push("correct");
          } else if (
            chosen.includes(box.letter) &&
            !grid[wordNum].some(
              (cur, j) =>
                cur.letter == box.letter && (j < i || chosen[j] == box.letter)
            )
          )
            states.push("present");
          else states.push("absent");
        });
        revealColours(wordNum, states);
        if (rowWord(grid[wordNum]) === chosen.join(""))
          setTimeout(() => dispatch({ type: "win" }), 3000);
        else if (wordNum === 5)
          setTimeout(() => dispatch({ type: "lose" }), 3000);
        else {
          dispatch({ type: "incWordNum" });
          setTimeout(() => dispatch({ type: "endFlipping" }), 3000);
        }
      } else if (key == "ENTER") {
        dispatch({ type: "setInvalid", payload: "ENTER" });
        setTimeout(() => dispatch({ type: "setInvalid", action: null }), 500);
      }

      if (key == "BACKSPACE") {
        if (letterNum > 0) {
          dispatch({
            type: "setGridLetters",
            payload: { x: wordNum, y: letterNum - 1, val: "" },
          });
          dispatch({ type: "decLetterNum" });
        } else {
          dispatch({ type: "setInvalid", payload: "BACKSPACE" });
          setTimeout(() => dispatch({ type: "setInvalid", action: null }), 500);
        }
      }
    },
    [chosen, letterNum, wordNum, grid, revealColours, dispatch]
  );

  // EFFECTS
  useEffect(function () {
    createDictionary();
  }, []);
  useEffect(
    function () {
      console.log(chosen);
    },
    [chosen]
  );

  return (
    <>
      <Grid chosen={chosen}>
        {grid.map((line, i) => (
          <Row key={i}>
            {line.map((cell, j) => (
              <Box
                key={`${i}, ${j}`}
                isActive={i === wordNum && j === letterNum}
                enteredLetter={cell.letter}
                gridColour={
                  row[j][chosen[j]] === "hint" &&
                  cell.letter !== chosen[j] &&
                  cell.colour === "correct"
                    ? ""
                    : cell.colour
                }
                isFlipped={cell.isFlipped}
              >
                {row[j][chosen[j]] === "hint" &&
                  wordNum === i &&
                  !grid[i][j].letter &&
                  !flipping && <Hint>{chosen[j]}</Hint>}
              </Box>
            ))}
          </Row>
        ))}
      </Grid>
      <Keyboard
        evalKey={evalKey}
        keyboardColours={createKeyboardColours()}
        invalid={invalid}
      />
      <WinModal reset={isGameOver === "win"} onReset={onReset} />
      <LoseModal
        chosen={chosen.join("").toLowerCase()}
        reset={isGameOver === "lose"}
        onReset={onReset}
      />
    </>
  );
}
