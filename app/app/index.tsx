import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text className="text-primary-primary">
        Edit app/index.tsx to edit this screen.
      </Text>
      <Link href="/login">View details</Link>{" "}
    </View>
  );
}
