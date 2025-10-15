import { type Request, type Response } from "express";
import axios from "axios";

export const login = (req: Request, res: Response) => {
    const scope = "user-read-email user-read-private user-top-read user-read-recently-played";

    const query = new URLSearchParams({
        response_type: "code",
        client_id: process.env.SPOTIFY_CLIENT_ID!,
        scope,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI!, // charted://callback
    });

    const redirectUrl = `https://accounts.spotify.com/authorize?${query.toString()}`;
    res.redirect(redirectUrl);
};

export const exchangeToken = async (req: Request, res: Response) => {
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ error: "Authorization code is required" });
    }

    try {
        const authHeader = Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString("base64");

        const response = await axios.post(
            "https://accounts.spotify.com/api/token",
            new URLSearchParams({
                grant_type: "authorization_code",
                code,
                redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
            }),
            {
                headers: {
                    Authorization: `Basic ${authHeader}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

        res.json(response.data);
    } catch (err: any) {
        console.error(err.response?.data || err.message);
        res.status(500).json({ error: "Failed to exchange code for token" });
    }
};

export const refreshToken = async (req: Request, res: Response) => {
    const { refresh_token } = req.body;

    if (!refresh_token) {
        return res.status(400).json({ error: "refresh_token is required" });
    }

    try {
        const authHeader = Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString("base64");

        const response = await axios.post(
            "https://accounts.spotify.com/api/token",
            new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token,
            }),
            {
                headers: {
                    Authorization: `Basic ${authHeader}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

        res.json(response.data);
    } catch (err: any) {
        console.error(err.response?.data || err.message);
        res.status(500).json({ error: "Failed to refresh token" });
    }
};

export const getTopTracks = async (req: Request, res: Response) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json({ error: "No token provided" });

    const token = authHeader.split(" ")[1];

    try {
        const r = await axios.get("https://api.spotify.com/v1/me/top/tracks", {
            headers: { Authorization: `Bearer ${token}` },
        });
        res.json(r.data);
    } catch (err) {
        if (axios.isAxiosError(err)) {
            console.error("Spotify top tracks failed", err.response?.data || err.message);
        } else {
            console.error("Spotify top tracks failed", err);
        }
        res.status(500).json({ error: "Spotify top tracks failed" });
    }
};

export const syncRecentlyPlayed = async (req: Request, res: Response) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json({ error: "No token provided" });

    const token = authHeader.split(" ")[1];
    const after = req.query.after as string | undefined; // optional query param

    try {
        // Build query parameters
        const params = new URLSearchParams({ limit: "50" });
        if (after) params.append("after", after);

        // Call Spotify API
        const spotifyResponse = await axios.get(
            `https://api.spotify.com/v1/me/player/recently-played?${params.toString()}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        res.json({
            items: spotifyResponse.data.items,
            next: spotifyResponse.data.next,
            cursors: spotifyResponse.data.cursors,
            limit: spotifyResponse.data.limit,
        });
    } catch (err: any) {
        console.error("Spotify recently played failed:", err.response?.data || err.message);
        res.status(500).json({ error: "Spotify recently played failed" });
    }
};

export const getUserProfile = async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader) return res.status(401).json({ error: "No token provided" });

        const token = authHeader.split(" ")[1];


        if (!token) {
            return res.status(401).json({ error: "Not authenticated: missing access token." });
        }

        const { data } = await axios.get("https://api.spotify.com/v1/me", {
            headers: { Authorization: `Bearer ${token}` },
        });

        return res.status(200).json(data);
    } catch (err: any) {
        if (axios.isAxiosError(err) && err.response) {
            // Pass through Spotify error status/details when possible
            return res
                .status(err.response.status)
                .json({ error: err.response.data?.error?.message || "Failed to fetch profile from Spotify." });
        }
        console.error("getUserProfile error:", err);
        return res.status(500).json({ error: "Internal server error." });
    }
}

