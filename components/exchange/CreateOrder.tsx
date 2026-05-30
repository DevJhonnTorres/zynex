'use client'
import { useState } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'
import { parseUnits, toHex, toBytes, keccak256, encodePacked } from 'viem'
import { CONTRACTS, FACTORY_ABI, USDT_ABI } from '@/lib/contracts'

export function CreateOrder() {
  const { address } = useAccount()
  const contracts   = CONTRACTS[baseSepolia.id]

  const [comprador,  setComprador]  = useState('')
  const [monto,      setMonto]      = useState('')
  const [duracion,   setDuracion]   = useState('30')
  const [step,       setStep]       = useState<'idle' | 'approving' | 'creating' | 'done'>('idle')
  const [txHash,     setTxHash]     = useState<`0x${string}` | undefined>()
  const [ordenAddr,  setOrdenAddr]  = useState<string | undefined>()

  const montoWei = monto ? parseUnits(monto, 6) : 0n

  const { data: allowance } = useReadContract({
    address:      contracts.MockUSDT,
    abi:          USDT_ABI,
    functionName: 'allowance',
    args:         address ? [address, contracts.EscrowFactory] : undefined,
    query:        { enabled: !!address },
  })

  const { data: feeBps } = useReadContract({
    address:      contracts.EscrowFactory,
    abi:          FACTORY_ABI,
    functionName: 'feeBps',
  })

  const { writeContractAsync } = useWriteContract()

  const { data: receipt } = useWaitForTransactionReceipt({
    hash:  txHash,
    query: { enabled: !!txHash },
  })

  const needsApproval = allowance !== undefined && montoWei > 0n && allowance < montoWei

  async function handleApprove() {
    if (!address) return
    setStep('approving')
    try {
      const hash = await writeContractAsync({
        address:      contracts.MockUSDT,
        abi:          USDT_ABI,
        functionName: 'approve',
        args:         [contracts.EscrowFactory, montoWei],
      })
      setTxHash(hash)
    } catch (e) {
      console.error(e)
      setStep('idle')
    }
  }

  async function handleCreate() {
    if (!address || !comprador) return
    setStep('creating')
    try {
      const refPago = keccak256(encodePacked(
        ['address', 'uint256'],
        [address, BigInt(Date.now())]
      ))
      const hash = await writeContractAsync({
        address:      contracts.EscrowFactory,
        abi:          FACTORY_ABI,
        functionName: 'crearOrden',
        args:         [
          comprador as `0x${string}`,
          montoWei,
          refPago,
          BigInt(parseInt(duracion) * 60),
        ],
      })
      setTxHash(hash)
      setStep('done')
    } catch (e) {
      console.error(e)
      setStep('idle')
    }
  }

  const fee = feeBps && montoWei > 0n ? (montoWei * feeBps) / 10000n : 0n
  const montoComprador = montoWei > 0n ? montoWei - fee : 0n

  return (
    <div className="border border-white/8 bg-[#0f0f0f] p-6">
      <div className="font-mono text-[9px] tracking-[3px] text-[#FF6A00]/60 mb-5">VENDER USDT</div>

      <div className="space-y-4">
        <div>
          <label className="block font-mono text-[10px] tracking-[2px] text-white/30 mb-2">COMPRADOR</label>
          <input
            type="text"
            placeholder="0x..."
            value={comprador}
            onChange={e => setComprador(e.target.value)}
            className="w-full bg-black border border-white/10 text-white text-[13px] font-mono px-3 py-2.5 focus:outline-none focus:border-[#FF6A00]/40 placeholder-white/20"
          />
        </div>

        <div>
          <label className="block font-mono text-[10px] tracking-[2px] text-white/30 mb-2">MONTO USDT</label>
          <input
            type="number"
            placeholder="100.00"
            value={monto}
            onChange={e => setMonto(e.target.value)}
            min="1"
            step="0.01"
            className="w-full bg-black border border-white/10 text-white text-[13px] font-mono px-3 py-2.5 focus:outline-none focus:border-[#FF6A00]/40 placeholder-white/20"
          />
        </div>

        <div>
          <label className="block font-mono text-[10px] tracking-[2px] text-white/30 mb-2">TIEMPO LÍMITE (min)</label>
          <select
            value={duracion}
            onChange={e => setDuracion(e.target.value)}
            className="w-full bg-black border border-white/10 text-white text-[13px] font-mono px-3 py-2.5 focus:outline-none focus:border-[#FF6A00]/40"
          >
            <option value="30">30 minutos</option>
            <option value="60">60 minutos</option>
            <option value="120">2 horas</option>
          </select>
        </div>

        {montoWei > 0n && (
          <div className="border border-white/5 bg-black/40 p-4 space-y-1.5">
            <div className="flex justify-between font-mono text-[11px]">
              <span className="text-white/30">Monto escrow</span>
              <span className="text-white">{(Number(montoWei) / 1e6).toFixed(2)} USDT</span>
            </div>
            <div className="flex justify-between font-mono text-[11px]">
              <span className="text-white/30">Fee protocolo ({feeBps ? Number(feeBps) / 100 : 0}%)</span>
              <span className="text-[#FF6A00]">-{(Number(fee) / 1e6).toFixed(2)} USDT</span>
            </div>
            <div className="border-t border-white/5 pt-1.5 flex justify-between font-mono text-[12px]">
              <span className="text-white/50">Comprador recibe</span>
              <span className="text-white font-bold">{(Number(montoComprador) / 1e6).toFixed(2)} USDT</span>
            </div>
          </div>
        )}

        {!address ? (
          <div className="font-mono text-[11px] text-white/30 text-center py-3">
            Conecta tu wallet para continuar
          </div>
        ) : needsApproval ? (
          <button
            onClick={handleApprove}
            disabled={step === 'approving' || !monto}
            className="w-full bg-white/10 hover:bg-white/15 text-white font-mono text-[11px] tracking-[2px] py-3 transition-colors disabled:opacity-40"
          >
            {step === 'approving' ? 'APROBANDO...' : `APROBAR ${monto || '0'} USDT`}
          </button>
        ) : (
          <button
            onClick={handleCreate}
            disabled={step === 'creating' || !monto || !comprador}
            className="w-full bg-[#FF6A00] hover:bg-[#ff7c1a] text-black font-mono font-bold text-[12px] tracking-[2px] py-3 transition-colors disabled:opacity-40"
          >
            {step === 'creating' ? 'CREANDO ORDEN...' : 'CREAR ORDEN'}
          </button>
        )}

        {step === 'done' && (
          <div className="border border-green-500/20 bg-green-500/5 p-4">
            <p className="font-mono text-[11px] text-green-400 mb-1">Orden creada exitosamente</p>
            <p className="font-mono text-[10px] text-white/30">
              El comprador tiene {duracion} minutos para transferir por Nequi
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
