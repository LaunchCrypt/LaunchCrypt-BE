import { signer, UNISWAP_V3_FACTORY, SEPOLIA_CHAIN_ID, NONFUNGIBLE_POSITION_MANAGER, TOKEN_DECIMALS } from './../../constants';
import { Injectable } from '@nestjs/common';
import { BaseContract, BigNumber, ethers } from 'ethers';
import { UNISWAP_FACTOR_ABI, UNISWAP_V3_POOL_ABI, ERC20_ABI } from "../../abi";
import JSBI from 'jsbi';
import { Token, Percent } from '@uniswap/sdk-core';
import { nearestUsableTick, NonfungiblePositionManager, Pool, Position } from '@uniswap/v3-sdk';
import { getContract, Utils } from 'src/utils/utils';

@Injectable()
export class UniswapService {
    async createLiquidityPool(
        token0Address: string,
        token1Address: string,
        fee: number,
        initialToken0Amount: string,
        initialToken1Amount: string
    ) {
        const price = Utils.encodePriceSqrt(initialToken1Amount, initialToken0Amount);
        const uniswapFactoryContract = await getContract(UNISWAP_V3_FACTORY, UNISWAP_FACTOR_ABI)
        const token0 = await getContract(token0Address, ERC20_ABI);
        const token1 = await getContract(token1Address, ERC20_ABI);
        const token0Amount = ethers.utils.parseUnits(initialToken0Amount, TOKEN_DECIMALS);
        const token1Amount = ethers.utils.parseUnits(initialToken1Amount, TOKEN_DECIMALS);

        let poolAddress = await uniswapFactoryContract.getPool(token0Address, token1Address, fee);
        const deployer = signer;
        if (poolAddress === '0x0000000000000000000000000000000000000000') {
            console.log("Creating pool");
            poolAddress = await this.createPool(uniswapFactoryContract, token0Address, token1Address, fee);

            await this.initializePool(poolAddress, price, deployer);
        }
        await this.addLiquidityToPool(
            poolAddress,
            deployer,
            SEPOLIA_CHAIN_ID,
            TOKEN_DECIMALS,
            TOKEN_DECIMALS,
            token0,
            token1,
            token0Amount,
            token1Amount,
            fee,
            NONFUNGIBLE_POSITION_MANAGER
        );
    }

    async getPoolState(poolContract: any) {
        const liquidity = await poolContract.liquidity();
        const slot = await poolContract.slot0();

        const PoolState = {
            liquidity,
            sqrtPriceX96: slot[0],
            tick: slot[1],
            observationIndex: slot[2],
            observationCardinality: slot[3],
            observationCardinalityNext: slot[4],
            feeProtocol: slot[5],
            unlocked: slot[6],
        };

        return PoolState;
    }

    async createPool(uniswapFactoryContract: any, token1Address: string, token0Address: string, fee: number) {
        const tx = await uniswapFactoryContract.createPool(token1Address, token0Address, fee, { gasLimit: 10000000 });
        await tx.wait();

        const poolAddr = await uniswapFactoryContract.getPool(token1Address, token0Address, fee, { gasLimit: 3000000 });
        console.log('Pool Address:', poolAddr);
        return poolAddr;
    }

    async initializePool(poolAddress: string, price: JSBI, signer: ethers.Signer) {
        const poolContract = new ethers.Contract(poolAddress, UNISWAP_V3_POOL_ABI, signer);
        const tx = await poolContract.initialize(price.toString(), { gasLimit: 3000000 });
        await tx.wait();
        console.log('Pool Initialized');
    }

    async addLiquidityToPool(
        poolAddr: string,
        deployer: ethers.Wallet,
        chainId: number,
        token1Decimals: number,
        token2Decimals: number,
        tokenContract1: BaseContract,
        tokenContract2: BaseContract,
        amount0: BigNumber,
        amount1: BigNumber,
        fee: number,
        npmca: string,
    ) {
        const poolContract = new ethers.Contract(poolAddr, UNISWAP_V3_POOL_ABI, deployer);

        const state = await this.getPoolState(poolContract);

        const token1 = new Token(chainId, tokenContract1.address, token1Decimals);
        const token2 = new Token(chainId, tokenContract2.address, token2Decimals);

        const configuredPool = new Pool(
            token1,
            token2,
            fee,
            state.sqrtPriceX96.toString(),
            state.liquidity.toString(),
            state.tick
        )

        const position = Position.fromAmounts({
            pool: configuredPool,
            tickLower: nearestUsableTick(configuredPool.tickCurrent, configuredPool.tickSpacing) - configuredPool.tickSpacing * 2,
            tickUpper: nearestUsableTick(configuredPool.tickCurrent, configuredPool.tickSpacing) + configuredPool.tickSpacing * 2,
            amount0: amount0.toString(),
            amount1: amount1.toString(),
            useFullPrecision: false,
        })

        const mintOptions = {
            recipient: deployer.address,
            deadline: Math.floor(Date.now() / 1000) + 60 * 20,
            slippageTolerance: new Percent(50, 10_000),
        }

        const { calldata, value } = NonfungiblePositionManager.addCallParameters(position, mintOptions);
        console.log("calldata", calldata)
        console.log("value", value)

        const transaction = {
            data: calldata,
            to: npmca,
            value: value,
            from: deployer.address,
            gasLimit: 10000000
        }
        console.log('Transacting');
        const txRes = await deployer.sendTransaction(transaction);
        await txRes.wait();
        console.log('Added liquidity');
    }
}
