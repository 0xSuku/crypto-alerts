import axios from "axios";
import { indigoAlert } from "../helpers/telegram";
import { CdpData, PriceData } from "../interfaces/indigo.interfaces";

const addresses = process.env.ENV_INDIGO_ADDRESSES?.split(", ") || [];
const cdpApiUrl = "https://analytics.indigoprotocol.io/api/cdps";
const priceApiUrl = "https://analytics.indigoprotocol.io/api/price";

export async function checkCollateralPercentages() {
  try {
    if (addresses.length === 0) {
      console.log("No addresses found in .env.INDIGO_ADDRESSES");
      return;
    }
    
    const cdpResponse = await axios.post<CdpData[]>(cdpApiUrl, {owners: []});
    const cdpData = cdpResponse.data.filter((cdp) => addresses.includes(cdp.owner));

    const priceResponseBTC = await axios.get<PriceData>(priceApiUrl, { params: { from: "ADA", to: "BTC" } });
    const priceDataBTC = priceResponseBTC.data;
    const priceBTC = priceDataBTC.price;

    const priceResponseETH = await axios.get<PriceData>(priceApiUrl, { params: { from: "ADA", to: "ETH" } });
    const priceDataETH = priceResponseETH.data;
    const priceETH = priceDataETH.price;

    for (const cdp of cdpData) {
      const collateralAmount = cdp.collateralAmount;
      const mintedAmount = cdp.mintedAmount;
      const price = cdp.asset === "iBTC" ? priceBTC : priceETH;

      const collateralValue = collateralAmount * price;
      const collateralRatio = (collateralValue / mintedAmount) * 100;

      if (collateralRatio < 130) {
        console.log(`Collateral ratio for CDP ${cdp.output_hash} is BELOW 130%: ${collateralRatio.toFixed(2)}%`);
        indigoAlert(cdp.output_hash, cdp.asset, collateralRatio, collateralValue, mintedAmount);
      } else {
        console.log(`Collateral ratio for CDP ${cdp.output_hash} is above 130%: ${collateralRatio.toFixed(2)}%`);
      }
    }
  } catch (error) {
    // console.error("Error fetching data or calculating collateral ratios:", error);
  }
}