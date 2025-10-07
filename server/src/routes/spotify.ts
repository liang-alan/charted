import { Router } from "express";
import {
    login,
    exchangeToken,
    refreshToken,
    getTopTracks,
    syncRecentlyPlayed
} from "../controllers/spotifyController.js";

const router = Router();

// Routes
router.get("/login", login);
router.post("/token", exchangeToken);
router.post("/refresh", refreshToken);
router.get("/top-tracks", getTopTracks);
router.get("/recently-played", syncRecentlyPlayed);

export default router;
