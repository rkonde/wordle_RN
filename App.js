import { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  StatusBar,
  View,
  ScrollView,
  Alert,
} from "react-native";
import * as Clipboard from "expo-clipboard";

import Keyboard from "./src/components/Keyboard/Keyboard";

import { CLEAR, ENTER, colors, colorsToEmoji } from "./src/constants";

const NUMBER_OF_TRIES = 6;
const WON = "won",
  LOST = "lost",
  PLAYING = "playing";

const copyArray = (arr) => {
  return [...arr.map((rows) => [...rows])];
};

const getDayOfTheYear = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const day = Math.floor(diff / oneDay);
  return day;
};

const dayOfTheYear = getDayOfTheYear();
const words = [
  "ashen",
  "defer",
  "parse",
  "goner",
  "badge",
  "snore",
  "aglow",
  "anime",
  "hefty",
  "leaky",
  "edict",
  "stair",
  "belle",
  "caput",
  "shake",
  "shook",
  "burnt",
  "murky",
  "ebony",
  "pesky",
  "flown",
  "imply",
  "teach",
  "flick",
  "lever",
  "throb",
  "fewer",
  "prime",
  "pearl",
  "entry",
  "ankle",
  "ratio",
  "money",
  "stoop",
  "slyly",
  "dried",
  "spine",
  "apart",
  "harsh",
  "saner",
  "spare",
  "mower",
  "maybe",
  "freak",
  "deign",
  "rehab",
  "sugar",
  "clove",
  "funny",
  "swill",
  "aptly",
  "mamma",
  "queen",
  "belch",
  "niece",
  "track",
  "dozen",
  "bring",
  "graze",
  "crazy",
  "sauna",
  "early",
  "blank",
  "flyer",
  "welsh",
  "blown",
  "phase",
  "minim",
  "pound",
  "flirt",
  "cress",
  "pleat",
  "grass",
  "barge",
  "worry",
  "crane",
  "voter",
  "scary",
  "minus",
  "bible",
  "gourd",
  "louse",
  "imbue",
  "pagan",
  "flier",
  "shade",
  "hobby",
  "duvet",
  "afoot",
  "vigil",
  "vodka",
  "album",
  "finer",
  "often",
  "swine",
  "squad",
  "crust",
  "theta",
  "midst",
  "major",
  "vault",
  "wench",
  "tramp",
  "chill",
  "swept",
  "helix",
  "shove",
  "wheat",
  "lager",
  "round",
  "otter",
  "budge",
  "magic",
  "storm",
  "pubic",
  "valve",
  "kappa",
  "farce",
  "sheep",
  "audit",
  "label",
  "shank",
  "credo",
  "welch",
  "canny",
  "cheap",
  "great",
  "tribe",
  "stove",
  "blaze",
  "wryly",
  "retch",
  "clink",
  "pudgy",
  "agree",
  "queer",
  "swish",
  "belie",
  "shiny",
  "clued",
  "amity",
  "wedge",
  "quart",
  "clack",
  "baron",
  "willy",
  "taken",
  "nasal",
  "grief",
  "vouch",
  "board",
  "motor",
  "booby",
  "snuff",
  "swamp",
  "decay",
  "ocean",
  "pinch",
  "staid",
  "testy",
  "motif",
  "rivet",
  "space",
  "sworn",
  "charm",
  "curvy",
  "iliac",
  "blind",
  "stink",
  "vital",
  "tryst",
  "count",
  "steak",
  "dully",
  "gully",
  "manga",
  "ovate",
  "unzip",
  "about",
  "amass",
  "ester",
  "ardor",
  "conch",
  "woozy",
  "oxide",
  "giddy",
  "eying",
  "limit",
  "livid",
  "china",
  "tapir",
  "renal",
  "grace",
  "femme",
  "arise",
  "civil",
  "bacon",
  "scalp",
  "shirt",
  "class",
  "trump",
  "ionic",
  "leafy",
  "axiom",
  "basil",
  "kiosk",
  "blurt",
  "drawn",
  "price",
  "skiff",
  "habit",
  "erupt",
  "cavil",
  "silky",
  "admit",
  "rogue",
  "lobby",
  "child",
  "quill",
  "sooty",
  "coast",
  "windy",
  "oaken",
  "minty",
  "title",
  "verso",
  "sense",
  "steel",
  "pygmy",
  "bulge",
  "every",
  "shame",
  "plead",
  "yearn",
  "briny",
  "augur",
  "grope",
  "craze",
  "crimp",
  "brash",
  "truer",
  "roach",
  "theme",
  "derby",
  "plank",
  "ralph",
  "rugby",
  "sixty",
  "twang",
  "steed",
  "umbra",
  "sloop",
  "juror",
  "creed",
  "ninja",
  "stake",
  "unwed",
  "dopey",
  "tweak",
  "tithe",
  "disco",
  "house",
  "buyer",
  "loyal",
  "skier",
  "chafe",
  "heist",
  "fried",
  "hairy",
  "brown",
  "abase",
  "hydro",
  "cheer",
  "pitch",
  "inane",
  "creak",
  "bleed",
  "elite",
  "cleat",
  "flesh",
  "below",
  "whole",
  "union",
  "lapse",
  "putty",
  "rearm",
  "stout",
  "snuck",
  "cinch",
  "limbo",
  "crave",
  "lumpy",
  "prick",
  "forgo",
  "offal",
  "raise",
  "slash",
  "mason",
  "rover",
  "issue",
  "penne",
  "catty",
  "tried",
  "dwarf",
  "laugh",
  "pooch",
  "tenth",
  "cough",
  "woman",
  "venue",
  "pence",
  "extra",
  "torch",
  "piety",
  "nerdy",
  "chili",
  "third",
  "guess",
  "shrug",
  "mange",
  "eight",
  "holly",
  "lapel",
  "paste",
  "foyer",
  "wrath",
  "loamy",
  "manic",
  "pilot",
  "geese",
  "cliff",
  "surly",
  "plunk",
  "sever",
  "cacti",
  "scout",
  "buddy",
  "badly",
  "humor",
  "horde",
  "adult",
  "regal",
  "queue",
  "nomad",
  "apnea",
  "atone",
  "uncle",
  "since",
  "trout",
  "adore",
  "proxy",
  "truss",
  "feign",
  "shalt",
  "bylaw",
  "pouty",
  "croup",
  "embed",
  "hotly",
  "mover",
  "glade",
  "amply",
  "block",
  "spurn",
  "rabbi",
];

