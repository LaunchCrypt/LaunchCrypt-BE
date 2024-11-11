import { ethers } from 'ethers';
import 'dotenv/config';

export const PRIVATE_KEY = process.env.PRIVATE_KEY;
export const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
export const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
export const PROVIDER = new ethers.providers.JsonRpcProvider(SEPOLIA_RPC_URL);
export const SIGNER = new ethers.Wallet(PRIVATE_KEY, PROVIDER);
export const TOKEN_DECIMALS = 18;

// FUJI
export const TOKEN_FACTORY_ADDRESS = "0xdC426d5470D2b3C1ABf4d00DbCe3F6Db14550CC3"
export const FUJI_CHAIN_ID = 43113;

// Uniswap V3 in sepolia
export const NONFUNGIBLE_POSITION_MANAGER = '0x1238536071E1c677A632429e3655c799b22cDA52';
export const UNISWAP_V3_FACTORY = '0x0227628f3F023bb0B980b67D528571c95c6DaC1c';
export const SEPOLIA_CHAIN_ID = 11155111;