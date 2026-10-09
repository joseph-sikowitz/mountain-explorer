import express from "express";
import mountainsRouter from "./backend/routes/mountains.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

app.use(express.json());

app.use("/api", mountainsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
