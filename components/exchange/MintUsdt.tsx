'use client'
import { useAccount, useWriteContract } from 'wagmi'
import { parseUnits }                   from 'viem'
import { CONTRACTS, USDT_ABI }          from '@/lib/contracts'
import { baseSepolia }                  from 'wagmi/chains'

export function MintUsdt() {
  const { address }          = useAccount()
  const { writeContractAsync, isPending } = useWriteContract()

  async function mintear() {
    if (!address) return
    await writeContractAsync({
      address:      CONTRACTS[baseSepolia.id].MockUSDT,
      abi:          USDT_ABI,
      functionName: 'mint',
      args:         [address, parseUnits('1000', 6)],
    })
  }

  if (!address) return null

  return (
    <button
      onClick={mintear}
      disabled={isPending}
      className="font-mono text-[10px] tracking-[2px] text-white/20 hover:text-[#FF6A00]/60 transition-colors disabled:opacity-40"
    >
      {isPending ? 'MINTEANDO...' : '+ 1000 USDT (testnet)'}
    </button>
  )
}
