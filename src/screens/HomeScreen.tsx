import React, { useState } from "react";
import { View, Text, Button, StyleSheet, ScrollView, Platform } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as SecureStore from "expo-secure-store";
import api from "../lib/apiClient";
import { BACKEND_URL } from "../lib/config";
import Constants from "expo-constants";


WebBrowser.maybeCompleteAuthSession();

const REDIRECT_URI =
    Platform.select({
        web: Constants.linkingUri,    // for Expo web build
        default: "charted://callback", // always use scheme on native
    });

export default function HomeScreen() {
    const [tracks, setTracks] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    // 🔑 Sign in with Spotify
    const handleLogin = async () => {
        try {
            const result = await WebBrowser.openAuthSessionAsync(
                `${BACKEND_URL}/spotify/login`, // hits your backend
                REDIRECT_URI
            );

            if (result.type === "success" && result.url) {
                // Extract the code from redirect URL
                const url = new URL(result.url);
                const code = url.searchParams.get("code");
                if (!code) {
                    setError("No code returned from Spotify.");
                    return;
                }

                // Exchange code for tokens via backend
                const r = await api.post("/spotify/token", { code });
                const { access_token, refresh_token } = r.data;

                setAccessToken(access_token);
                await SecureStore.setItemAsync("spotify_access_token", access_token);
                if (refresh_token) {
                    await SecureStore.setItemAsync("spotify_refresh_token", refresh_token);
                }
            }
        } catch (err) {
            console.error(err);
            setError("Login failed.");
        }
    };
    const fetchUserProfile = async () => {
        try {
            const token = accessToken || (await SecureStore.getItemAsync("spotify_access_token"));
            if (!token) {
                setError("Please sign in first.");
                return;
            }

            const r = await api.get("https://api.spotify.com/v1/me", {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("User profile:", r.data);
            alert(`Welcome, ${r.data.display_name}!`); // quick popup
        } catch (err) {
            console.error("Failed to fetch user profile:", err);
            setError("Failed to fetch profile.");
        }
    };


    // 🎶 Fetch top tracks
    const fetchTopTracks = async () => {
        try {
            const token = accessToken || (await SecureStore.getItemAsync("spotify_access_token"));
            if (!token) {
                setError("Please sign in first.");
                return;
            }

            const r = await api.get("/spotify/top-tracks", {
                headers: { Authorization: `Bearer ${token}` },
            });

            setTracks(r.data.items || []);
        } catch (e: any) {
            console.error(e);
            setError("Failed to fetch tracks.");
        }
    };

    const fetchRecentlyPlayed = async () => {
        const token = accessToken || (await SecureStore.getItemAsync("spotify_access_token"));
        const r = await api.get("/spotify/recently-played", {
            headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Recently played:", r.data.items);
    };


    return (
        <View style={styles.container}>
            <Text style={styles.title}>🎶 Charted Home</Text>

            <Button title="Sign in with Spotify" onPress={handleLogin} />
            <View style={{ height: 12 }} />
            <Button title="Fetch My Top Tracks" onPress={fetchTopTracks} />
            <Button title="Show my profile" onPress={fetchUserProfile} />
            <Button title="Fetch Recently Played (last 50)" onPress={fetchRecentlyPlayed}/>

            {error && <Text style={styles.error}>{error}</Text>}

            {tracks.length > 0 && (
                <ScrollView style={{ marginTop: 16 }}>
                    <Text style={styles.subtitle}>Your Top Tracks</Text>
                    {tracks.map((t: any, i: number) => (
                        <Text key={t.id} style={{ marginVertical: 4 }}>
                            {i + 1}. {t.name} — {t.artists?.[0]?.name}
                        </Text>
                    ))}
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#fff", justifyContent: "center" },
    title: { fontSize: 22, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
    subtitle: { fontSize: 18, fontWeight: "600", marginBottom: 8 },
    error: { marginTop: 16, color: "red", textAlign: "center" },
});
