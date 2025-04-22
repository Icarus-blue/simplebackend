const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Replace with your actual MongoDB connection string
const MONGODB_URI = "mongodb+srv://pengineer:fltjdaud0901@cluster0.i4qsq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/youtube";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

// Define a schema and model
const videoSchema = new mongoose.Schema({
    youtubeUrl: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});
const Video = mongoose.model("Video", videoSchema);

const app = express();
app.use(cors());
app.use(express.json());

// POST /api/videos
app.post("/api/videos", async (req, res) => {
    const { youtubeUrl, title, description } = req.body;
    if (!youtubeUrl || !title || !description) {
        return res.status(400).json({ error: "youtubeUrl, title, and description are required" });
    }
    try {
        const video = new Video({ youtubeUrl, title, description });
        await video.save();
        res.status(201).json({ message: "Video saved", video });
    } catch (err) {
        res.status(500).json({ error: "Failed to save video" });
    }
});

// GET /api/videos - returns only the latest video
app.get("/api/videos", async (req, res) => {
    try {
        const latestVideo = await Video.findOne().sort({ createdAt: -1 });
        if (!latestVideo) {
            return res.status(404).json({ error: "No videos found" });
        }
        res.json(latestVideo);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch video" });
    }
});

app.get("/api/ping", (req, res) => {
    res.json({ message: "pong" });
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
