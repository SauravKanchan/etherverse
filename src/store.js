import { writable } from 'svelte/store'
export const IS_LOCK = writable(false)
export const ENTRY_BLOCKS = writable({
    building: {
        x: 100,
        y: 100,
    },
    nft: {
        x: 100,
        y: 100,
    },
})
