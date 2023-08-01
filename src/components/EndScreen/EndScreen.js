import { Pressable, StyleSheet, Text, View, Alert } from "react-native";
import { useEffect, useState } from "react";
import * as Clipboard from "expo-clipboard";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { GAME_KEY, WON, colors, colorsToEmoji } from "../../constants";

const Number = ({ number, label }) => (
  <View style={{ alignItems: "center", margin: 10 }}>
    <Text style={{ color: colors.lightgrey, fontSize: 30, fontWeight: "bold" }}>
      {number}
    </Text>
    <Text style={{ color: colors.lightgrey, fontSize: 16 }}>{label}</Text>
  </View>
);

const GuessDistributionLine = ({ position, amount, percentage }) => (
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
    }}
  >
    <Text style={{ color: colors.lightgrey }}>{position}</Text>
    <View
      style={{
        backgroundColor: colors.grey,
        margin: 5,
        padding: 5,
        width: `${percentage}%`,
        minWidth: 20,
      }}
    >
      <Text style={{ color: colors.lightgrey }}>{amount}</Text>
    </View>
  </View>
);

const GuessDistribution = ({ distribution }) => {
  if (!distribution) {
    return null;
  }
  const totalTries = distribution.reduce((total, tries) => total + tries, 0);
  return (
    <>
      <Text style={styles.subTitle}>GUESS DISTRIBUTION</Text>
      <View
        style={{ width: "100%", padding: 20, justifyContent: "flex-start" }}
      >
        {distribution.map((tries, index) => (
          <GuessDistributionLine
            key={index}
            position={index + 1}
            amount={tries}
            percentage={(100 * tries) / totalTries}
          />
        ))}
      </View>
    </>
  );
};
const EndScreen = ({ won = false, rows, getCellBackgroundColor }) => {
  const [secondsTillTomorrow, setSecondsTillTomorrow] = useState(0);
  const [played, setPlayed] = useState(0);
  const [winRate, setWinRate] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [distribution, setDistribution] = useState(null);

  console.log(distribution);

  useEffect(() => {
    const updateTime = () => {
      let now = new Date();
      let tomorrow = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1
      );

      setSecondsTillTomorrow((tomorrow - now) / 1000);
    };

    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    readState();
  }, []);

  const readState = async () => {
    const dataString = await AsyncStorage.getItem(GAME_KEY);
    let data;
    try {
      data = JSON.parse(dataString);
    } catch (e) {
      console.log("Couldn't parse the state");
    }

    const keys = Object.keys(data);
    const values = Object.values(data);

    setPlayed(keys.length);

    const numberOfWins = values.filter((game) => game.gameState === WON).length;

    setWinRate(Math.floor((100 * numberOfWins) / keys.length));

    let currentStreak = 0;
    let maxStreak = 0;
    let previousDay = 0;
    keys.forEach((key) => {
      const currentDay = parseInt(key.split("-")[1]);
      if (data[key].gameState === WON && currentStreak === 0) {
        currentStreak += 1;
      } else if (
        data[key].gameState === WON &&
        previousDay + 1 === currentDay
      ) {
        currentStreak += 1;
      } else {
        currentStreak = data[key].gameState === WON ? 1 : 0;
      }
      if (currentStreak > maxStreak) {
        maxStreak = currentStreak;
      }
      previousDay = currentDay;
    });
    setCurrentStreak(currentStreak);
    setMaxStreak(maxStreak);

    const distribution = [0, 0, 0, 0, 0, 0];

    values.map((game) => {
      if (game.gameState === WON) {
        const tries = game.rows.filter((row) => row[0]).length;
        distribution[tries] = distribution[tries] + 1;
      }
    });

    setDistribution(distribution);
  };

  const formatSeconds = () => {
    const hours = Math.floor(secondsTillTomorrow / (60 * 60));
    const minutes = Math.floor((secondsTillTomorrow % (60 * 60)) / 60);
    const seconds = Math.floor(secondsTillTomorrow % 60);

    return (string = `${hours > 9 ? hours : "0" + hours}:${
      minutes > 9 ? minutes : "0" + minutes
    }:${seconds > 9 ? seconds : "0" + seconds}`);
  };

  const share = async () => {
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

  return (
    <View style={{ alignItems: "center", width: "100%" }}>
      <Text style={styles.title}>
        {won ? "Congrats!" : "Meh, try again tomorrow."}
      </Text>
      <Text style={styles.subTitle}>STATISTICS</Text>
      <View style={{ flexDirection: "row", marginBottom: 20 }}>
        <Number number={played} label={"Played"} />
        <Number number={winRate} label={"Win %"} />
        <Number number={currentStreak} label={"Current streak"} />
        <Number number={maxStreak} label={"Max streak"} />
      </View>

      <GuessDistribution distribution={distribution} />

      <View style={{ flexDirection: "row", padding: 10 }}>
        <View style={{ alignItems: "center", flex: 1 }}>
          <Text style={{ color: colors.lightgrey }}>Next Wordle</Text>
          <Text
            style={{
              color: colors.lightgrey,
              fontSize: 24,
              fontWeight: "bold",
            }}
          >
            {formatSeconds()}
          </Text>
        </View>
        <Pressable
          onPress={share}
          style={{
            flex: 1,
            backgroundColor: colors.primary,
            borderRadius: 25,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: colors.lightgrey, fontWeight: "bold" }}>
            Share
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    color: "white",
    textAlign: "center",
  },
  subTitle: {
    fontSize: 20,
    color: colors.lightgrey,
    textAlign: "center",
    marginVertical: 15,
    fontWeight: "bold",
  },
});

export default EndScreen;
