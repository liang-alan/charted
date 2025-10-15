import { StyleSheet } from "react-native";

export const colors = {
    bg: "#ffffff",
    text: "#000000",
    muted: "#6b7280",
    accent: "#1DB954", // Spotify green
    gray: "#eeeeee",
};

export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
};

export const radius = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 999,
};

const styles = StyleSheet.create({
    loginContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 24, 
    },

    // Generic screen layout
    container: {
        flex: 1,
        backgroundColor: colors.bg,
        padding: spacing.lg,
        justifyContent: "center",
    },

    // Typography
    title: {
        fontSize: 22,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: spacing.md,
        color: colors.text,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: spacing.sm,
        color: colors.text,
    },
    textMuted: {
        color: colors.muted,
    },
    error: {
        marginTop: spacing.md,
        color: "#d32f2f",         
        textAlign: "center",
        fontSize: 14,
        fontWeight: "600",
    },

    // Profile-specific
    avatar: {
        width: 120,
        height: 120,
        borderRadius: radius.full,
        marginBottom: spacing.md,
    },
    avatarPlaceholder: {
        width: 120,
        height: 120,
        borderRadius: radius.full,
        marginBottom: spacing.md,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.gray,
    },
    avatarInitial: {
        fontSize: 36,
        fontWeight: "800",
        color: colors.text,
    },

    // Reusable utility wrappers
    center: {
        alignItems: "center",
        justifyContent: "center",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
    },
    mbSm: { marginBottom: spacing.sm },
    mbMd: { marginBottom: spacing.md },
    mbLg: { marginBottom: spacing.lg },
});

export default styles;
