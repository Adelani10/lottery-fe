"use client"
import { MoralisProvider } from 'react-moralis'
import Header from './components/Header'
import Real from './components/real'
import { NotificationProvider } from 'web3uikit'

export default function Home() {
  return (
    <main className="space-y-3 px-2 container mx-auto">
      <MoralisProvider initializeOnMount={false}>
        <NotificationProvider>
          <Header/>
          <Real/>
        </NotificationProvider>
      </MoralisProvider>
    </main>
  )
}
