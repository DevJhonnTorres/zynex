'use client'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { baseSepolia } from 'wagmi/chains'

export const wagmiConfig = getDefaultConfig({
  appName:   'Zynex P2P',
  projectId: 'zynex-p2p-exchange',
  chains:    [baseSepolia],
  ssr:       true,
})