export default function App() {
  const word = words[dayOfTheYear];
  const letters = word.split("");

  const [rows, setRows] = useState(
    new Array(NUMBER_OF_TRIES).fill(new Array(letters.length).fill(""))
  );
  const [currentRow, setCurrentRow] = useState(0);
  const [currentColumn, setCurrentColumn] = useState(0);
  const [gameState, setGameState] = useState(PLAYING); // won, lost, playing

  useEffect(() => {
    if (currentRow > 0) {
      checkGameState();
    }
  }, [currentRow]);

  const checkGameState = () => {
    if (checkIfWon() && gameState !== WON) {
      Alert.alert("Hurray", "You won!", [
        { text: "Share", onPress: shareScore },
      ]);
      setGameState(WON);
    } else if (checkIfLost() && gameState !== LOST) {
      Alert.alert("Meh", "Try again tomorrow!");
      setGameState(LOST);
    }
  };

  const checkIfWon = () => {
    const row = rows[currentRow - 1];
    return row.every((letter, i) => letter === letters[i]);
  };

  const checkIfLost = () => {
    return !checkIfWon() && currentRow === rows.length;
  };

  const shareScore = async () => {
    const textMap = rows
      .map((row, i) =>
        row
          .map((cell, j) => colorsToEmoji[getCellBackgroundColor(i, j)])
          .join("")
      )
      .filter((row) => row)
      .join("\n");

    const textToShare = `Wordle\n${textMap}`;

    await Clipboard.setStringAsync(textToShare);
    Alert.alert("Copied successfully", "Share your score on your social media");
  };

  const onKeyPressed = (key) => {
    if (gameState !== PLAYING) {
      return;
    }
    const updatedRows = copyArray(rows);

    if (key === CLEAR) {
      const previousColumn = currentColumn - 1;
      if (previousColumn >= 0) {
        updatedRows[currentRow][previousColumn] = "";
        setRows(updatedRows);
        setCurrentColumn(previousColumn);
      }
      return;
    }

    if (key === ENTER) {
      if (currentColumn === rows[0].length) {
        setCurrentRow((currentRow) => currentRow + 1);
        setCurrentColumn(0);
      }
      return;
    }

    if (currentColumn < rows[0].length) {
      updatedRows[currentRow][currentColumn] = key;
      setRows(updatedRows);
      setCurrentColumn((currentColumn) => currentColumn + 1);
    }
  };

  const isCellActive = (row, column) => {
    return row === currentRow && column === currentColumn;
  };

  const getCellBackgroundColor = (row, column) => {
    const letter = rows[row][column];
    if (row >= currentRow) {
      return colors.black;
    }
    if (letter === letters[column]) {
      return colors.primary;
    }
    if (letters.includes(letter)) {
      return colors.secondary;
    }
    return colors.darkgrey;
  };

  const getAllLettersWithColor = (color) => {
    return rows.flatMap((row, i) =>
      row.filter((cell, j) => getCellBackgroundColor(i, j) === color)
    );
  };

  const greenCaps = getAllLettersWithColor(colors.primary);
  const yellowCaps = getAllLettersWithColor(colors.secondary);
  const greyCaps = getAllLettersWithColor(colors.darkgrey);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <Text style={styles.title}>WORDLE</Text>

      <ScrollView style={styles.map}>
        {rows.map((row, i) => (
          <View key={`row-${i}`} style={styles.row}>
            {row.map((letter, j) => (
              <View
                key={`cell-${i}-${j}`}
                style={[
                  styles.cell,
                  {
                    borderColor: isCellActive(i, j)
                      ? colors.lightgrey
                      : colors.darkgrey,
                    backgroundColor: getCellBackgroundColor(i, j),
                  },
                ]}
              >
                <Text style={styles.cellText}>{letter.toUpperCase()}</Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>

      <Keyboard
        onKeyPressed={onKeyPressed}
        greenCaps={greenCaps}
        yellowCaps={yellowCaps}
        greyCaps={greyCaps}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: "center",
  },

  title: {
    color: colors.lightgrey,
    fontSize: 32,
    fontWeight: "bold",
    letterSpacing: 7,
  },

  map: {
    alignSelf: "stretch",
    marginVertical: 20,
  },

  row: {
    alignSelf: "stretch",
    flexDirection: "row",
    justifyContent: "center",
  },

  cell: {
    borderWidth: 2,
    borderColor: colors.darkgrey,
    flex: 1,
    maxWidth: 70,
    aspectRatio: 1,
    margin: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  cellText: {
    color: colors.lightgrey,
    fontWeight: "bold",
    fontSize: 28,
  },
});
