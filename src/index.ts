require("dotenv").config();
import * as indigoAdapter from "./adapters/indigo.adapter";

async function main() {
  await Promise.race([indigoAdapter.checkCollateralPercentages()]);
  process.exit();
}

main();
