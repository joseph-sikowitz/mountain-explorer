import express from "express";
import db from "../database/db.js";
import dotenv from "dotenv";

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
          : 10;
      // Perform query on database
      const dbResult = await database.queryCollection(
        process.env.MONGODB_COLLECTION_MOUNTAINS,
        mongoQuery,
        limit
      );
      return res.status(200).json(dbResult);
    } else {
      return res.status(404).json({ error: "GET error no parameters" });
    }
  } catch (error) {
    console.error("GET error for /api/mountains: ", error);
    return res.status(500).json({ error: "GET error for /api/mountains" });
  }
});

export default mountainsRouter;
