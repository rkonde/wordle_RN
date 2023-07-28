import { Pressable, StyleSheet, Text, View, Alert } from "react-native";
import { colors, colorsToEmoji } from "../../constants";
import { useEffect, useState } from "react";
import * as Clipboard from "expo-clipboard";

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
      width: `${percentage}%`,
    }}
  >
    <Text style={{ color: colors.lightgrey }}>{position}</Text>
    <View
      style={{
        backgroundColor: colors.grey,
        margin: 5,
        padding: 5,
        width: "100%",
      }}
    >
      <Text style={{ color: colors.lightgrey }}>{amount}</Text>
    </View>
  </View>
);

const GuessDistribution = () => (
  <>
    <Text style={styles.subTitle}>GUESS DISTRIBUTION</Text>
    <View style={{ width: "100%", padding: 20, justifyContent: "flex-start" }}>
      <GuessDistributionLine position={0} amount={2} percentage={10} />
    </View>
  </>
);

const EndScreen = ({ won = false, rows, getCellBackgroundColor }) => {
  const [secondsTillTomorrow, setSecondsTillTomorrow] = useState(0);

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
        <Number number={2} label={"Played"} />
        <Number number={2} label={"Win %"} />
        <Number number={2} label={"Current streak"} />
        <Number number={2} label={"Max streak"} />
      </View>

      <GuessDistribution />

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
