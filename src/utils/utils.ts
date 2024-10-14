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

export function dateFormatter(startTime: number, endTime: number, format: "dayMonth" | "time") {
  // Calculate the middle time
  const middleTime = new Date((startTime + endTime) / 2);

  if (format === "dayMonth") {
    const middleDayMonth = `${middleTime.getDate()}/${middleTime.getMonth() + 1}`;
    return middleDayMonth;
  } else if (format === "time") {
    const middleTimeFormatted = middleTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    return middleTimeFormatted;
  } else {
    throw new Error("Invalid format type. Use 'dayMonth' or 'time'.");
  }
}

