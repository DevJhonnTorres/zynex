import { Navbar }      from '@/components/ui/Navbar'
import { OrderBook }   from '@/components/exchange/OrderBook'
import { CreateOrder } from '@/components/exchange/CreateOrder'
import { MintUsdt }    from '@/components/exchange/MintUsdt'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Stats bar */}
      <div className="border-b border-white/5 bg-[#0d0d0d]">
        <div className="max-w-[1400px] mx-auto px-6 h-10 flex items-center gap-8">
          <div className="font-mono text-[10px] text-white/20">
            <span className="text-white/40">RED </span>Base Sepolia
          </div>
          <div className="font-mono text-[10px] text-white/20">
            <span className="text-white/40">TOKEN </span>USDT (mock)
          </div>
          <div className="font-mono text-[10px] text-white/20">
            <span className="text-white/40">FEE </span>5%
          </div>
          <div className="ml-auto">
            <MintUsdt />
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex-1 max-w-[1400px] mx-auto w-full px-6 py-8 grid grid-cols-[1fr_380px] gap-8">

        {/* Left — order book */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="font-mono text-[9px] tracking-[3px] text-[#FF6A00]/60 mb-1">01 · ÓRDENES</div>
              <h1 className="text-[22px] font-bold tracking-tight">Mercado P2P</h1>
            </div>
            <div className="font-mono text-[10px] text-white/20">
              Actualiza cada 15s
            </div>
          </div>
          <OrderBook />
        </div>

        {/* Right — create order */}
        <div className="space-y-4">
          <div>
            <div className="font-mono text-[9px] tracking-[3px] text-[#FF6A00]/60 mb-1">02 · VENDER</div>
            <h2 className="text-[18px] font-bold tracking-tight mb-4">Nueva Orden</h2>
          </div>
          <CreateOrder />

          {/* Info box */}
          <div className="border border-white/5 bg-[#0d0d0d] p-5 space-y-3">
            <div className="font-mono text-[9px] tracking-[2px] text-white/20 mb-3">CÓMO FUNCIONA</div>
            {[
              ['01', 'Vendedor deposita USDT en escrow vía smart contract'],
              ['02', 'Comprador transfiere COP por Nequi con el ID de orden'],
              ['03', 'Agente verifica el pago y libera el USDT automáticamente'],
              ['04', 'Sin custodia — el contrato es el árbitro'],
            ].map(([num, txt]) => (
              <div key={num} className="flex gap-3">
                <span className="font-mono text-[9px] text-[#FF6A00]/40 mt-0.5 shrink-0">{num}</span>
                <span className="text-[12px] text-white/30 leading-relaxed">{txt}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
