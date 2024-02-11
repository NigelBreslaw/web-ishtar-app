import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import AuthUI from "./src/AuthUI.tsx";
import { clientID } from "./src/constants/env.ts";
import AuthService from "./src/AuthService";

export default function App() {
  if (process.env.NODE_ENV === "development" && clientID === undefined) {
    console.warn("No .ENV file found. Please create one.");
  }

  const authService = AuthService.getInstance();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(authService.isAuthenticated());
  const [token, setToken] = useState("");
  const [membershipID, setMembershipID] = useState("");

  useEffect(() => {
    console.log("useEffect");
    // Subscribe to auth changes
    authService.subscribeAuthenticated(setIsLoggedIn);

    // Unsubscribe when the component unmounts
    return () => authService.unsubscribeAuthenticated(setIsLoggedIn);
  }, [authService.subscribeAuthenticated, authService.unsubscribeAuthenticated]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#232526", "#66686a"]}
        style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}
      />
      <Text style={{ color: "#fff" }}>Open up App.tsx to start working on your app!</Text>
      <Image
        style={{ width: 200, height: 200 }}
        contentFit="contain"
        source="https://d33wubrfki0l68.cloudfront.net/554c3b0e09cf167f0281fda839a5433f2040b349/ecfc9/img/header_logo.svg"
      />
      <AuthUI setToken={setToken} setMembershipID={setMembershipID} />
      <Text style={{ fontSize: 22, marginTop: 15, color: "#150f63" }}>
        Auth token: <Text style={{ fontWeight: "bold" }}>{token}</Text>
      </Text>
      <Text style={{ fontSize: 22, marginTop: 15, color: "#150f63" }}>
        Membership ID: <Text style={{ fontWeight: "bold" }}>{membershipID}</Text>
      </Text>
      <Text style={{ fontSize: 22, marginTop: 15, color: "#150f63" }}>
        Logged In: <Text style={{ fontWeight: "bold" }}>{isLoggedIn ? "True" : "False"}</Text>
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
