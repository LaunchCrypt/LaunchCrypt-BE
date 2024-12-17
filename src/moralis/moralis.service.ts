import { Injectable, OnModuleInit } from '@nestjs/common';
import Moralis from 'moralis';
import { MORALIS_API_KEY } from '../../constants';
import { EvmChain } from '@moralisweb3/common-evm-utils';
@Injectable()
export class MoralisService implements OnModuleInit{
    async onModuleInit() {
        await Moralis.start({
          apiKey: MORALIS_API_KEY
        });
      }
    
    async getWalletTokens(address:string, chainId:string){
        let chain;
        switch (chainId) {
            case "43113": chain = EvmChain.AVALANCHE_TESTNET;
                break;
            case "1": chain = EvmChain.ETHEREUM;
                break;
            default: chain = EvmChain.AVALANCHE_TESTNET;
        }
        const response = await Moralis.EvmApi.token.getWalletTokenBalances({
            address,
            chain,
        });
    }
}
