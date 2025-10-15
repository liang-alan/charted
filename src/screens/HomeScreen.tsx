// src/screens/HomeScreen.tsx
import React, { useState } from "react";
import { View, Text, Button, StyleSheet, ScrollView } from "react-native";
import * as SecureStore from "expo-secure-store";
import api from "../lib/apiClient";
import { useAuth } from "../context/AuthContext";
import styles from "./styles/styles";


export default function HomeScreen() {
    const { user, accessToken, reloadProfile, signOut } = useAuth();
    const [tracks, setTracks] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    const getToken = async () => {
        return accessToken || (await SecureStore.getItemAsync("spotify_access_token"));
    };

    const fetchUserProfile = async () => {
        try {
            const token = await getToken();
            if (!token) return setError("Please sign in first.");
            await reloadProfile();
            if (user?.display_name) alert(`Welcome, ${user.display_name}!`);
        } catch (err) {
            console.error("Failed to fetch user profile:", err);
            setError("Failed to fetch profile.");
        }
    };

    const fetchTopTracks = async () => {
        try {
            const token = await getToken();
            if (!token) return setError("Please sign in first.");
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
        try {
            const token = await getToken();
            if (!token) return setError("Please sign in first.");
            const r = await api.get("/spotify/recently-played", {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log("Recently played:", r.data.items);
        } catch (e) {
            console.error(e);
            setError("Failed to fetch recently played.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>🎶 Charted Home</Text>
            <Text style={{ textAlign: "center", marginBottom: 12 }}>
                {user ? `Logged in as ${user.display_name || user.id}` : "Not signed in"}
            </Text>

            <Button title="Show my profile" onPress={fetchUserProfile} />
            <View style={{ height: 8 }} />
            <Button title="Fetch My Top Tracks" onPress={fetchTopTracks} />
            <View style={{ height: 8 }} />
            <Button title="Fetch Recently Played (last 50)" onPress={fetchRecentlyPlayed} />
            <View style={{ height: 8 }} />
            <Button title="Sign out" onPress={signOut} color="#c00" />

            {error && <Text style={styles.error}>{error}</Text>}

            {tracks.length > 0 && (
                <ScrollView style={{ marginTop: 16 }}>
                    <Text style={styles.subtitle}>Your Top Tracks</Text>
                    {tracks.map((t: any, i: number) => (
                        <Text key={t.id || `${t.name}-${i}`} style={{ marginVertical: 4 }}>
                            {i + 1}. {t.name} — {t.artists?.[0]?.name}
                        </Text>
                    ))}
                </ScrollView>
            )}
        </View>
    );
}