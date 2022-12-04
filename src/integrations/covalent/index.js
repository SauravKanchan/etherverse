import { ethers } from 'ethers'

export async function fetchTokenDetails(address, chainId) {
    // const COVALENT_API_KEY = process.env.COVALENT
    const url = `https://api.covalenthq.com/v1/${chainId}/address/${address}/balances_v2/?key=ckey_b20ffd1ac5fd4f7da7a904f094b`

    let tokens = await (await fetch(url)).json()

    let returnObj = { MATIC: 0.0, ETH: 0.0, DAI: 0.0 }

    tokens = tokens.data.items

    const req_tokens = new Set(Object.keys(returnObj))

    for (let item of tokens) {
        if (req_tokens.has(item.contract_ticker_symbol)) {
            returnObj[item.contract_ticker_symbol] = ethers.utils.formatUnits(
                item.balance,
                item.contract_decimals
            )
            returnObj[item.contract_ticker_symbol] = (+returnObj[
                item.contract_ticker_symbol
            ]).toFixed(4)
        }
    }

    return returnObj
}
