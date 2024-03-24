// Interface for CDP data
export interface CdpData {
  asset: string;
  collateralAmount: number;
  mintedAmount: number;
  output_hash: string;
  output_index: number;
  owner: string;
}

// Interface for price data
export interface PriceData {
  price: number;
}
