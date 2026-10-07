import "dotenv/config";
import * as db from "../database/db.js";

const mountain = await db.queryCollection(
  process.env.MONGODB_COLLECTION_MOUNTAINS,
  {
    name: "Clayhill",
  }
);

console.log("Mountain: ", mountain);
