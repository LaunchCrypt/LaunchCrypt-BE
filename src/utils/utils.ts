import { encodeSqrtRatioX96 } from '@uniswap/v3-sdk';
import { BigintIsh } from '@uniswap/sdk-core';
import { ethers } from 'ethers';
import { signer } from '../../constants';

export class Utils {
  public static encodePriceSqrt(
    token1Price: BigintIsh,
    token0Price: BigintIsh,
  ) {
    return encodeSqrtRatioX96(token1Price, token0Price);
  }
}

export async function getContract(address: string, abi: any) {
  const contract = new ethers.Contract(address, abi, signer);
  return contract;
}

