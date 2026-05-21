import app from "./app";
import config from "./config";
import { initDB } from "./db";

const main = async () => {
  await initDB();
  app.listen(config.PORT, () => {
    console.log(`L2B7A2 app listening on port ${config.PORT}`);
  });
};

main();