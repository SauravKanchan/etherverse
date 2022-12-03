import { ethers, BigNumber } from "ethers";
import LIFI from "@lifi/sdk";
import { BRIDGE_DURATION } from "../../store";

const lifi = new LIFI();

export const chainIds = {
    ethereum: 1,
    polygon: 137,
    arbitrum: 42161,
};

//@Params : amount, tokenName, signer, network
export async function bridgeToOtherNetwork(params) {
    console.log(params);
    //{ amount, tokenName, signer, network }
    const currentNetwork = await params.signer.provider.getNetwork()
    const fromChainId = currentNetwork.chainId;
    console.log(typeof params.amount);
    params.amount = ethers.utils.parseEther(params.amount+ "");
    const toChainId = chainIds[params.network];
    if (toChainId === undefined) {
        throw new Error('toChainId is undefined');
    }

    return bridgeAssets(fromChainId, toChainId,params.tokenName,params.amount,params.signer);
}

/**
 * 
 * @param  fromChainId 
 * @param  toChainId 
 * @param  tokenName 
 * @param  amount 
 * @param  signer 
 * @returns 
 */
export async function bridgeAssets(
    fromChainId,
    toChainId,
    tokenName,
    amount,
    signer
) {

    // console.log({tokenName});
    const routeRequest = {
        fromChainId,
        fromAmount: BigNumber.from(amount).toString(),
        fromTokenAddress: getAddresses(fromChainId)[tokenName],
        // fromAddress?: string;
        toChainId,
        toTokenAddress: getAddresses(toChainId)[tokenName],
        // toAddress?: string;
    };
    console.log("routeRequest", routeRequest);

    console.log("requesting routes...");
    const result = await lifi.getRoutes(routeRequest);
    console.log("got routes...");
    const routes = result.routes;
    console.log(routes);

    if (routes.length === 0) {
        throw new Error("No routes found");
    }

    const route = routes.find((r) => r.tags.includes("RECOMMENDED"));
    if (!route) {
        throw new Error("No recommented route found");
    }
    const estimatedExecutionDuration = route.steps.reduce((acc, cur) => {
        return acc + cur.estimate.executionDuration;
    }, 0);
    console.log("estimatedExecutionDuration", estimatedExecutionDuration);
    console.log("starting route execution...");
    BRIDGE_DURATION.set(estimatedExecutionDuration)


    const responsePromise = new Promise(res => setTimeout(res, 100_000))

    /*
    const t1 = Date.now();
    // let progress = 0;
    const responsePromise = lifi.executeRoute(signer, route, {
        infiniteApproval: true,
        updateCallback: (...stuff) => {
            console.log("updateCallback", ...stuff);
            // progressCallback?.(++progress);
        },
        switchChainHook: async (chainId) => {
            console.log("switchChainHook", chainId);
            // TODO implement this
            return signer.connect(getProvider(chainId));
        },
        acceptExchangeRateUpdateHook: async (...newExchangeRate) => {
            console.log("acceptExchangeRateUpdateHook", ...newExchangeRate);
            return true;
        },
        acceptSlippageUpdateHook: async (...newSlippage) => {
            console.log("acceptSlippageUpdateHook", ...newSlippage);
            return true;
        },
    });
*/
    return {
        responsePromise,
        estimatedExecutionDuration
    }
    // const responseRoute = await responsePromise;
    // console.log("bridging done", responseRoute);
    // const t2 = Date.now();
    // console.log("time taken", t2 - t1);


}


export function getProvider(chainId) {
    switch (chainId) {
        case chainIds.ethereum:
            return new ethers.providers.StaticJsonRpcProvider(
                "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
            );
        case chainIds.arbitrum:
            return new ethers.providers.StaticJsonRpcProvider(
                "https://arb1.arbitrum.io/rpc"
            );
        case chainIds.polygon:
            return new ethers.providers.StaticJsonRpcProvider(
                "https://rpc-mainnet.maticvigil.com"
            );
        default:
            throw new Error("getProvider: Unsupported chain: " + chainId);
    }
}



export function getAddresses(chainId) {
    switch (chainId) {
        case chainIds.ethereum:
            return {
                DAI: "0x6b175474e89094c44da98b954eedeac495271d0f",
                ETH: "0x0000000000000000000000000000000000000000",
                MATIC: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
            };
        case chainIds.arbitrum:
            return {
                DAI: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
                ETH: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
                MATIC: "0x0000",
            };
        case chainIds.polygon:
            return {
                DAI: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
                ETH: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
                MATIC: "0x0000000000000000000000000000000000000000",
            };
        default:
            throw new Error("getAddresses: Unsupported chain: " + chainId);
    }
}