import express from "express";
import { ObjectId } from "mongodb";
import db from "../database/db.js";

const router = express.Router();
const database = db();
await database.connect();

// POST /api/favorites - CREATE a favorite
router.post("/", async (req, res) => {
  try {
    const { email, trail_id, mountain_id } = req.body;

    // Check required fields
    if (!email || !trail_id || !mountain_id) {
      return res.status(400).json({
        error: "Email, trail ID, and mountain ID are required",
      });
    }

    const favoritesCollection = await database.getCollection("favorites");

    // Check whether this user already saved this trail
    const existingFavorite = await favoritesCollection.findOne({
      email,
      trail_id: new ObjectId(trail_id),
    });

    // Prevent duplicate favorites
    if (existingFavorite) {
      return res.status(409).json({
        error: "This trail is already in your favorites",
      });
    }

    // Create the favorite document
    const favorite = {
      email,
      trail_id: new ObjectId(trail_id),
      mountain_id: new ObjectId(mountain_id),
      status: "Planned",
      planned_hike_date: "",
      personal_notes: "",
      date_added: new Date(),
    };

    const result = await favoritesCollection.insertOne(favorite);

    res.status(201).json({
      message: "Trail added to favorites",
      favoriteId: result.insertedId,
    });
  } catch (error) {
    console.error("Error adding favorite:", error);

    res.status(500).json({
      error: "Failed to add favorite",
    });
  }
});

// GET /api/favorites/:email - READ a user's favorites
router.get("/:email", async (req, res) => {
  try {
    const favoritesCollection = await database.getCollection("favorites");

    const favorites = await favoritesCollection
      .find({
        email: req.params.email,
      })
      .toArray();

    res.status(200).json(favorites);
  } catch (error) {
    console.error("Error retrieving favorites:", error);

    res.status(500).json({
      error: "Failed to retrieve favorites",
    });
  }
});

// PUT /api/favorites/:favoriteId - UPDATE a favorite
router.put("/:favoriteId", async (req, res) => {
  try {
    const { status, planned_hike_date, personal_notes } = req.body;

    // Only allow the two statuses used by Mountain Explorer
    if (status !== "Planned" && status !== "Completed") {
      return res.status(400).json({
        error: "Status must be Planned or Completed",
      });
    }

    const favoritesCollection = await database.getCollection("favorites");

    const result = await favoritesCollection.updateOne(
      {
        _id: new ObjectId(req.params.favoriteId),
      },
      {
        $set: {
          status,
          planned_hike_date,
          personal_notes,
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        error: "Favorite not found",
      });
    }

    res.status(200).json({
      message: "Favorite updated successfully",
    });
  } catch (error) {
    console.error("Error updating favorite:", error);

    res.status(500).json({
      error: "Failed to update favorite",
    });
  }
});

// DELETE /api/favorites/:favoriteId - DELETE a favorite
router.delete("/:favoriteId", async (req, res) => {
  try {
    const favoritesCollection = await database.getCollection("favorites");

    const result = await favoritesCollection.deleteOne({
      _id: new ObjectId(req.params.favoriteId),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        error: "Favorite not found",
      });
    }

    res.status(200).json({
      message: "Favorite removed successfully",
    });
  } catch (error) {
    console.error("Error deleting favorite:", error);

    res.status(500).json({
      error: "Failed to remove favorite",
    });
  }
});

export default router;
