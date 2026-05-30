'use client'
import { useEffect, useState } from 'react'
import { createPublicClient, http } from 'viem'
import { baseSepolia }              from 'viem/chains'
import { CONTRACTS, FACTORY_ABI }   from '@/lib/contracts'
import { OrderCard }                from './OrderCard'

interface Orden {
  instancia:  `0x${string}`
  vendedor:   `0x${string}`
  comprador:  `0x${string}`
  monto:      bigint
  deadline:   bigint
}

const client = createPublicClient({
  chain:     baseSepolia,
  transport: http('https://base-sepolia.g.alchemy.com/v2/riSVEADsEkOc1Du233bo_'),
})

export function OrderBook() {
  const [ordenes,  setOrdenes]  = useState<Orden[]>([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    async function fetchOrdenes() {
      try {
        const logs = await client.getContractEvents({
          address:   CONTRACTS[baseSepolia.id].EscrowFactory,
          abi:       FACTORY_ABI,
          eventName: 'OrdenCreada',
          fromBlock: 0n,
        })

        const parsed: Orden[] = logs
          .filter(l => l.args.instancia && l.args.vendedor && l.args.comprador)
          .map(l => ({
            instancia: l.args.instancia!,
            vendedor:  l.args.vendedor!,
            comprador: l.args.comprador!,
            monto:     l.args.monto!,
            deadline:  l.args.deadline!,
          }))
          .reverse()

        setOrdenes(parsed)
      } catch (e) {
        console.error('Error leyendo órdenes:', e)
      } finally {
        setLoading(false)
      }
    }

    fetchOrdenes()
    const interval = setInterval(fetchOrdenes, 15_000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="font-mono text-[11px] text-white/20 tracking-[2px]">CARGANDO ÓRDENES...</div>
      </div>
    )
  }

  if (ordenes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="font-mono text-[10px] tracking-[3px] text-white/20 mb-3">SIN ÓRDENES</div>
        <p className="text-[13px] text-white/30">Crea la primera orden usando el panel de la derecha</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {ordenes.map(o => (
        <OrderCard key={o.instancia} address={o.instancia} vendedor={o.vendedor} comprador={o.comprador} monto={o.monto} deadline={o.deadline} />
      ))}
    </div>
  )
}
