import { Text, View } from "react-native";

import { colors } from "../../constants";

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

export default GuessDistributionLine;
