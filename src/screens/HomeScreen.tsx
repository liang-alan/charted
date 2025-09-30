import React, { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import api from "../lib/apiClient";
import { BACKEND_URL } from "../lib/config";

WebBrowser.maybeCompleteAuthSession();

export default function HomeScreen() {
  const [result, setResult] = useState<any>(null);

  const redirectUri = AuthSession.makeRedirectUri({
    scheme: "charted", // must match your app.json scheme
    path: "callback",
  });

  const login = async () => {
    const authUrl = `${BACKEND_URL}/spotify/login`;
    const response = await AuthSession.startAsync({
      authUrl,
      returnUrl: redirectUri,
    });
    setResult(response);
  };

  useEffect(() => {
    if (result?.type === "success") {
      const code = new URL(result.url).searchParams.get("code");
      if (code) {
        api.post("/spotify/token", { code }).then(r => {
          console.log("Got tokens:", r.data);
        });
      }
    }
  }, [result]);

  return (
    <View>
      <Button title="Sign in with Spotify" onPress={login} />
      {result && <Text>{JSON.stringify(result)}</Text>}
    </View>
  );
}
