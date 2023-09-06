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
    const [entranceFee, setEntranceFee] = useState("")
    const [numberOfPlayers, setNumberOfPlayers] = useState("")
    const [recentWinner, setRecentWinner] = useState("")
    const dispatch = useNotification()

    // console.log(contractAddress)

    // const {runContractFunction: enterLottery , isFetching, isLoading } =
    // useWeb3Contract({
    //   abi: abi,
    //   contractAddress: contractAddress,
    //   functionName: "enterLottery",
    //   params: {},
    // });

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

    async function handleNotification() {
        dispatch({
            type: info,
            message: "Tx Complete",
            title: "Tx Notification",
            position: "topR",
            icon: Bell
        })
    }

    


    useEffect(() => {
        if(isWeb3Enabled) {
            updateUIValues()
        }
    },[isWeb3Enabled])

    async function updateUIValues() {
        const entranceFeeFromCall = (await getEntranceFee()).toString()
        const numberOfPlayersFromCall = (await getNumberOfPlayers()).toString()
        const recentWinnerFromCall = (await getRecentWinner()).toString()
        console.log(numberOfPlayersFromCall)
        console.log(entranceFeeFromCall)
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
                <div className="flex flex-col">
                    <h2>Entrance Fee: {ethers.formatEther(entranceFee)}</h2>
                    <button onClick={
                        console.log("Okay")
                    } className="bg-teal-700 p-2">
                        Enter Lottery
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