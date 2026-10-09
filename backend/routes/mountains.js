import express from "express";
import db from "../database/db.js";
import dotenv from "dotenv";
import { ObjectId } from "mongodb";

const LIMIT_DEFAULT = 10;

dotenv.config({ quiet: true });

const mountainsRouter = express.Router();

const database = db();
await database.connect();

// Used to build Mongo query from URL parameters
function filterQuery(query) {
  const { name, country, typical_weather, latitude, longitude } = query;

  const mongoQuery = {};

  if (name && typeof name === "string" && name.trim()) {
    mongoQuery.name = name;
  }
  if (country && typeof country === "string" && country.trim()) {
    mongoQuery.country = country;
  }
  if (
    typical_weather &&
    typeof typical_weather === "string" &&
    typical_weather.trim()
  ) {
    mongoQuery.typical_weather = typical_weather;
  }
  if (latitude && latitude.trim() && !isNaN(Number(latitude))) {
    mongoQuery.latitude = Number(latitude);
  }
  if (longitude && longitude.trim() && !isNaN(Number(longitude))) {
    mongoQuery.longitude = Number(longitude);
  }

  return mongoQuery;
}

// GET for total documents
mountainsRouter.get("/mountains/count", async (req, res) => {
  // Check if we have a database connection
  if (!database.isActiveDb()) {
    return res.status(500).json({ error: "Database connection error" });
  }

  try {
    // GET mountains collection
    const collection = await database.getCollection(
      process.env.MONGODB_COLLECTION_MOUNTAINS
    );
    const count = await collection.countDocuments({});
    console.log(count);
    return res.status(200).json({ mountainsTotal: count });
  } catch (error) {
    console.error("Error getting mountains count: ", error);
    return res.status(500).json({ error: "Error getting mountains count" });
  }
});

// GET endpoint for /api/mountains
mountainsRouter.get("/mountains", async (req, res) => {
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
        process.env.MONGODB_COLLECTION_MOUNTAINS,
        mongoQuery,
        limit
      );
      return res.status(200).json(dbResult);
    } else {
      // Perform query on database with no parameters
      const dbResult = await database.queryCollection(
        process.env.MONGODB_COLLECTION_MOUNTAINS,
        {}
      );
      return res.status(200).json(dbResult);
    }
  } catch (error) {
    console.error("GET error for /api/mountains: ", error);
    return res.status(500).json({ error: "GET error for /api/mountains" });
  }
});

// GET endpoint for /api/mountains/:id
mountainsRouter.get("/mountains/:id", async (req, res) => {
  // Check if we have a database connection
  if (!database.isActiveDb()) {
    return res.status(500).json({ error: "Database connection error" });
  }

  try {
    // GET for a single ID
    const collection = await database.getCollection(
      process.env.MONGODB_COLLECTION_MOUNTAINS
    );
    const record = await collection.findOne({
      _id: new ObjectId(req.params.id),
    });
    return res.status(200).json(record);
  } catch (error) {
    console.error("GET error for /api/mountains/:id: ", error);
    return res.status(500).json({ error: "GET error for /api/mountains/:id" });
  }
});

// PUT endpoint for /api/mountains/:id
mountainsRouter.put("/mountains/:id", async (req, res) => {
  // Check if we have a database connection
  if (!database.isActiveDb()) {
    return res.status(500).json({ error: "Database connection error" });
  }

  try {
    // Required: all fields except for ID since ID is passed in path
    const {
      name,
      height,
      country,
      typical_weather,
      latitude,
      longitude,
      image_url,
    } = req.body;

    // Only do PUT if all fields are present
    if (
      name &&
      height &&
      country &&
      typical_weather &&
      latitude &&
      longitude &&
      image_url
    ) {
      // Connect to collection
      const collection = await database.getCollection(
        process.env.MONGODB_COLLECTION_MOUNTAINS
      );
      // Update one record where the ID matches, set all other variables to those from body
      const putResult = await collection.updateOne(
        { _id: new ObjectId(req.params.id) },
        {
          $set: {
            name,
            height,
            country,
            typical_weather,
            latitude,
            longitude,
            image_url,
          },
        }
      );
      // PUT returns {acknowledged, modifiedCount, upsertedId, upsertedCount, matchedCount}
      return res.status(200).json(putResult);
    } else {
      console.error("PUT error for /api/mountains/:id");
      // User error
      return res
        .status(422)
        .json({ error: "PUT error for /api/mountains/:id" });
    }
  } catch (error) {
    // PUT request error
    console.error("PUT error for /api/mountains/:id ", error);
    return res.status(500).json({ error: "PUT error for /api/mountains/:id" });
  }
});

// POST endpoint for /api/mountains
mountainsRouter.post("/mountains", async (req, res) => {
  // Check if we have a database connection
  if (!database.isActiveDb()) {
    return res.status(500).json({ error: "Database connection error" });
  }

  try {
    // Required: all fields except for ID since ID is passed in path
    const {
      name,
      height,
      country,
      typical_weather,
      latitude,
      longitude,
      image_url,
    } = req.body;

    // Only do POST if all fields are present
    if (
      name &&
      height &&
      country &&
      typical_weather &&
      latitude &&
      longitude &&
      image_url
    ) {
      // Connect to collection
      const collection = await database.getCollection(
        process.env.MONGODB_COLLECTION_MOUNTAINS
      );
      // Insert new record with all fields
      const postResult = await collection.insertOne({
        name: name,
        height: height,
        country: country,
        typical_weather: typical_weather,
        latitude: latitude,
        longitude: longitude,
        image_url: image_url,
      });
      // POST returns {acknowledged, insertedId}
      return res.status(200).json(postResult);
    } else {
      console.error("POST error for /api/mountains ");
      // User error
      return res.status(422).json({ error: "POST error for /api/mountains" });
    }
  } catch (error) {
    // PUT request error
    console.error("POST error for /api/mountains ", error);
    return res.status(500).json({ error: "POST error for /api/mountains" });
  }
});

// DELETE endpoint for /api/mountains/:id
mountainsRouter.delete("/mountains/:id", async (req, res) => {
  // Check if we have a database connection
  if (!database.isActiveDb()) {
    return res.status(500).json({ error: "Database connection error" });
  }

  try {
    // DELETE for a single ID
    const collection = await database.getCollection(
      process.env.MONGODB_COLLECTION_MOUNTAINS
    );
    const result = await collection.deleteOne({
      _id: new ObjectId(req.params.id),
    });
    return res.status(200).json(result);
  } catch (error) {
    console.error("DELETE error for /api/mountains/:id: ", error);
    return res
      .status(500)
      .json({ error: "DELETE error for /api/mountains/:id" });
  }
});

export default mountainsRouter;
