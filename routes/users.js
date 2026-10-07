import express from "express";

const router = express.Router();

router.post("/", (req, res) => {
  console.log(req.body);

  res.send("User registration received");
});

// Export this router to be used in the main app
export default router;
