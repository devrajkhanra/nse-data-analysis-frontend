import axios from "axios";
import type { Nifty50Company, IndexData, OptionChain } from "../types";

// Cache helper (simple in-memory)
const cache: Record<string, any> = {};
const BASE_URL = "http://localhost:3000/api";

let sectorsCache: string[] | null = null;
let sectorStocksCache: Record<string, Nifty50Company[]> = {};
let nifty50ListCache: Nifty50Company[] = [];

/** Fetch main sectors from indice data (filter major ones) */
export async function fetchMainSectors(): Promise<string[]> {
  if (sectorsCache) return sectorsCache;
  const res = await axios.get(`${BASE_URL}/allIndice`);
  const majorKeywords = [
    "Nifty Bank",
    "Nifty Financial",
    "Nifty Auto",
    "Nifty IT",
    "Nifty FMCG",
    "Nifty Pharma",
    "Nifty Metal",
    "Nifty Realty",
    "Nifty Energy",
    "Nifty Media",
    "Nifty Consumer Durables",
    "Nifty Oil",
  ];
  // Get all indices, filter for those with names matching a major sector
  const raw: IndexData[] = res.data;
  const sectorSet = new Set<string>();
  for (const idx of raw) {
    for (const keyword of majorKeywords) {
      if (idx.indexName.startsWith(keyword)) sectorSet.add(keyword);
    }
  }
  sectorsCache = Array.from(sectorSet);
  return sectorsCache;
}

/** Fetch the Nifty50 stock list (with sector/industry meta) */
export async function fetchNifty50List(): Promise<Nifty50Company[]> {
  if (nifty50ListCache) return nifty50ListCache;
  const res = await axios.get(`${BASE_URL}/nifty50`);
  nifty50ListCache = res.data;
  return nifty50ListCache;
}

/** Given a sector, return all stocks in it (from Nifty50 list) */
export async function fetchStocksBySector(
  sector: string
): Promise<Nifty50Company[]> {
  if (sectorStocksCache[sector]) return sectorStocksCache[sector];
  const list = await fetchNifty50List();
  // NIFTY and BANKNIFTY are not single stocks but indices, so special-case them
  if (sector === "NIFTY")
    return [
      {
        symbol: "NIFTY",
        companyName: "Nifty Index",
        industry: "Index",
        series: "OPTIDX",
        isinCode: "",
      },
    ];
  if (sector === "BANKNIFTY")
    return [
      {
        symbol: "BANKNIFTY",
        companyName: "Bank Nifty Index",
        industry: "Index",
        series: "OPTIDX",
        isinCode: "",
      },
    ];
  // Filter other stocks by their 'industry' includes the sector name
  const stocks = list.filter((stk) =>
    (stk.industry || "")
      .toLowerCase()
      .includes(sector.replace("Nifty ", "").toLowerCase())
  );
  sectorStocksCache[sector] = stocks;
  return stocks;
}

export async function fetchExpiryDates(symbol: string): Promise<string[]> {
  const key = `expiries:${symbol}`;
  if (cache[key]) return cache[key];
  const resp = await axios.get(`${BASE_URL}/option/test`);
  const combos: string[] = resp.data.uniqueSymbolExpiryCombos || [];
  const expiries = combos
    .map((combo) => {
      const [sym, exp] = combo.split("|");
      return {
        sym: JSON.parse(sym.trim()),
        exp: JSON.parse(exp.trim()),
      };
    })
    .filter((x) => x.sym.toUpperCase() === symbol.toUpperCase())
    .map((x) => x.exp);
  const uniqueExpiries = Array.from(new Set(expiries));
  cache[key] = uniqueExpiries;
  return uniqueExpiries;
}

export async function fetchAvailableOptionDates(): Promise<string[]> {
  const key = `optionDates`;
  if (cache[key]) return cache[key];
  const resp = await axios.get(`${BASE_URL}/option/available-dates`);
  cache[key] = resp.data;
  return resp.data;
}

// Fetch option chain with optional dates and previousDate for delta comparison
export async function fetchOptionChain(
  symbol: string,
  expiry: string,
  dates: string | string[],
  previousDate?: string
): Promise<OptionChain> {
  const params: any = { symbol, expiry };
  if (dates) params.dates = Array.isArray(dates) ? dates.join(",") : dates;
  if (previousDate) params.previousDate = previousDate;
  const key = `chain:${symbol}:${expiry}:${params.dates || "all"}:${
    previousDate || "none"
  }`;
  if (cache[key]) return cache[key];
  const resp = await axios.get(`${BASE_URL}/option/chain`, { params });
  cache[key] = resp.data;
  return resp.data;
}
