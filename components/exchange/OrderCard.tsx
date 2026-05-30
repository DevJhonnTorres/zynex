'use client'
import { useReadContracts, useWriteContract, useAccount } from 'wagmi'
import { INSTANCE_ABI, ESTADO_LABELS, formatUSDT, shortAddr } from '@/lib/contracts'

interface Props {
  address: `0x${string}`
  vendedor: `0x${string}`
  comprador: `0x${string}`
  monto: bigint
  deadline: bigint
}

export function OrderCard({ address: instancia, vendedor, comprador, monto, deadline }: Props) {
  const { address: wallet } = useAccount()
  const { writeContractAsync } = useWriteContract()

  const { data } = useReadContracts({
    contracts: [
      { address: instancia, abi: INSTANCE_ABI, functionName: 'estado' },
    ],
  })

  const estado = data?.[0]?.result as number | undefined
  const info   = estado !== undefined ? ESTADO_LABELS[estado] : null
  const now    = BigInt(Math.floor(Date.now() / 1000))
  const minLeft = deadline > now ? Number((deadline - now) / 60n) : 0

  const isVendedor  = wallet?.toLowerCase() === vendedor.toLowerCase()
  const isComprador = wallet?.toLowerCase() === comprador.toLowerCase()

  async function liberar() {
    await writeContractAsync({ address: instancia, abi: INSTANCE_ABI, functionName: 'liberarEscrow' })
  }

  async function disputar() {
    await writeContractAsync({ address: instancia, abi: INSTANCE_ABI, functionName: 'abrirDisputa' })
  }

  return (
    <div className="border border-white/6 bg-[#0f0f0f] p-5 hover:border-white/12 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="font-mono text-[9px] tracking-[2px] text-white/20 mb-1">ORDEN</div>
          <div className="font-mono text-[10px] text-white/40">{shortAddr(instancia)}</div>
        </div>
        {info && (
          <span
            className="font-mono text-[9px] tracking-[1px] px-2 py-1 border"
            style={{ color: info.color, borderColor: `${info.color}30` }}
          >
            {info.label.toUpperCase()}
          </span>
        )}
      </div>

      <div className="text-[22px] font-bold text-white mb-4">
        {formatUSDT(monto)} <span className="text-[14px] text-white/30 font-normal">USDT</span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <div className="font-mono text-[9px] tracking-[2px] text-white/20 mb-1">VENDEDOR</div>
          <div className="font-mono text-[11px] text-white/60">{shortAddr(vendedor)}</div>
        </div>
        <div>
          <div className="font-mono text-[9px] tracking-[2px] text-white/20 mb-1">COMPRADOR</div>
          <div className="font-mono text-[11px] text-white/60">{shortAddr(comprador)}</div>
        </div>
      </div>

      {estado === 1 && minLeft > 0 && (
        <div className="font-mono text-[10px] text-[#FF6A00]/60 mb-4">
          ⏱ {minLeft} min restantes
        </div>
      )}

      {estado === 1 && wallet && (
        <div className="flex gap-2">
          {isVendedor && (
            <button
              onClick={liberar}
              className="flex-1 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-green-400 font-mono text-[10px] tracking-[1px] py-2 transition-colors"
            >
              LIBERAR
            </button>
          )}
          {(isVendedor || isComprador) && (
            <button
              onClick={disputar}
              className="flex-1 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/20 text-yellow-400 font-mono text-[10px] tracking-[1px] py-2 transition-colors"
            >
              DISPUTAR
            </button>
          )}
        </div>
      )}
    </div>
  )
}
