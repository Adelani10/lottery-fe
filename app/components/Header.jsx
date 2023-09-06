"use client"

import { ConnectButton } from "web3uikit"

export default function Header() {
    return (
        <div className="header flex justify-between py-4 border-b">
            <article className="flex flex-col items-start">
                <h1>Delani's Lottery</h1>
                <p className="text-sky-700 italic text-xs">how about you try your luck...</p>
            </article>

            <ConnectButton moralisAuth={false}/>
        </div>
    )
}