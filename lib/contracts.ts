import { baseSepolia } from 'wagmi/chains'

export const CONTRACTS = {
  [baseSepolia.id]: {
    MockUSDT:      '0x1725cd2965e4D57DB3C60DcB3F7CDD97D86B62A0' as `0x${string}`,
    DisputeModule: '0x7E29A04508aaC9Affdcd8F7Ed3e15cd66e1eD408' as `0x${string}`,
    EscrowFactory: '0x5F737b9455eC9b823A949DDFCB86f0E934025279' as `0x${string}`,
  },
}

export const FACTORY_ABI = [
  { name: 'crearOrden', type: 'function', stateMutability: 'nonpayable',
    inputs: [
      { name: 'comprador',        type: 'address' },
      { name: 'monto',            type: 'uint256' },
      { name: 'referenciaPago',   type: 'bytes32' },
      { name: 'duracionSegundos', type: 'uint256' },
    ],
    outputs: [{ name: 'instancia', type: 'address' }],
  },
  { name: 'feeBps',          type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  { name: 'agentePrincipal', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'address' }] },
  { name: 'esInstanciaValida', type: 'function', stateMutability: 'view',
    inputs: [{ name: '', type: 'address' }], outputs: [{ type: 'bool' }],
  },
  {
    name: 'OrdenCreada', type: 'event',
    inputs: [
      { name: 'instancia',      type: 'address', indexed: true  },
      { name: 'vendedor',       type: 'address', indexed: true  },
      { name: 'comprador',      type: 'address', indexed: true  },
      { name: 'monto',          type: 'uint256', indexed: false },
      { name: 'referenciaPago', type: 'bytes32', indexed: false },
      { name: 'deadline',       type: 'uint256', indexed: false },
    ],
  },
] as const

export const INSTANCE_ABI = [
  { name: 'estado',         type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint8'   }] },
  { name: 'vendedor',       type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'address' }] },
  { name: 'comprador',      type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'address' }] },
  { name: 'monto',          type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  { name: 'deadline',       type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  { name: 'referenciaPago', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'bytes32' }] },
  { name: 'feeBps',         type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  { name: 'agente',         type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'address' }] },
  { name: 'activarEscrow',  type: 'function', stateMutability: 'nonpayable', inputs: [], outputs: [] },
  { name: 'liberarEscrow',  type: 'function', stateMutability: 'nonpayable', inputs: [], outputs: [] },
  { name: 'expirarOrden',   type: 'function', stateMutability: 'nonpayable', inputs: [], outputs: [] },
  { name: 'abrirDisputa',   type: 'function', stateMutability: 'nonpayable', inputs: [], outputs: [] },
  { name: 'ejecutarResolucion', type: 'function', stateMutability: 'nonpayable',
    inputs: [{ name: 'ganador', type: 'address' }], outputs: [],
  },
] as const

export const USDT_ABI = [
  { name: 'balanceOf', type: 'function', stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }], outputs: [{ type: 'uint256' }],
  },
  { name: 'approve', type: 'function', stateMutability: 'nonpayable',
    inputs: [{ name: 'spender', type: 'address' }, { name: 'amount', type: 'uint256' }],
    outputs: [{ type: 'bool' }],
  },
  { name: 'allowance', type: 'function', stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }, { name: 'spender', type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
  { name: 'mint', type: 'function', stateMutability: 'nonpayable',
    inputs: [{ name: 'to', type: 'address' }, { name: 'amount', type: 'uint256' }],
    outputs: [],
  },
  { name: 'decimals', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint8' }] },
] as const

export const DISPUTE_ABI = [
  { name: 'registrarVoto', type: 'function', stateMutability: 'nonpayable',
    inputs: [{ name: 'instancia', type: 'address' }, { name: 'ganador', type: 'address' }],
    outputs: [],
  },
  { name: 'getDisputa', type: 'function', stateMutability: 'view',
    inputs: [{ name: 'instancia', type: 'address' }],
    outputs: [
      { name: 'comprador',      type: 'address' },
      { name: 'vendedor',       type: 'address' },
      { name: 'votosComprador', type: 'uint8'   },
      { name: 'votosVendedor',  type: 'uint8'   },
      { name: 'resuelta',       type: 'bool'    },
    ],
  },
] as const

export const ESTADO_LABELS: Record<number, { label: string; color: string }> = {
  0: { label: 'Creada',     color: '#666'    },
  1: { label: 'Activa',     color: '#22c55e' },
  2: { label: 'Completada', color: '#3b82f6' },
  3: { label: 'Expirada',   color: '#ef4444' },
  4: { label: 'En Disputa', color: '#f59e0b' },
  5: { label: 'Resuelta',   color: '#8b5cf6' },
}

export function formatUSDT(amount: bigint): string {
  return (Number(amount) / 1e6).toLocaleString('es-CO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function shortAddr(addr: string): string {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}
