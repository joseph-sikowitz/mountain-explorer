import express from "express";
import db from "../database/db.js";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

const mountainsRouter = express.Router();

const database = db();
await database.connect();

mountainsRouter.get("/mountains", async (req, res) => {
  if (!database.isActiveDb()) {
    return res.status(500).json({ error: "Database connection error." });
  }

  try {
    if (req.query.name) {
      const dbResult = await database.queryCollection(
        process.env.MONGODB_COLLECTION_MOUNTAINS,
        { name: req.query.name }
      );
      return res.status(200).json(dbResult);
    } else {
      return res.status(404).json({ error: "Name not found" });
    }
  } catch (error) {
    console.error("GET error for /api/mountains: ", error);
    return res.status(500).json({ error: "GET error for /api/mountains" });
  }
});

export default mountainsRouter;
