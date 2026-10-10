import express from "express";
import { ObjectId } from "mongodb";
import db from "../database/db.js";

const trailsRouter = express.Router();

const database = db();
await database.connect();

// GET /api/trails?mountain_id=...
// Get all trails belonging to one mountain
trailsRouter.get("/", async (req, res) => {
  try {
    const { mountain_id } = req.query;

    if (!mountain_id) {
      return res.status(400).json({
        error: "Mountain ID is required",
      });
    }

    const trailsCollection = await database.getCollection("trails");

    const trails = await trailsCollection
      .find({
        mountain_id: new ObjectId(mountain_id),
      })
      .toArray();

    return res.status(200).json(trails);
  } catch (error) {
    console.error("Error retrieving trails:", error);

    return res.status(500).json({
      error: "Failed to retrieve trails",
    });
  }
});

// GET /api/trails/:id
// Get one trail by its MongoDB _id
trailsRouter.get("/:id", async (req, res) => {
  try {
    const trailsCollection = await database.getCollection("trails");

    const trail = await trailsCollection.findOne({
      _id: new ObjectId(req.params.id),
    });

    if (!trail) {
      return res.status(404).json({
        error: "Trail not found",
      });
    }

    return res.status(200).json(trail);
  } catch (error) {
    console.error("Error retrieving trail:", error);

    return res.status(500).json({
      error: "Failed to retrieve trail",
    });
  }
});

export default trailsRouter;
