import express from "express";
import usersRouter from "./backend/routes/users.js";
import mountainsRouter from "./backend/routes/mountains.js";
import favoritesRouter from "./backend/routes/favorites.js";
import trailsRouter from "./backend/routes/trails.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

app.use(express.json());
// When a request starts with /api/users, hand that request to the router in routes/users.js.
app.use("/api/users", usersRouter);
// When a request starts with /api/favorites, use the favorites router.
app.use("/api/favorites", favoritesRouter);
// When a request starts with /api/trails, hand that request to the router in routes/trails.js.
app.use("/api/trails", trailsRouter);

app.use("/api", mountainsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
