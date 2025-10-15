// src/screens/LoginScreen.tsx
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useAuth } from "../context/AuthContext";
import styles from "./styles/styles";


export default function LoginScreen() {
    const { signIn } = useAuth();

    const onLogin = async () => {
        try {
            await signIn();
        } catch (e: any) {
            console.error(e);
            alert("Login failed. Please try again.");
        }
    };

    return (
        <View style={styles.loginContainer}>
            <Text style={styles.title}>🎶 Welcome to Charted</Text>
            <Text style={styles.subtitle}>Sign in to see your custom charts</Text>
            <Button title="Sign in with Spotify" onPress={onLogin} />
        </View>
    );
}

