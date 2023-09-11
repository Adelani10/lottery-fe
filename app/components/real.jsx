"use client"

import { useMoralis, useWeb3Contract } from "react-moralis"
import { contractAddresses } from "../../constants"
import { abi } from "../../constants"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"


export default function Real() {

    
    const {chainId: chainIdHex, isWeb3Enabled} = useMoralis()
    const chainId = parseInt(chainIdHex)
    const contractAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    const [entranceFee, setEntranceFee] = useState("0")
    const [numberOfPlayers, setNumberOfPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")
    const dispatch = useNotification()

    const {runContractFunction: enterLottery , isFetching, isLoading } =
    useWeb3Contract({
      abi: abi,
      contractAddress: contractAddress,
      functionName: "enterLottery",
      params: {},
      msgValue: entranceFee
    });

    const {runContractFunction: getEntranceFee } =
    useWeb3Contract({
      abi: abi,
      contractAddress: contractAddress,
      functionName: "getEntranceFee",
      params: {},
    });

    const {runContractFunction: getNumberOfPlayers } =
    useWeb3Contract({
      abi: abi,
      contractAddress: contractAddress,
      functionName: "getNumberOfPlayers",
      params: {},
    });
    
    const {runContractFunction: getRecentWinner } =
    useWeb3Contract({
        abi: abi,
        contractAddress: contractAddress,
        functionName: "getRecentWinner",
        params: {},
    });
    
    useEffect(() => {
        if(isWeb3Enabled) {
            updateUIValues()
        }
    },[isWeb3Enabled])

    async function handleNotification() {
        dispatch({
            type: "info",
            message: "Tx Complete",
            title: "Tx Notification",
            position: "topR",
            icon: "bell"
        })
    }

    const handleSuccess = async (tx) => {
        try{
            await tx.wait(1)
            updateUIValues()
            handleNotification(tx)
        }
        catch(error) {
            console.log(error)
        }
    }


    async function updateUIValues() {
        const entranceFeeFromCall = (await getEntranceFee()).toString()
        const numberOfPlayersFromCall = (await getNumberOfPlayers()).toString()
        const recentWinnerFromCall = await getRecentWinner()
        setEntranceFee(entranceFeeFromCall)
        setNumberOfPlayers(numberOfPlayersFromCall)
        setRecentWinner(recentWinnerFromCall)
    }
    
    return (
        <div>
            {
            isWeb3Enabled ? 
            <div className=" flex justify-start flex-col">
                Contract address: 
                <h1 className="font-bold text-xl">{contractAddress}</h1>
                <div className="flex flex-col items-start">
                    <h2>Entrance Fee: {ethers.utils.formatEther(entranceFee)}</h2>
                    <button onClick={async () => await enterLottery({
                        onSuccess: handleSuccess,
                        onError: (error)=> console.log(error)
                        // onComplete:
                    })}
                    disabled={isFetching || isLoading}
                     className="bg-teal-700 rounded-sm p-2">
                        {
                            isFetching || isLoading ? 
                            <div className="animate-spin spinner-border border-b-2 rounded-full w-5 h-5 "></div> : <div>Enter Lottery</div>
                        }
                    </button>
                    <h2>Total number of players: {numberOfPlayers}</h2>
                    <h2>The most previous winner is {recentWinner}</h2>
                </div>
            </div>
            : 
            <p>Please connect your wallet, ty!</p>
            }
        </div>
    )
}