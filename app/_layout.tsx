import { AuthProvider, useAuth } from "@/src/context/AuthContext";
import { Slot } from "expo-router";
import { ActivityIndicator, View } from "react-native";

function AuthGuard() {
  const { user } = useAuth();

  if (user === undefined) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return user ? <Slot /> : <Slot initialRouteName="(auth)/login" />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthGuard />
    </AuthProvider>
  );
}
