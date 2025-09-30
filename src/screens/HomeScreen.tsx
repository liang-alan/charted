import React from "react";
import { View, Text } from "react-native";
import styles from "./styles/screen.styles"

export default function HomeScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Home Screen</Text>
        </View>
    );
}
