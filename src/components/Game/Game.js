import { useEffect, useState } from "react";
import { Text, View, ScrollView, Alert, ActivityIndicator } from "react-native";
import * as Clipboard from "expo-clipboard";

import AsyncStorage from "@react-native-async-storage/async-storage";

import Keyboard from "../Keyboard";

import { copyArray, getDayOfTheYear } from "../../utils";

import words from "../../words";
import { CLEAR, ENTER, colors, colorsToEmoji } from "../../constants";

import styles from "./Game.styles";

const NUMBER_OF_TRIES = 6;
const WON = "won",
  LOST = "lost",
  PLAYING = "playing";

const dayOfTheYear = getDayOfTheYear();

const Game = () => {
  const word = words[dayOfTheYear];
  const letters = word.split("");

  const [rows, setRows] = useState(
    new Array(NUMBER_OF_TRIES).fill(new Array(letters.length).fill(""))
  );
  const [currentRow, setCurrentRow] = useState(0);
  const [currentColumn, setCurrentColumn] = useState(0);
  const [gameState, setGameState] = useState(PLAYING); // won, lost, playing
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (currentRow > 0) {
      checkGameState();
    }
  }, [currentRow]);

  useEffect(() => {
    if (loaded) {
      persistState();
    }
  }, [rows, currentRow, currentColumn, gameState]);

  useEffect(() => {
    readState();
  }, []);

  const persistState = async () => {
    const data = {
      rows,
      currentRow,
      currentColumn,
      gameState,
    };

    try {
      const dataString = JSON.stringify(data);
      await AsyncStorage.setItem("@game", dataString);
    } catch (e) {
      console.log("Failed to write data to async storage", e);
    }
  };

  const readState = async () => {
    const dataString = await AsyncStorage.getItem("@game");
    try {
      const data = JSON.parse(dataString);
      setRows(data.rows);
      setCurrentRow(data.currentRow);
      setCurrentColumn(data.currentColumn);
      setGameState(data.gameState);
    } catch (e) {
      console.log("Couldn't parse the state");
    }
    setLoaded(true);
  };

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

  if (!loaded) {
    return <ActivityIndicator />;
  }

  return (
    <>
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
    </>
  );
};

export default Game;
