// src/types.ts

/** Represents a company in the Nifty 50 index */
export interface Nifty50Company {
  companyName: string;
  industry: string;
  symbol: string;
  series: string;
  isinCode: string;
}

/** Represents a single record of indice data */
export interface IndexData {
  indexName: string;
  indexDate: string; // Format: e.g. "01-07-2025"
  openIndexValue: number | null;
  highIndexValue: number | null;
  lowIndexValue: number | null;
  closingIndexValue: number;
  pointsChange: number | null;
  changePercent: number | null;
  volume: number | null;
  turnoverRsCr: number | null;
  pe: number | null;
  pb: number | null;
  divYield: number | null;
}

/** Represents a single security's stock data */
export interface SecurityData {
  symbol: string;
  series: string;
  date1: string; // e.g. "01-07-2025"
  prevClose: number;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  lastPrice: number;
  closePrice: number;
  avgPrice: number;
  ttlTrdQnty: number;
  turnoverLacs: number;
  noOfTrades: number;
  delivQty: number | null;
  delivPer: number | null;
}

/** Raw option data row parsed from CSV */
export interface OptionRow {
  instrument: string; // e.g. "OPTIDX"
  symbol: string; // e.g. "BANKNIFTY"
  expDate: string; // e.g. "31-07-2025" (expiry date, same format as CSV)
  strPrice: number; // Strike price
  optType: "CE" | "PE"; // Option type, Call or Put
  openPrice: number;
  hiPrice: number;
  loPrice: number;
  closePrice: number;
  openInt: number;
  trdQty: number;
  noOfCont: number;
  noOfTrade: number;
  notionVal: number;
  prVal: number;
}

/** Option row extended with delta fields for day-over-day change */
export interface OptionRowWithDeltas extends OptionRow {
  deltaOI?: number; // Change in Open Interest from previous day (positive / negative)
  deltaPremium?: number; // Change in close price (premium) from previous day
}

/** Grouping of option data by strike price with CE and PE rows */
export interface OptionChainLegs {
  strPrice: number;
  CE?: OptionRow; // Call option data for this strike
  PE?: OptionRow; // Put option data for this strike
}

/** Option chain with basic grouped legs */
export interface OptionChain {
  instrument: string; // Instrument name, e.g. "OPTIDX"
  symbol: string; // e.g. "BANKNIFTY"
  expDate: string; // Expiry e.g. "31-07-2025"
  strikes: OptionChainLegs[]; // Array of legs grouped by strike price
}

/** Option chain leg with delta-enhanced option rows */
export interface OptionChainLegWithDeltas {
  strPrice: number;
  CE?: OptionRowWithDeltas;
  PE?: OptionRowWithDeltas;
}

/** Option chain structure with delta fields for CE and PE */
export interface OptionChainWithDeltas {
  instrument: string;
  symbol: string;
  expDate: string;
  strikes: OptionChainLegWithDeltas[];
}
