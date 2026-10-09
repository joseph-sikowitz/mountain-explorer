import express from "express";
import usersRouter from "./routes/users.js";
import mountainsRouter from "./backend/routes/mountains.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
// Ken: This middleware is used to parse incoming JSON requests and make the data available in req.body.
app.use(express.json());
// Ken: When a request starts with /api/users, hand that request to the router in routes/users.js.
app.use("/api/users", usersRouter);

app.use("/api", mountainsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
