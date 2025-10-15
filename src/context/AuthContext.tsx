import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";
import Constants from "expo-constants";
import api from "../lib/apiClient";
import { BACKEND_URL } from "../lib/config";

WebBrowser.maybeCompleteAuthSession();

type SpotifyUser = {
    id: string;
    display_name?: string;
    images?: { url: string }[];
    email?: string;
} | null;

type AuthContextValue = {
    accessToken: string | null;
    refreshToken: string | null;
    user: SpotifyUser;
    loading: boolean;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
    reloadProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const REDIRECT_URI =
    Platform.select({
        web: Constants.linkingUri,        // for Expo web
        default: "charted://callback",    // native scheme
    })!;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [user, setUser] = useState<SpotifyUser>(null);
    const [loading, setLoading] = useState(true);

    // Load any saved tokens on boot
    useEffect(() => {
        (async () => {
            try {
                const at = await SecureStore.getItemAsync("spotify_access_token");
                const rt = await SecureStore.getItemAsync("spotify_refresh_token");
                setAccessToken(at);
                setRefreshToken(rt);
                if (at) await fetchProfile(at);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const fetchProfile = async (token: string) => {
        try {
            const r = await api.get("https://api.spotify.com/v1/me", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(r.data);
        } catch (e) {
            // token may be expired; leave user null
            console.warn("Failed to fetch profile", e);
        }
    };

    const signIn = async () => {
        const result = await WebBrowser.openAuthSessionAsync(
            `${BACKEND_URL}/spotify/login`,
            REDIRECT_URI
        );

        if (result.type !== "success" || !result.url) return;

        const url = new URL(result.url);
        const code = url.searchParams.get("code");
        if (!code) throw new Error("No code returned from Spotify");

        const r = await api.post("/spotify/token", { code });
        const { access_token, refresh_token } = r.data;

        setAccessToken(access_token);
        setRefreshToken(refresh_token ?? null);

        await SecureStore.setItemAsync("spotify_access_token", access_token);
        if (refresh_token) {
            await SecureStore.setItemAsync("spotify_refresh_token", refresh_token);
        }

        await fetchProfile(access_token);
    };

    const signOut = async () => {
        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);
        await SecureStore.deleteItemAsync("spotify_access_token");
        await SecureStore.deleteItemAsync("spotify_refresh_token");
    };

    const reloadProfile = async () => {
        if (accessToken) await fetchProfile(accessToken);
    };

    const value = useMemo(
        () => ({ accessToken, refreshToken, user, loading, signIn, signOut, reloadProfile }),
        [accessToken, refreshToken, user, loading]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};
