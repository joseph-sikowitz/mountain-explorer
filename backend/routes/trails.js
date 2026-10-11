import express from "express";
import db from "../database/db.js";
import dotenv from "dotenv";
import { ObjectId } from "mongodb";

const LIMIT_DEFAULT = 10;

dotenv.config({ quiet: true });

const trailsRouter = express.Router();

const database = db();
await database.connect();

// Parse equipment_needed array
function parseEquipment(equipment) {
  if (equipment && typeof equipment === "string") {
    const equipment_array = equipment.split(",").map((e) => e.trim());
    return { $all: equipment_array };
  }

  return [];
}

// Used to build Mongo query from URL parameters
function filterQuery(query) {
  const {
    name,
    difficulty,
    time_needed_to_hike,
    equipment_needed,
    tent_sites_available,
    mountain_id,
  } = query;

  const mongoQuery = {};

  if (name && typeof name === "string" && name.trim()) {
    mongoQuery.name = name;
  }
  if (difficulty && difficulty.trim() && !isNaN(Number(difficulty))) {
    mongoQuery.difficulty = Number(difficulty);
  }
  if (
    time_needed_to_hike &&
    time_needed_to_hike.trim() &&
    !isNaN(Number(time_needed_to_hike))
  ) {
    mongoQuery.time_needed_to_hike = Number(time_needed_to_hike);
  }
  if (
    equipment_needed &&
    typeof equipment_needed === "string" &&
    equipment_needed.trim()
  ) {
    mongoQuery.equipment_needed = parseEquipment(equipment_needed);
    console.log(mongoQuery.equipment_needed);
  }
  if (tent_sites_available && typeof tent_sites_available === "boolean") {
    mongoQuery.tent_sites_available = tent_sites_available;
  }
  if (mountain_id && typeof mountain_id === "string" && mountain_id.trim()) {
    const m_id = new ObjectId(mountain_id);
    mongoQuery.mountain_id = m_id;
  }

  return mongoQuery;
}

// GET for total documents
trailsRouter.get("/trails/count", async (req, res) => {
  // Check if we have a database connection
  if (!database.isActiveDb()) {
    return res.status(500).json({ error: "Database connection error" });
  }

  try {
    // GET trails collection
    const collection = await database.getCollection(
      process.env.MONGODB_COLLECTION_TRAILS
    );
    const count = await collection.countDocuments({});
    return res.status(200).json({ trailsTotal: count });
  } catch (error) {
    console.error("Error getting trails count: ", error);
    return res.status(500).json({ error: "Error getting trails count" });
  }
});

// GET endpoint for /api/trails
trailsRouter.get("/trails", async (req, res) => {
  // Check if we have a database connection
  if (!database.isActiveDb()) {
    return res.status(500).json({ error: "Database connection error" });
  }

  try {
    // Check that any parameters were passed in
    if (Object.keys(req.query).length > 0) {
      // Parse query from request if it exists
      const mongoQuery = filterQuery(req.query);
      // Set limit if it is given otherwise use default
      const limit =
        req.query.limit && !isNaN(Number(req.query.limit))
          ? Number(req.query.limit)
          : LIMIT_DEFAULT;
      // Perform query on database
      const dbResult = await database.queryCollection(
        process.env.MONGODB_COLLECTION_TRAILS,
        mongoQuery,
        limit
      );
      return res.status(200).json(dbResult);
    } else {
      // Perform query on database with no parameters
      const dbResult = await database.queryCollection(
        process.env.MONGODB_COLLECTION_TRAILS,
        {}
      );
      return res.status(200).json(dbResult);
    }
  } catch (error) {
    console.error("GET error for /api/trails: ", error);
    return res.status(500).json({ error: "GET error for /api/trails" });
  }
});

// GET endpoint for /api/trails/:id
trailsRouter.get("/trails/:id", async (req, res) => {
  // Check if we have a database connection
  if (!database.isActiveDb()) {
    return res.status(500).json({ error: "Database connection error" });
  }

  try {
    // GET for a single ID
    const collection = await database.getCollection(
      process.env.MONGODB_COLLECTION_TRAILS
    );
    const record = await collection.findOne({
      _id: new ObjectId(req.params.id),
    });
    return res.status(200).json(record);
  } catch (error) {
    console.error("GET error for /api/trails/:id: ", error);
    return res.status(500).json({ error: "GET error for /api/trails/:id" });
  }
});

