export async function getNotifications(signer) {
    let _user = await signer.getAddress()
    let { chainId } = await signer.provider.getNetwork()

    let res = await (
        await fetch(
            `https://backend-prod.epns.io/apis/v1/users/eip155:${chainId}:${_user}/feeds?page=1&limit=10&spam=true`
        )
    ).json()

    return res
}
