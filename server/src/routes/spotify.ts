import express, {Request, Response} from "express";
const router = express.Router();
import axios from "axios"

router.get("/login", (req: Request, res: Response) => {
    const scope = "user-read-email user-read-private user-top-read";

    const query = new URLSearchParams({
        response_type: "code",
        client_id: process.env.SPOTIFY_CLIENT_ID!,
        scope,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI!, // charted://callback
    });

    const redirectUrl = `https://accounts.spotify.com/authorize?${query.toString()}`;
    res.redirect(redirectUrl);
});

router.post("/token", async (req: Request, res: Response) => {
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ error: "Authorization code is required" });
    }

    try {
        // 🔑 Build Basic Auth header with client ID + secret
        const authHeader = Buffer.from(
            process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET
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

        res.json(response.data); // { access_token, refresh_token, expires_in, ... }
    } catch (err: any) {
        console.error(err.response?.data || err.message);
        res.status(500).json({ error: "Failed to exchange code for token" });
    }
});

router.post("/refresh", async (req: Request, res: Response) => {
    const { refresh_token } = req.body;

    if (!refresh_token) {
        return res.status(400).json({ error: "refresh_token is required" });
    }

    try {
        // 🔑 Build Basic Auth header
        const authHeader = Buffer.from(
            process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET
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

        res.json(response.data); // { access_token, expires_in, scope, ... }
    } catch (err: any) {
        console.error(err.response?.data || err.message);
        res.status(500).json({ error: "Failed to refresh token" });
    }
});


export default router;