// PUT endpoint for /api/trails/:id
trailsRouter.put("/trails/:id", async (req, res) => {
  // Check if we have a database connection
  if (!database.isActiveDb()) {
    return res.status(500).json({ error: "Database connection error" });
  }

  console.log(req.body);

  try {
    // Required: all fields except for _id since _id is passed in path
    const {
      name,
      difficulty,
      time_needed_to_hike,
      equipment_needed,
      tent_sites_available,
      mountain_id,
    } = req.body;

    // Only do PUT if all fields are present
    if (
      name &&
      difficulty &&
      time_needed_to_hike &&
      equipment_needed &&
      tent_sites_available !== undefined &&
      mountain_id
    ) {
      // Connect to collection
      const collection = await database.getCollection(
        process.env.MONGODB_COLLECTION_TRAILS
      );
      // Update one record where the ID matches, set all other variables to those from body
      const putResult = await collection.updateOne(
        { _id: new ObjectId(req.params.id) },
        {
          $set: {
            name,
            difficulty,
            time_needed_to_hike,
            equipment_needed,
            tent_sites_available,
            mountain_id: new ObjectId(mountain_id),
          },
        }
      );
      // PUT returns {acknowledged, modifiedCount, upsertedId, upsertedCount, matchedCount}
      return res.status(200).json(putResult);
    } else {
      console.error("PUT error for /api/trails/:id");
      // User error
      return res.status(422).json({ error: "PUT error for /api/trails/:id" });
    }
  } catch (error) {
    // PUT request error
    console.error("PUT error for /api/trails/:id ", error);
    return res.status(500).json({ error: "PUT error for /api/trails/:id" });
  }
});

// POST endpoint for /api/trails
trailsRouter.post("/trails", async (req, res) => {
  // Check if we have a database connection
  if (!database.isActiveDb()) {
    return res.status(500).json({ error: "Database connection error" });
  }

  try {
    // Required: all fields except for ID since ID is passed in path
    const {
      name,
      difficulty,
      time_needed_to_hike,
      equipment_needed,
      tent_sites_available,
      mountain_id,
    } = req.body;

    // Only do POST if all fields are present
    if (
      name &&
      difficulty &&
      time_needed_to_hike &&
      equipment_needed &&
      tent_sites_available !== undefined &&
      mountain_id
    ) {
      // Connect to collection
      const collection = await database.getCollection(
        process.env.MONGODB_COLLECTION_TRAILS
      );
      // Insert new record with all fields
      const postResult = await collection.insertOne({
        name: name,
        difficulty: difficulty,
        time_needed_to_hike: time_needed_to_hike,
        equipment_needed: equipment_needed,
        tent_sites_available: tent_sites_available,
        mountain_id: new ObjectId(mountain_id),
      });
      // POST returns {acknowledged, insertedId}
      return res.status(200).json(postResult);
    } else {
      console.error("POST error for /api/trails");
      // User error
      return res.status(422).json({ error: "POST error for /api/trails" });
    }
  } catch (error) {
    // PUT request error
    console.error("POST error for /api/trails ", error);
    return res.status(500).json({ error: "POST error for /api/trails" });
  }
});

// DELETE endpoint for /api/trails/:id
trailsRouter.delete("/trails/:id", async (req, res) => {
  // Check if we have a database connection
  if (!database.isActiveDb()) {
    return res.status(500).json({ error: "Database connection error" });
  }

  try {
    // DELETE for a single ID
    const collection = await database.getCollection(
      process.env.MONGODB_COLLECTION_TRAILS
    );
    const result = await collection.deleteOne({
      _id: new ObjectId(req.params.id),
    });
    return res.status(200).json(result);
  } catch (error) {
    console.error("DELETE error for /api/trails/:id: ", error);
    return res.status(500).json({ error: "DELETE error for /api/trails/:id" });
  }
});

export default trailsRouter;
