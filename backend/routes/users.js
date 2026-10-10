import express from "express";
import db from "../database/db.js";

const router = express.Router();
const database = db();
await database.connect();

// POST /api/users - CREATE a new user
router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, country, email, password } = req.body;

    // Check that all required fields were provided
    if (!firstName || !lastName || !country || !email || !password) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    const usersCollection = await database.getCollection("users");

    // Check whether the email is already registered
    const existingUser = await usersCollection.findOne({
      email: email,
    });

    if (existingUser) {
      return res.status(409).json({
        error: "An account with this email already exists",
      });
    }

    // Create the user document
    const user = {
      firstName,
      lastName,
      country,
      email,
      password,
      role: "user",
    };

    const result = await usersCollection.insertOne(user);

    res.status(201).json({
      message: "User created successfully",
      userId: result.insertedId,
    });
  } catch (error) {
    console.error("Error creating user:", error);

    res.status(500).json({
      error: "Failed to create user",
    });
  }
});

// POST /api/users/login - READ an existing user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check that email and password were provided
    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    const usersCollection = await database.getCollection("users");

    // Find a user with the submitted email and password
    const user = await usersCollection.findOne({
      email,
      password,
    });

    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    // Return the user's email as unique identifier for the profile page
    res.status(200).json({
      message: "Login successful",
      email: user.email,
    });
  } catch (error) {
    console.error("Error logging in:", error);

    res.status(500).json({
      error: "Failed to log in",
    });
  }
});

// GET /api/users/:email - READ a user's profile by email
router.get("/:email", async (req, res) => {
  try {
    const usersCollection = await database.getCollection("users");

    const user = await usersCollection.findOne({
      email: req.params.email,
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    res.status(200).json({
      firstName: user.firstName,
      lastName: user.lastName,
      country: user.country,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("Error retrieving user:", error);

    res.status(500).json({
      error: "Failed to retrieve user",
    });
  }
});

// Update a user's password
router.put("/:email/password", async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        error: "New password is required",
      });
    }

    const usersCollection = await database.getCollection("users");

    const result = await usersCollection.updateOne(
      {
        email: req.params.email,
      },
      {
        $set: {
          password,
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Error updating password:", error);

    res.status(500).json({
      error: "Failed to update password",
    });
  }
});

// Delete a user's account
router.delete("/:email", async (req, res) => {
  try {
    const usersCollection = await database.getCollection("users");

    const result = await usersCollection.deleteOne({
      email: req.params.email,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    res.status(200).json({
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);

    res.status(500).json({
      error: "Failed to delete account",
    });
  }
});

// Export this router to be used in the main app
export default router;
