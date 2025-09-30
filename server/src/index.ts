import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import spotifyRoutes from "./routes/spotify"; 

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/spotify", spotifyRoutes);

app.get("/", (req, res) => {
    res.send("Charted backend running!");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
