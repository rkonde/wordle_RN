import { Text, View } from "react-native";

import GuessDistributionLine from "./GuessDistributionLine";

import { colors } from "../../constants";

const GuessDistribution = ({ distribution }) => {
  if (!distribution) {
    return null;
  }
  const totalTries = distribution.reduce((total, tries) => total + tries, 0);
  return (
    <>
      <Text
        style={{
          fontSize: 20,
          color: colors.lightgrey,
          textAlign: "center",
          marginVertical: 15,
          fontWeight: "bold",
        }}
      >
        GUESS DISTRIBUTION
      </Text>
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

export default GuessDistribution;
