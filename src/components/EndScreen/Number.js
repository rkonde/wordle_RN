import { Text, View } from "react-native";

import { colors } from "../../constants";

const Number = ({ number, label }) => (
  <View style={{ alignItems: "center", margin: 10 }}>
    <Text style={{ color: colors.lightgrey, fontSize: 30, fontWeight: "bold" }}>
      {number}
    </Text>
    <Text style={{ color: colors.lightgrey, fontSize: 16 }}>{label}</Text>
  </View>
);

export default Number;
