import { ethers } from 'ethers';
import 'dotenv/config';

export const PRIVATE_KEY = process.env.PRIVATE_KEY;
export const MORALIS_API_KEY=process.env.MORALIS_API_KEY;
export const ALCHEMY_API_KEY=process.env.ALCHEMY_API_KEY;
export const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
export const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
export const PROVIDER = new ethers.providers.JsonRpcProvider(SEPOLIA_RPC_URL);
export const SIGNER = new ethers.Wallet(PRIVATE_KEY, PROVIDER);
export const TOKEN_DECIMALS = 18;
export const VIRTUAL_LIQUIDITY = 100 // 100 AVAX
export const MAX_SUPPLY = 1000000000 // 1 billion 
export const DEFAULT_PRICE = VIRTUAL_LIQUIDITY / MAX_SUPPLY;

// FUJI
export const TOKEN_FACTORY_ADDRESS = "0x20F4E1b0F46094A1e2ffBD10eb0f104DdE3De139"
export const FUJI_CHAIN_ID = 43113;
export const FUJI_RPC_URL = "https://avalanche-fuji-c-chain-rpc.publicnode.com";
export const FUJI_PROVIDER = new ethers.providers.JsonRpcProvider(FUJI_RPC_URL);

// Uniswap V3 in sepolia
export const NONFUNGIBLE_POSITION_MANAGER = '0x1238536071E1c677A632429e3655c799b22cDA52';
export const UNISWAP_V3_FACTORY = '0x0227628f3F023bb0B980b67D528571c95c6DaC1c';
export const SEPOLIA_CHAIN_ID = 11155111;