import React from "react";
import { View, Text, Image } from "react-native";
import styles, { colors } from "./styles/styles";
import { useAuth } from "../context/AuthContext";

export default function ProfileScreen() {
    const { user } = useAuth();
    const avatarUri = user?.images?.[0]?.url;
    const displayName = user?.display_name ?? user?.id ?? "You";

    return (
        <View style={[styles.container, styles.center]}>
            {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatar} resizeMode="cover" />
            ) : (
                <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarInitial}>{displayName.slice(0, 1).toUpperCase()}</Text>
                </View>
            )}

            <Text style={styles.title}>{displayName}</Text>
            {user?.email ? <Text style={styles.textMuted}>{user.email}</Text> : null}
        </View>
    );
}
