'use client'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useReadContract }  from 'wagmi'
import { baseSepolia }      from 'wagmi/chains'
import { CONTRACTS, USDT_ABI, formatUSDT } from '@/lib/contracts'
import { useAccount }       from 'wagmi'

export function Navbar() {
  const { address } = useAccount()
  const usdt = CONTRACTS[baseSepolia.id].MockUSDT

  const { data: balance } = useReadContract({
    address: usdt,
    abi:     USDT_ABI,
    functionName: 'balanceOf',
    args:    address ? [address] : undefined,
    query:   { enabled: !!address },
  })

  return (
    <header className="border-b border-white/5 bg-[#0d0d0d]">
      <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-mono text-[13px] font-bold tracking-[3px] text-white">
            ZYNEX <span className="text-[#FF6A00]">P2P</span>
          </span>
          <span className="font-mono text-[9px] tracking-[2px] text-white/20 border border-white/10 px-2 py-0.5">
            BASE SEPOLIA
          </span>
        </div>

        <div className="flex items-center gap-4">
          {address && balance !== undefined && (
            <div className="font-mono text-[11px] text-white/40">
              <span className="text-white/20">USDT </span>
              <span className="text-white/70">{formatUSDT(balance)}</span>
            </div>
          )}
          <ConnectButton
            chainStatus="none"
            showBalance={false}
            accountStatus="address"
          />
        </div>
      </div>
    </header>
  )
}
