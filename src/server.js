import dotenv from "dotenv";
import { app } from "./app.js";
import { dbConnection } from "./db/connection.js";

dotenv.config({ path: "./.env" });

const port = process.env.PORT;

dbConnection()
  .then(() => {
    app.listen(port, () => {
      console.log("APP is running on port", port);
    });
  })
  .catch((err) => {
    console.log(`Error while running the server ${error}`);
  });
