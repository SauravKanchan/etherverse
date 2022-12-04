import { ethers } from "ethers";
import { chainIds, getProvider } from "../lifi"

const ethereumProvider = getProvider(chainIds.ethereum)


export async function fetchEnsDetails(address) {
    const ensName = await ethereumProvider.lookupAddress(address);
    if (!ensName) {
        return null;
    }

    // getting attributes
    const ensPublicResolver = new ethers.Contract('0x4976fb03c32e5b8cfe2b6ccb31c09ba78ebaba41',
        ['function text(bytes32 node, string key) view returns (string text)'], ethereumProvider
    );

    const nameHash = ethers.utils.namehash(ensName);
    const ensip5_txtRecords =
        ['avatar', 'description', 'display', 'email',
            'keywords', 'mail', 'notice', 'location', 'phone',
            'url', 'com.github', 'com.peepeth', 'com.linkedin',
            'com.twitter', 'io.keybase', 'org.telegram'];

    const details = {};

    for (const txtRecord of ensip5_txtRecords) {
        const result = await ensPublicResolver.text(nameHash, txtRecord)
        if (result) {
            details[txtRecord] = result;
        }
    }

    // fallback records for adding compability for earlier version of ENSIP-5.
    if (!details['com.github']) {
        const result = await ensPublicResolver.text(nameHash, 'vnd.github')
        if (result) {
            details['com.github'] = result;
        }
    }
    if (!details['com.peepeth']) {
        const result = await ensPublicResolver.text(nameHash, 'vnd.peepeth')
        if (result) {
            details['com.peepeth'] = result;
        }
    }
    if (!details['com.twitter']) {
        const result = await ensPublicResolver.text(nameHash, 'vnd.twitter')
        if (result) {
            details['com.twitter'] = result;
        }
    }

    return { ensName, details };
}

// fetchEnsDetails('0xd8da6bf26964af9d7eed9e03e53415d37aa96045').then(console.log)