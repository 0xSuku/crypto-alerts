import { Telegraf } from "telegraf";

const bot = new Telegraf(process.env.ENV_TELEGRAM_TOKEN || "");
const chatId_URGENT = process.env.ENV_TELEGRAM_CHATID_URGENT || "";

export async function indigoAlert(
  outputHash: string,
  asset: string,
  collateralRatio: number,
  collateralValue: number,
  mintedAmount: number
) {
  await bot.telegram.sendMessage(
    chatId_URGENT,
    `[Indigo]\n\n* CDP: ${outputHash}\n* Asset: ${asset}\n* Ratio: ${collateralRatio.toFixed(
      2
    )}%\n* Value: ${collateralValue}\n* Minted: ${mintedAmount}`
  );
}
