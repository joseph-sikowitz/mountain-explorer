import "dotenv/config";
import db from "../database/db.js";

const database = db();

const mountain = await database.queryCollection(
  process.env.MONGODB_COLLECTION_MOUNTAINS,
  {
    name: "Clayhill",
  }
);

const mountain1 = await database.queryCollection(
  process.env.MONGODB_COLLECTION_MOUNTAINS,
  {
    name: "Clayhill",
  }
);

await database.disconnect();

console.log("Mountain: ", mountain[0]);
console.log("Mountain: ", mountain1[0]);
